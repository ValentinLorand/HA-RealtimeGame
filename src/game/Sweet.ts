import { SimpleObject } from "./SimpleObject.ts";


export class Sweet extends SimpleObject {

    constructor(name: string, x = 1, y = 1) {
        super(name, x, y);
    }

    sweet() {
        return "Bonbon " + this.name + " en position (" + this.x + " " + this.y + ")";
    }

    toJSON(): Record<string, unknown> {
        return {
            "kind": "sweet",
            "name": this.name,
            "x": this.x,
            "y": this.y,
        };
    }
}
