export abstract class SimpleObject {
    name: string;
    x: number;
    y: number;

    constructor(name: string, x: number, y: number) {
        this.name = name;
        this.x = x;
        this.y = y;
    }

    abstract toJSON(): Record<string, unknown>;
}
