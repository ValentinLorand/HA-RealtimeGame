class GameWorld {
    objects:SimpleObject[];
    dimension_x: number;
    dimension_y: number;
   
    constructor(dimension_x=20,dimension_y=20,) {
        this.objects = []
        this.dimension_x = dimension_x;
        this.dimension_y = dimension_y;
    }
   
    gameworld() {
      return "Jeu de dimension"+ this.dimension_x+"x"+this.dimension_y+") nombre d'objets:"+this.objects.length;
    }

    to_json() :object {
        let objets = []
        for (let o of this.objects){
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

    abstract to_json():object;
}

class Player extends SimpleObject{
    x: number;
    y: number;
    counter_sweet : number
   
    constructor(name: string,x=1,y=1,counter_sweet=0) {
        super(name);
        this.x = x;
        this.y = y;
        this.counter_sweet = counter_sweet
    }

    move_up() { this.x  -= 1; }
    move_right() { this.y  += 1; }
    move_down() { this.x  += 1; }
    move_left() { this.y  -= 1; }
    eat_sweet() { this.counter_sweet  += 1; }
   
    player() {
      return "Joueur "+this.name+" en position ("+ this.x+" "+this.y+") compteur="+this.counter_sweet;
    }

    to_json():object {
        return {
            "kind" : "player",
            "name" : this.name,
            "x" : this.x,
            "y" : this.y,
            "counter_sweet" : this.counter_sweet
        }
    }
}

class Sweet extends SimpleObject {
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

    to_json():object {
        return {
            "kind" : "sweet",
            "name" : this.name,
            "x" : this.x,
            "y" : this.y,
        };
    }
}

