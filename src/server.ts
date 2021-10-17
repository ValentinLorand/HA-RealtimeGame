import * as log from "https://deno.land/std@0.111.0/log/mod.ts";
import {Application,Router,RouterContext,send} from 'https://deno.land/x/oak@v6.2.0/mod.ts'; //Dernière version 9.0.0 mais ne fonctionne pas
import {viewEngine, engineFactory, adapterFactory } from 'https://deno.land/x/view_engine@v1.4.5/mod.ts';
import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.3/mod.ts";

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


//Start socket tunnel
const wss = new WebSocketServer(8080);
wss.on("connection", function (ws: WebSocketClient) {
  ws.on("message", function (message: string) {
    console.log(message);
    ws.send("Bonjour à toi client");
  });
});

// Start application
log.info("Démarrage du serveur sur le port 8000...")
await app.listen({port: 8000});