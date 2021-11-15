import { GameWorld } from "./game/GameWorld.ts";
import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import { Player } from "./game/Player.ts";
import * as log from "https://deno.land/std@0.111.0/log/mod.ts";

export function manageInGameMessage(secret: string, action: string, gameworld: GameWorld): string {
  const player = gameworld.getPlayerFromSecret(secret);
  
  //If no player found => ERROR
  if (player === undefined) {
    log.warning("Unknown player secret : " + secret);
    return "error unknown_message"
  }

  if (action == "get_state") {
    return JSON.stringify(gameworld.toJSON());
  } else if (action == "ask_move_up") {
    // Up move
    gameworld.moveVertical(player, -1);
  } else if (action == "ask_move_down") {
    // Down move
    gameworld.moveVertical(player, 1);
  } else if (action == "ask_move_right") {
    // Right move
    gameworld.moveHorizontal(player, 1);
  } else if (action == "ask_move_left") {
    // Left move
    gameworld.moveHorizontal(player, -1);
  } else {
    log.warning("Unknown message received by "+ player.name +" : " + action);
  }

  return JSON.stringify(gameworld.toJSON());
}

export function manageOutGameMessage(secret: string, action: string, name: string, ws: WebSocketClient, gameworld: GameWorld): string {

  if (action == "create_game") {
    const player = new Player(name, secret, ws);
    gameworld.reset(); //TODO feature add new gameworld
  } else if (action == "join_game") {
    const player = new Player(name, secret, ws);
    gameworld.addPlayer(player);

  } else if (action == "get_state") {
    const player = gameworld.getPlayerFromSecret(secret);
    if (!player) {
      log.warning("Unknown player secret : " + secret);
      return "error unknown_player"
    }
    player.ws = ws;
  }

  return JSON.stringify(gameworld.toJSON());
}
