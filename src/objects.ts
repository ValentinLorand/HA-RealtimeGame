export class GameWorld {
    objects:SimpleObject[];
    dimension_x: number;
    dimension_y: number;
   
    constructor(dimensionX=20,dimensionY=20,) {
        this.objects = []
        this.dimension_x = dimensionX;
        this.dimension_y = dimensionY;
        for(let i = 0; i < 5; i++) {
            const randomX = Math.floor(Math.random() * this.dimension_x) +1;
            const randomY = Math.floor(Math.random() * this.dimension_y) +1;
            this.objects.push(new Sweet("sweet"+i,randomX,randomY));
            //TODO les sucreries ne doivent pas tomber sur le spawn d'un joueur et il ne doit pas y en a voir 2 sur la même case
        }
    }

    add_player(name:string) {
        const player = new Player(name);
        this.objects.push(player);
        return player;
    }

    move_vertical_player(name:string,move:number) {
        for (const i of this.objects) {
            if (i instanceof Player && i.name == name ) {
                    i.y += move;
            }
        }
    }

    move_horizontal_player(name:string,move:number) {
        for (const i of this.objects) {
            if (i instanceof Player && i.name == name) {
                    i.x += move;
            }
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

    constructor(name: string) {
        this.name = name;
    }

    abstract to_json():Record<string,unknown>;
}

export class Player extends SimpleObject{
    x: number;
    y: number;
    counter_sweet : number
   
    constructor(name: string,x=1,y=1,counterSweet=0) {
        super(name);
        this.x = x;
        this.y = y;
        this.counter_sweet = counterSweet
    }

    move_up() { this.x  -= 1; }
    move_right() { this.y  += 1; }
    move_down() { this.x  += 1; }
    move_left() { this.y  -= 1; }
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
    x: number;
    y: number;
   
    constructor(name: string,x=1,y=1) {
        super(name);
        this.x = x;
        this.y = y;
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

