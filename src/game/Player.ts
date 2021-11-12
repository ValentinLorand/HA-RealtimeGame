import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import { SimpleObject } from "./SimpleObject.ts";


export class Player extends SimpleObject {
    ws?: WebSocketClient;
    counter_sweet: number;

    constructor(name: string, websocket?: WebSocketClient, x = 1, y = 1) {
        super(name, x, y);
        this.counter_sweet = 0;
        if (websocket != undefined) {
            this.ws = websocket;
        } else {
            this.ws = undefined;
        }

    }

    moveHorizontal(move: number) { this.x += move; }
    moveVertical(move: number) { this.y += move; }
    eatSweet() { this.counter_sweet += 1; }

    player() {
        return "Joueur " + this.name + " en position (" + this.x + " " + this.y + ") compteur=" + this.counter_sweet;
    }

    toJSON(): Record<string, unknown> {
        return {
            "kind": "player",
            "name": this.name,
            "x": this.x,
            "y": this.y,
            "counter_sweet": this.counter_sweet
        };
    }
}
