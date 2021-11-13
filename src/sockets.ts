import { GameWorld } from "./game/GameWorld.ts"
import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import { Player } from "./game/Player.ts";
import * as log from "https://deno.land/std@0.111.0/log/mod.ts";


export function manageSocketMessage(action: string, secret: string, gameworld: GameWorld) :Record<string,unknown> {
    if (action == "get_state") {
        return gameworld.toJSON();
    } 
    else if (action == "ask_move_up") {
        // Prise en compte de la demande d'un mouvement vers le haut    
        const player = gameworld.getPlayerFromSecret(secret);
        if (player) {
            gameworld.moveVertical(player,-1);
        }
    }
    else if (action == "ask_move_down") {
        // Prise en compte de la demande d'un mouvement vers le haut    
        const player = gameworld.getPlayerFromSecret(secret);
        if (player) {
            gameworld.moveVertical(player,1);
        }
    }
    else if (action == "ask_move_right") {
        // Prise en compte de la demande d'un mouvement vers le haut    
        const player = gameworld.getPlayerFromSecret(secret);
        if (player) {
            gameworld.moveHorizontal(player,1);
        }
    }
    else if (action == "ask_move_left") {
        // Prise en compte de la demande d'un mouvement vers le haut    
        const player = gameworld.getPlayerFromSecret(secret);
        if (player) {
            gameworld.moveHorizontal(player,-1);
        }
    }
    else {
        log.warning('Unknown message received : ' + action)
    }

    return gameworld.toJSON();
}

export function manageStartGameMessage(action: string, name:string, secret: string, ws:WebSocketClient,gameworld: GameWorld) :Record<string,unknown> {
    if (action == "create_game") {
        gameworld.reset();
    }
    else if (action == "join_game") {
        const player = new Player(name,secret,ws);
        gameworld.addPlayer(player);
    }

    return gameworld.toJSON();
}