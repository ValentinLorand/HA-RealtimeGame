import * as log from "https://deno.land/std@0.111.0/log/mod.ts";
import { renderFile } from "https://deno.land/x/dejs@0.9.3/mod.ts";
import { Application,Router,RouterContext,send } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import { adapterFactory,engineFactory,viewEngine } from "https://deno.land/x/view_engine@v1.5.0/mod.ts";
import { WebSocketClient,WebSocketServer } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import { GameWorld } from "./game/GameWorld.ts";
import { manageOutGameMessage,manageInGameMessage } from "./sockets.ts";

const logServer = log.getLogger();
logServer.level = 10;
/**
 * START THE WEB SERVER
 */
export async function startWebServer() {
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
        data: { nom: "Léo" },
      },
    );
  }

  // Routes
  const router = new Router();
  router.get("/", handleIndex);

  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(async (context) => {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/public`,
    });
  });

  logServer.info("✔ Web server listening on port 8000 (http://127.0.0.1:8000)");
  await app.listen({ port: 8000 });
}

/**
 * START SOCKET SERVER
 */
export function startSocketServer() {
  const wss = new WebSocketServer(8080);

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
    logServer.info("New visitor connected.");
    // Nouveau message
    ws.on("message", function (message: string) {
      // Gestion du message et de ses effets puis génération d'un JSON.
      const actionAndSecret = message.split(" ")
      let result;
      if (actionAndSecret[0] === "join_game" ||actionAndSecret[0] === "create_game") {
        //TODO add check size of the array
        result = manageOutGameMessage(actionAndSecret[0], actionAndSecret[1],actionAndSecret[2],ws, GameWorldInstance);
      }
      else {
       result = manageInGameMessage(actionAndSecret[0], actionAndSecret[1], GameWorldInstance);
      }
      // On envoi le JSON à toutes les joueurs de la partie.
      sendAll(JSON.stringify(result));
    });
  });

  logServer.info("✔ Socket server ready on port 8080");
}

// Init a game
export const GameWorldInstance = new GameWorld();
// Start socket server
startSocketServer();
// Start web application
startWebServer();
