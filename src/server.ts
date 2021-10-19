import * as log from "https://deno.land/std@0.111.0/log/mod.ts";
import {Application,Router,RouterContext,send} from 'https://deno.land/x/oak@v6.2.0/mod.ts'; //Dernière version 9.0.0 mais ne fonctionne pas
import {viewEngine, engineFactory, adapterFactory } from 'https://deno.land/x/view_engine@v1.4.5/mod.ts';
import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import {GameWorld} from "./objects.ts"
import {manageSocketMessage} from "./sockets.ts"

// Setup engine
const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

// Setup application
const app = new Application();
app.use(viewEngine(oakAdapter, ejsEngine));


// Handlers
function handleIndex(ctx:RouterContext){
  ctx.render(`${Deno.cwd()}/public/views/index.ejs`, {data: {nom: 'Léo'}});
}


// Routes
const router = new Router();
router.get('/',handleIndex);
// router.get('/static/:path+',handleStatic);

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (context) => {
  await send(context, context.request.url.pathname, {
    root: `${Deno.cwd()}/public`,
  });
});

// Initialisation des variables de jeu
const gameworld = new GameWorld();
const PLAYERS:WebSocketClient[] = [];
const wss = new WebSocketServer(8080);

// Fonctions auxiliaires
function sendAll(message:string) {
  for (let i=0; i<PLAYERS.length; i++) {
    PLAYERS[i].send("Message: " + message);
  }
}

// Nouvelle Connexion
wss.on("connection", function (ws: WebSocketClient) {
  // Ajout du joueur à la liste
  PLAYERS.push(ws)
  gameworld.add_player("TODO")
  sendAll(JSON.stringify(gameworld.to_json()));
  // Nouveau message
  ws.on("message", function (message: string) {
    // Gestion du message et de ses effets puis génération d'un JSON.
    const result = manageSocketMessage(message,gameworld);
    // On envoi le JSON à toutes les joueurs de la partie.
    sendAll(JSON.stringify(result));
  });
});

// Start application
log.info("Démarrage du serveur sur le port 8000...")
await app.listen({port: 8000});