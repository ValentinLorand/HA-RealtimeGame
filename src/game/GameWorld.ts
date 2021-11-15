import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import { Sweet } from "./Sweet.ts";
import { SimpleObject } from "./SimpleObject.ts";
import { Player } from "./Player.ts";

export class GameWorld {
    private objects: SimpleObject[];
    dimension_x: number;
    dimension_y: number;

    constructor(dimensionX = 20, dimensionY = 20) {
        this.objects = [];
        this.dimension_x = dimensionX;
        this.dimension_y = dimensionY;
        this.generateSweets(5);
    }

    /**
     * Generator of sweet at a random free place on the game
     * @param N the number of sweet to generate
     */
    private generateSweets(N: number) {
        for (let i = 0; i < N; i++) {
            const randomX = Math.floor(Math.random() * this.dimension_x);
            const randomY = Math.floor(Math.random() * this.dimension_y);

            if (this.getObjectFromPos(randomX, randomY) === undefined) {
                this.objects.push(new Sweet("sweet" + i, randomX, randomY));
            } else {
                i--;
            }
        }
    }

    /**
     * @param player The player to add to the game
     */
    addPlayer(player: Player): Player {
        this.objects.push(player);
        return player;
    }

    /**
     *
     * @param x the horizontal position of the object
     * @param y the vertical position of the object
     * @returns The object at the correcponding position or undefined
     */
    getObjectFromPos(x: number, y: number): SimpleObject | undefined {
        return this.objects.find(e => e.x === x && e.y === y);
    }

    /**
     * @returns The players in the game in an array
     */
    getPlayers(): Player[] {
        return (this.objects.filter(i => i instanceof Player) as Player[]);
    }

    /**
     * @param secret a secret of a player
     * @returns The player concerned by the websocket
     */
    getPlayerFromSecret(secret: string): Player | undefined {
        return (this.objects.find(e => e instanceof Player && e.secret === secret) as Player);
    }

    /**
     * @param player The player ton move horizontally
     * @param move The number of unit to move [-dimension_x ; +dimension_x]
     */
    moveHorizontal(player: Player, move: number) {
        if (player.x + move < this.dimension_x && player.x + move >= 0) {
            const potentielObjet = this.getObjectFromPos(player.x + move, player.y);
            if (potentielObjet instanceof Sweet) {
                this.objects = this.objects.filter(o => o !== potentielObjet);
                player.eatSweet();
            //If there is a player, no move
            }else if (potentielObjet instanceof Player) {
                return
            }
            player.moveHorizontal(move);
        }
    }

    /**
     * 
     * @param player The player ton move vertically
     * @param move The number of unit to move [-dimension_y ; +dimension_y]
     */
    moveVertical(player: Player, move: number) {
        if (player.y + move < this.dimension_y && player.y + move >= 0) {
            const potentielObjet = this.getObjectFromPos(player.x, player.y + move);
            if (potentielObjet instanceof Sweet) {
                this.objects = this.objects.filter(o => o !== potentielObjet);
                player.eatSweet();
            //If there is a player, no move
            }else if (potentielObjet instanceof Player) {
                return
            }
            player.moveVertical(move);
        }
    }

    /**
     * @returns The number of sweets in the game
     */
    getSweetCount() : number {
    let counter = 0
    for (const i of this.objects) {
            if (i instanceof Sweet) {
                counter += 1
            }
        }
        return counter;
    }

    /**
     * Reset the game at a start state
     */
    reset() {
        this.objects = [];
        this.generateSweets(5);
    }

    toJSON(): Record<string, unknown> {
        const objets = [];
        for (const o of this.objects) {
            objets.push(o.toJSON());
        }

        return {
            "game": {
                "dimension_x": this.dimension_x,
                "dimension_y": this.dimension_y,
            },
            "objects": objets,
        };
    }
}
