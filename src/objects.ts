import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
export class GameWorld {
    private objects:SimpleObject[];
    dimension_x: number;
    dimension_y: number;
   
    constructor(dimensionX=20,dimensionY=20,) {
        this.objects = []
        this.dimension_x = dimensionX;
        this.dimension_y = dimensionY;
        for(let i = 0; i < 5; i++) {
            const randomX = Math.floor(Math.random() * this.dimension_x) +1;
            const randomY = Math.floor(Math.random() * this.dimension_y) +1;
            
            if(this.get_object_from_pos(randomX,randomY) === undefined) {
                this.objects.push(new Sweet("sweet"+i,randomX,randomY));
            } else {
                i--;
            }            
        }
    }

    add_player(player:Player) : Player {
        this.objects.push(player);
        return player;
    }

    get_object_from_pos(x:number,y:number) : SimpleObject|undefined {
        return this.objects.find(e => e.x === x && e.y === y);
    }

    number_player() : number {
        let counter = 0
        for (const i of this.objects) {
            if (i instanceof Player) {
                counter += 1
            }
        }
        return counter;
    }

    get_players() : Player[] {
        return (this.objects.filter(i => i instanceof Player) as Player[]);
    }

    get_player_from_ws(ws:WebSocketClient) : Player|undefined {
        return (this.objects.find(e => e instanceof Player && e.ws === ws) as Player);
    }

    number_sweet() : number {
        let counter = 0
        for (const i of this.objects) {
            if (i instanceof Sweet) {
                counter += 1
            }
        }
        return counter;
    }

    move_horizontal(player:Player,move:number) {
        if (player.x + move < this.dimension_x && player.x + move >= 0){
            const potentielObjet = this.get_object_from_pos(player.x += move,player.y)
            if(potentielObjet instanceof Sweet) {
                this.objects = this.objects.filter(o => o !== potentielObjet);
                player.eat_sweet();
            }
            player.move_horizontal_player(move)
        }
    }
    

    move_vertical(player:Player,move:number) {
        if (player.y + move < this.dimension_y && player.y + move >= 0){
            const potentielObjet = this.get_object_from_pos(player.x, player.y += move)
            if(potentielObjet instanceof Sweet) {
                this.objects = this.objects.filter(o => o !== potentielObjet);
                player.eat_sweet();
            }
            player.move_vertical_player(move)
        }
    }
    reset() {
        this.objects = [];
        //TODO recreate some sweets
    }
   
    gameworld() {
      return "Jeu de dimension"+ this.dimension_x+"x"+this.dimension_y+") nombre d'objets:"+this.objects.length;
    }

    to_json() :Record<string,unknown> {
        const objets = []
        for (const o of this.objects){
            objets.push(o.to_json())
        }

        return {
            "game" : {
                "dimension_x" : this.dimension_x,
                "dimension_y" : this.dimension_y,
            },
            "objects" : objets,
        }
    }
}

abstract class SimpleObject {
    name: string;
    x: number;
    y: number;

    constructor(name: string,x:number,y:number) {
        this.name = name;
        this.x = x;
        this.y = y;
    }

    abstract to_json():Record<string,unknown>;
}

export class Player extends SimpleObject{
    ws? : WebSocketClient
    counter_sweet : number
   
    constructor(name:string, websocket?:WebSocketClient, x=1, y=1) {
        super(name,x,y);
        this.counter_sweet = 0
        if (websocket != undefined) {
            this.ws = websocket
        }else {
            this.ws = undefined;
        }
        
    }

    move_horizontal_player(move:number) { this.x  += move; }
    move_vertical_player(move:number) { this.y  += move; }
    eat_sweet() { this.counter_sweet  += 1; }
   
    player() {
      return "Joueur "+this.name+" en position ("+ this.x+" "+this.y+") compteur="+this.counter_sweet;
    }

    to_json():Record<string,unknown>{
        return {
            "kind" : "player",
            "name" : this.name,
            "x" : this.x,
            "y" : this.y,
            "counter_sweet" : this.counter_sweet
        }
    }
}

export class Sweet extends SimpleObject {
   
    constructor(name: string,x=1,y=1) {
        super(name,x,y);
    }
   
    sweet() {
      return "Bonbon "+this.name+" en position ("+ this.x+" "+this.y+")";
    }

    to_json():Record<string,unknown> {
        return {
            "kind" : "sweet",
            "name" : this.name,
            "x" : this.x,
            "y" : this.y,
        };
    }
}

