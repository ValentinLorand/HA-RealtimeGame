import {GameWorld,Player} from "./objects.ts"
import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import * as log from "https://deno.land/std@0.111.0/log/mod.ts";


export function manageSocketMessage(message:string, wsClient:WebSocketClient, gameworld:GameWorld) :Record<string,unknown> {
    if (message == "create_game") {
        gameworld.reset();
    }
    else if (message == "join_game") {
        const playerID = '' + Math.random().toString(36).substr(2, 9) + gameworld.number_player();
        const player = new Player(playerID,wsClient);
        gameworld.add_player(player);
    }   
    else if (message == "ask_move_up") {
        // Prise en compte de la demande d'un mouvement vers le haut    
        const player = gameworld.get_player_from_ws(wsClient);
        if (player) {
            gameworld.move_vertical(player,-1);
        }
    }
    else if (message == "ask_move_down") {
        // Prise en compte de la demande d'un mouvement vers le haut    
        const player = gameworld.get_player_from_ws(wsClient);
        if (player) {
            gameworld.move_vertical(player,1);
        }
    }
    else if (message == "ask_move_right") {
        // Prise en compte de la demande d'un mouvement vers le haut    
        const player = gameworld.get_player_from_ws(wsClient);
        if (player) {
            gameworld.move_horizontal(player,1);
        }
    }
    else if (message == "ask_move_left") {
        // Prise en compte de la demande d'un mouvement vers le haut    
        const player = gameworld.get_player_from_ws(wsClient);
        if (player) {
            gameworld.move_horizontal(player,-1);
        }
    }
    else {
        log.warning('Unknown message received : ' + message)
    }

    return new GameWorld().to_json();
}