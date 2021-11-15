import { GameWorld } from "./game/GameWorld.ts";
import { Player } from "./game/Player.ts";
import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import * as log from "https://deno.land/std@0.111.0/log/mod.ts";

export function manageSocketMessage(player:Player, message: String, gameworld: GameWorld): string {
  const raw = message.split(" ")
  
  if (raw[1] === "get_state" || raw[1] === "join_game" || raw[1] === "create_game") {
    return JSON.stringify(gameworld.toJSON());
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
    log.warning("Unknown message received by "+ player.name +" : " + raw[1]);
  }

  return JSON.stringify(gameworld.toJSON());
}

export function manageIdentification(message: String, ws: WebSocketClient, gameworld: GameWorld): Player|undefined {
  const raw = message.split(" ");
  let player = gameworld.getPlayerFromSecret(raw[0]);

  //If no player found
  if (player === undefined) {
    if ("create_game" === raw[1]) {
      const raw = message.split(" ");
      player = new Player(raw[2], raw[0], ws);
      gameworld.reset(); //TODO feature add new gameworld
      gameworld.addPlayer(player);
    } else if ("join_game" === raw[1]) {
      player = new Player(raw[2], raw[0], ws);
      gameworld.addPlayer(player);
    } else {
      log.warning("Unknown player, secret=" + raw[0]);
      return undefined;
    }
  } else {
    // Update player WebSockerClient
    player.ws = ws;
  }

  return player;
}
