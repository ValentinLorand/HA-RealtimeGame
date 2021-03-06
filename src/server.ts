import * as log from "https://deno.land/std@0.111.0/log/mod.ts";
import { renderFile } from "https://deno.land/x/dejs@0.9.3/mod.ts";
import { Application,Router,RouterContext,send } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import { adapterFactory,engineFactory,viewEngine } from "https://deno.land/x/view_engine@v1.5.0/mod.ts";
import { WebSocketClient,WebSocketServer } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import { GameWorld } from "./game/GameWorld.ts";
import { Player } from "./game/Player.ts";
import { manageSocketMessage, manageIdentification } from "./sockets.ts";
import { persistGameState, jsonToGameworld } from "./http.ts";

const logServer = log.getLogger();
logServer.level = 10;
/**
 * START THE WEB SERVER
 */
export async function startWebServer() {
  const SERVER_URL = Deno.env.get("SERVER_URL")!;
  const SERVER_PORT = Number(SERVER_URL.split(":")[2])

  // Setup engine
  const ejsEngine = engineFactory.getEjsEngine();
  const oakAdapter = adapterFactory.getOakAdapter();

  // Setup application
  const app = new Application();
  app.use(viewEngine(oakAdapter, ejsEngine));

  // Handlers
  async function handleIndex(ctx: RouterContext) {
    ctx.response.body = await renderFile(
      `${Deno.cwd()}/public/views/index.ejs`,
      {
        // Use the current browser URL's hostname instead of the one sent by server
        GITPOD_INTEGRATION: Deno.env.get("GITPOD_INTEGRATION") || false ,
      },
    );
  }

  async function handlePost(ctx: RouterContext) {
    const json = await ctx.request.body().value;
    GameWorldInstance = jsonToGameworld(json);
    ctx.response.body = {'code' : 0, 'message':'Done'};
    ctx.response.status = 200
  }


  async function handleGetServers(ctx: RouterContext) {
    // Gestion de la demande spécifique de la liste des sockets server
    var socketServers = Deno.env.get("SOCKETS_PRIORITY")!.split(",");
    ctx.response.body = {"socket_servers" : socketServers};
    ctx.response.status = 200
  }

  // Routes
  const router = new Router();
  router.get("/", handleIndex);
  router.post("/", handlePost);
  router.get("/servers", handleGetServers);

  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(async (context) => {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/public`,
    });
  });
  
  logServer.info(`✔ Web server listening on port ${SERVER_PORT} (${SERVER_URL})`);
  await app.listen({ port: SERVER_PORT });
}

/**
 * START SOCKET SERVER
 */
export function startSocketServer() {
  const SOCKET_PORT = Number(Deno.env.get("SOCKET_URL")!.split(":")[2]);
  const wss = new WebSocketServer(SOCKET_PORT);

  // Send a message to all players
  function sendAll(message: string) {
    for (const player of GameWorldInstance.getPlayers()) {
      if (player.ws !== undefined) {
        player.ws.send(message);
      }
    }
  }

  // New connection
  wss.on("connection", function (ws: WebSocketClient) {
    logServer.info("New visitor connected");

    // A chaque message que l'on reçoit d'un client
    ws.on("message", function (message: string) {
      let response = null;

      // Identification de l'emetteur du message
      const player = manageIdentification(message,ws,GameWorldInstance)

      if (player) {
        // Gestion du message et de ses effets puis génération d'un JSON.
        response = manageSocketMessage(player,message, GameWorldInstance);

        // Catch error secret
        if (!response) { response = "error unknown_message"; }
        else {
            // Reorder socket servers
            var socketServers = Deno.env.get("SOCKETS_PRIORITY")!.split(",");
            for (let i = 1; i < socketServers.length; i++) {
              if(socketServers[i] == Deno.env.get("SOCKET_URL")) {
                var tmp = socketServers[0];
                socketServers[0] = socketServers[i];
                socketServers[i] = tmp;
              }
            }
            Deno.env.set("SOCKETS_PRIORITY",socketServers.join(','))
            response["socket_servers"] = socketServers;
            // Retrieve secrets
            response["objects"].forEach((object:Record<string,any>) =>  {
              if(object["kind"] == "player") {
                object['secret'] = (GameWorldInstance.getObjectFromPos(object['x'],object['y']) as Player).secret;
              }
            });
            logServer.debug(socketServers);
            persistGameState(response);
        }
      } else {
        logServer.warning("Identification failed.");
        // Catch error secret
        response = "error unknown_secret";
      }
      
      // On envoi le JSON à toutes les joueurs de la partie.
      sendAll(JSON.stringify(response));
    });
  });
  logServer.info("✔ Socket server ready on port "+SOCKET_PORT);
}

function check_env_var() {
  logServer.debug(Deno.env.toObject());
  if(Deno.env.get("SERVER_URL") === undefined) {
    logServer.error("Env variable not visible : SERVER_URL");
    Deno.exit(1);
  }
  else if(Deno.env.get("SOCKET_URL") === undefined) {
    logServer.error("Env variable not visible : SOCKET_URL");
    Deno.exit(1);
  }
  else if(Deno.env.get("SOCKETS_PRIORITY") === undefined) {
    logServer.error("Env variable not visible : SOCKETS_PRIORITY");
    Deno.exit(1);
  }
  else if(Deno.env.get("OTHER_CLUSTER_NODES") === undefined) {
    logServer.error("Env variable not visible : OTHER_CLUSTER_NODES");
    Deno.exit(1);
  }
}

//Check configurations
check_env_var();

// Init a game
export let GameWorldInstance = new GameWorld();

// Start socket server
startSocketServer();

// Start web application
startWebServer();
