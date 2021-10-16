import * as log from "https://deno.land/std@0.111.0/log/mod.ts";
import {Application} from 'https://deno.land/x/oak@v6.2.0/mod.ts'; //Dernière version 9.0.0 mais ne fonctionne pas
import {viewEngine, engineFactory, adapterFactory } from 'https://deno.land/x/view_engine@v1.4.5/mod.ts';

// Setup engine
const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

// Setup application
const app = new Application();
app.use(viewEngine(oakAdapter, ejsEngine));

// Define the templace to use
app.use((ctx) => {
  ctx.render(`${Deno.cwd()}/static/index.ejb`, {data: {msg: 'Tips'}});
});

// Start application
log.info("Démarrage du serveur sur le port 8000...")
await app.listen({port: 8000});  