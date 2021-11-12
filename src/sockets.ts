import { GameWorld } from "./game/GameWorld.ts"
import { Player } from "./game/Player.ts";
import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import * as log from "https://deno.land/std@0.111.0/log/mod.ts";


export function manageSocketMessage(message: string, wsClient: WebSocketClient, gameworld: GameWorld) :Record<string,unknown> {
    if (message == "create_game") {
        gameworld.reset();
    }
    else if (message == "join_game") {
        const playerID = '' + Math.random().toString(36).substr(2, 9) + gameworld.getPlayers().length;
        const player = new Player(playerID,wsClient);
        gameworld.addPlayer(player);
    }   
    else if (message == "ask_move_up") {
        // Prise en compte de la demande d'un mouvement vers le haut    
        const player = gameworld.getPlayerFromWS(wsClient);
        if (player) {
            gameworld.moveVertical(player,-1);
        }
    }
    else if (message == "ask_move_down") {
        // Prise en compte de la demande d'un mouvement vers le haut    
        const player = gameworld.getPlayerFromWS(wsClient);
        if (player) {
            gameworld.moveVertical(player,1);
        }
    }
    else if (message == "ask_move_right") {
        // Prise en compte de la demande d'un mouvement vers le haut    
        const player = gameworld.getPlayerFromWS(wsClient);
        if (player) {
            gameworld.moveHorizontal(player,1);
        }
    }
    else if (message == "ask_move_left") {
        // Prise en compte de la demande d'un mouvement vers le haut    
        const player = gameworld.getPlayerFromWS(wsClient);
        if (player) {
            gameworld.moveHorizontal(player,-1);
        }
    }
    else {
        log.warning('Unknown message received : ' + message)
    }

    return gameworld.toJSON();
}