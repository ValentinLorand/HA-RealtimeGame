import { assertEquals,assertExists, assertNotEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import {delay} from "https://deno.land/std@0.114.0/async/mod.ts";
import { GameWorldInstance } from "../src/server.ts";
import * as log from "https://deno.land/std@0.111.0/log/mod.ts";
import { StandardWebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import { on } from "https://deno.land/std@0.92.0/node/events.ts";

const loggerServer = log.getLogger()
loggerServer.level = 40

const endpoint = "ws://127.0.0.1:8080";

Deno.test(
  {
    name: "Connect to the server",
    async fn(): Promise<void> {
      GameWorldInstance.reset();

      const ws = new StandardWebSocketClient(endpoint);
      const open = on(ws, "open");
      assertEquals(ws.webSocket?.readyState, 0)

      await open.next();
      assertEquals(ws.webSocket?.readyState, 1)
      await ws.close();
      assertEquals(ws.webSocket?.readyState, 2)
      assertEquals(ws.isClosed, true)
    },
    sanitizeResources: false,
    sanitizeOps: false, 
  });

Deno.test({
  name: "Join Game",
  async fn(): Promise<void> {
    GameWorldInstance.reset();
    const testNbPlayerBefore = GameWorldInstance.getPlayers().length;

    // Player 1 join the game
    const socket = new StandardWebSocketClient(endpoint);
    const open = on(socket, "open");
    await open.next();
    await socket.send('secret join_game valentin');
    await delay(300);
    const testNbPlayerBetween = GameWorldInstance.getPlayers().length;

    // Player 2 join the game
    const socket2 = new StandardWebSocketClient(endpoint);
    const open2 = on(socket2, "open");
    await open2.next();
    await socket2.send('secret2 join_game leo'); // BUG : One websocket can join 2 time the same game
    await delay(300);
    const testNbPlayerAfter = GameWorldInstance.getPlayers().length;
    
    assertEquals(testNbPlayerBefore,0);
    assertEquals(testNbPlayerBetween,1);
    assertEquals(testNbPlayerAfter,2);

    await socket.close();
    await socket2.close();
  },
  sanitizeResources: false,
  sanitizeOps: false, 
});

Deno.test({
  name :"Join Game with unknown secret", 
  async fn () {
    GameWorldInstance.reset();

    // Join with an unknown secret
    const socket = new StandardWebSocketClient(endpoint);
    const open = on(socket, "open");
    await open.next();
    await socket.send('unknown_secret_toto get_state');
    await delay(300);
    // Expect correct error message
    let counter = 0;
    socket.on("message", m => {
      counter +=1;
      if (counter > 1) {
        assertEquals(m.data, "error unknown_secret");
      }
    });
    await socket.close();
  },
  sanitizeResources: false,
  sanitizeOps: false, 
});

Deno.test({
  name:"Move up", 
  async fn() {
    GameWorldInstance.reset();
    const testNbPlayerBefore = GameWorldInstance.getPlayers().length;

    // The player join the game
    const socket = new StandardWebSocketClient(endpoint);
    const open = on(socket, "open");
    await open.next();
    await socket.send('secret join_game valentin');
    await delay(300);

    let player = GameWorldInstance.getPlayerFromSecret("secret");
    assertExists(player);
    assertEquals(player.name,"valentin");
    const x1 = player.x
    const y1 = player.y
    const testNbPlayerAfter = GameWorldInstance.getPlayers().length;

    // The player wants to move up
    socket.send('secret ask_move_up');
    await delay(300);
    player = GameWorldInstance.getPlayerFromSecret("secret");
    assertExists(player);
    assertEquals(player.name,"valentin");
    const x2 = player.x
    const y2 = player.y

    assertEquals(testNbPlayerBefore,0);
    assertEquals(testNbPlayerAfter,1);
    assertEquals(x1,x2);
    assertEquals(y1-1,y2);
    
    await socket.close();
  },
  sanitizeResources: false,
  sanitizeOps: false, 
});

Deno.test({
  name:"Move down", 
  async fn() {
    GameWorldInstance.reset();
    const testNbPlayerBefore = GameWorldInstance.getPlayers().length;

    // One player join the game
    const socket = new StandardWebSocketClient(endpoint);
    const open = on(socket, "open");
    await open.next();
    socket.send('secret join_game vallelorand');
    await delay(300);

    let player = GameWorldInstance.getPlayerFromSecret("secret");
    assertExists(player);
    assertEquals(player.name,"vallelorand");
    const x1 = player.x
    const y1 = player.y
    const testNbPlayerAfter = GameWorldInstance.getPlayers().length;

    // The player wants to move down
    socket.send('secret ask_move_down');
    await delay(300);
    player = GameWorldInstance.getPlayerFromSecret("secret");
    assertExists(player);
    const x2 = player.x
    const y2 = player.y

    assertEquals(testNbPlayerBefore,0);
    assertEquals(testNbPlayerAfter,1);
    assertEquals(x1,x2);
    assertEquals(y1+1,y2);
    
    await socket.close();
  },
  sanitizeResources: false,
  sanitizeOps: false, 
});

Deno.test({
  name:"Move left", 
  async fn() {
    GameWorldInstance.reset();
    const testNbPlayerBefore = GameWorldInstance.getPlayers().length;

    // One player join the game
    const socket = new StandardWebSocketClient(endpoint);
    const open = on(socket, "open");
    await open.next();
    socket.send('secret join_game valentin');
    await delay(300);

    let player = GameWorldInstance.getPlayerFromSecret("secret");
    assertExists(player);
    assertEquals(player.name,"valentin");
    const x1 = player.x
    const y1 = player.y
    const testNbPlayerAfter = GameWorldInstance.getPlayers().length;

    // The player wants to move left
    socket.send('secret ask_move_left');
    await delay(300);
    player = GameWorldInstance.getPlayerFromSecret("secret");
    assertExists(player);
    const x2 = player.x
    const y2 = player.y

    assertEquals(testNbPlayerBefore,0);
    assertEquals(testNbPlayerAfter,1);
    assertEquals(x1-1,x2);
    assertEquals(y1,y2);
    
    await socket.close();
  },
  sanitizeResources: false,
  sanitizeOps: false, 
});

Deno.test({
  name:"Move right", 
  async fn() {
    GameWorldInstance.reset();
    const testNbPlayerBefore = GameWorldInstance.getPlayers().length;

    // One player join the game
    const socket = new StandardWebSocketClient(endpoint);
    const open = on(socket, "open");
    await open.next();
    socket.send('secret join_game valentin');
    await delay(300);

    let player = GameWorldInstance.getPlayerFromSecret("secret");
    assertExists(player);
    assertEquals(player.name,"valentin");
    const x1 = player.x
    const y1 = player.y
    const testNbPlayerAfter = GameWorldInstance.getPlayers().length;

    // The player wants to move right
    socket.send('secret ask_move_right');
    await delay(300);
    player = GameWorldInstance.getPlayerFromSecret("secret");
    assertExists(player);
    const x2 = player.x
    const y2 = player.y

    assertEquals(testNbPlayerBefore,0);
    assertEquals(testNbPlayerAfter,1);
    assertEquals(x1+1,x2);
    assertEquals(y1,y2);
    
    await socket.close();
  },
  sanitizeResources: false,
  sanitizeOps: false, 
});