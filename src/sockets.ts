import { GameWorld } from "./game/GameWorld.ts";
import { Player } from "./game/Player.ts";
import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import * as log from "https://deno.land/std@0.111.0/log/mod.ts";

export function manageSocketMessage(player: Player, message: String, gameworld: GameWorld): Record<string,any> | null {
  const raw = message.split(" ");

  if (raw[1] === "get_state" || raw[1] === "join_game" || raw[1] === "create_game") {
    //DO NOTHING
  } else if (raw[1] === "ask_move_up") {
    // Up move
    gameworld.moveVertical(player, -1);
  } else if (raw[1] === "ask_move_down") {
    // Down move
    gameworld.moveVertical(player, 1);
  } else if (raw[1] === "ask_move_right") {
    // Right move
    gameworld.moveHorizontal(player, 1);
  } else if (raw[1] === "ask_move_left") {
    // Left move
    gameworld.moveHorizontal(player, -1);
  } else {
    log.warning("Unknown message received by " + player.name + " : " + raw[1]);
    return null;
  }

  return gameworld.toJSON();
}

export function manageIdentification(message: String, ws: WebSocketClient, gameworld: GameWorld): Player | undefined {
  const raw = message.split(" ");
  let player = gameworld.getPlayerFromSecret(raw[0]);

  //If no player found
  if (player === undefined) {
    if ("join_game" === raw[1]) {
      //Check number of player less than 10
      if (gameworld.getPlayers().length <= 10) {
        let randomX;
        let randomY;
        let placeFound = false;

        // Find a free space in the game.
        while (!placeFound) {
          randomX = Math.floor(Math.random() * gameworld.dimension_x);
          randomY = Math.floor(Math.random() * gameworld.dimension_y);
          if (gameworld.getObjectFromPos(randomX, randomY) === undefined) {
            placeFound = true;
          }
        }
        player = new Player(raw[2], raw[0], ws,randomX,randomY);
        gameworld.addPlayer(player);
      }
    } else {
      log.warning("Unknown player, secret=" + raw[0]);
      ws.send(`error unknown_secret`)
      return undefined;
    }
  } else {
    // Update player WebSockerClient
    player.ws = ws;
  }

  return player;
}
