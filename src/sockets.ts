import {GameWorld} from "./objects.ts"

export function manageSocketMessage(message:string,gameworld:GameWorld) :Record<string,unknown> {
    if (message == "create_game") {
        gameworld.reset()
        return new GameWorld().to_json();
    }
    else {
        throw new ErrorEvent('Message non compréhensible : ' + message)
    }
}