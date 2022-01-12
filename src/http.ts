import * as log from "https://deno.land/std@0.111.0/log/mod.ts";
import { GameWorld } from "./game/GameWorld.ts";
import { Player } from "./game/Player.ts";
import { Sweet } from "./game/Sweet.ts";

const logHttp = log.getLogger();
logHttp.level = 10;

/**
 * Send POST request to a cible with JSON parameter
 */
export function persistGameState(json:Record<string, unknown>){
  const CLUSTER_NODES = Deno.env.get('OTHER_CLUSTER_NODES')!.split(",");

  CLUSTER_NODES.forEach((NODE:string) =>  {
    fetch(NODE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json)
    })
    //If the request succeed
    .then(async (response) =>  {
      if (response.ok) {
        //DO NOTHING
      } else {
        throw new Error('Something went wrong');
      }
    })
    //If the request failed
    .catch((error) => {
      logHttp.warning(`Unable to reach the node : ${NODE}.`)
      logHttp.debug(error)
    });
  })
}

/**
 * Return an instance of gameworld corresponding to the JSON in parameter
 */
 export function jsonToGameworld(json:Record<string, any>) :GameWorld {
  const game:Record<string,number> = json["game"];
  const objects = json["objects"];
  const result = new GameWorld(game["dimension_x"], game["dimension_y"],0);

  objects.forEach((object:Record<string, any>) =>  {
    if (object["kind"] === "player") {
      const player = new Player(object["name"],object["secret"],undefined,object["x"],object["y"],object["counter_sweet"]);
      result.addPlayer(player);
    } else if (object["kind"] === "sweet") {
      const sweet = new Sweet(object["name"],object["x"],object["y"]);
      result.addSweet(sweet);
    }
  });

  return result;
}