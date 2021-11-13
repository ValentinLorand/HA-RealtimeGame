import { assertEquals,assertExists } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import {delay} from "https://deno.land/std@0.114.0/async/mod.ts";
import { GameWorldInstance } from "../src/server.ts";
import * as log from "https://deno.land/std@0.111.0/log/mod.ts"

const loggerServer = log.getLogger()
loggerServer.level = 30

Deno.test("Join Game", async () => {
  GameWorldInstance.reset();
  const testNbPlayerBefore = GameWorldInstance.getPlayers().length;

  // Player 1 join the game
  const socket = new WebSocket('ws://127.0.0.1:8080');
  socket.onopen = function() { socket.send('join_game valentin secret');}
  await delay(200);
  const testNbPlayerBetween = GameWorldInstance.getPlayers().length;

  // Player 2 join the game
  const socket2 = new WebSocket('ws://127.0.0.1:8080');
  socket2.onopen = function() { socket2.send('join_game leo secret2'); } // BUG : One websocket can join 2 time the same game
  await delay(200);
  const testNbPlayerAfter = GameWorldInstance.getPlayers().length;

  socket.close();
  socket2.close();
  assertEquals(testNbPlayerBefore,0);
  assertEquals(testNbPlayerBetween,1);
  assertEquals(testNbPlayerAfter,2);
});

Deno.test("Move up", async () => {
  GameWorldInstance.reset();
  const testNbPlayerBefore = GameWorldInstance.getPlayers().length;

  // The player join the game
  const socket = new WebSocket('ws://127.0.0.1:8080');
  socket.onopen = function() { socket.send('join_game valentin secret'); }
  await delay(200);

  let player = GameWorldInstance.getPlayerFromSecret("secret");
  assertExists(player);
  assertEquals(player.name,"valentin");
  const x1 = player.x
  const y1 = player.y
  const testNbPlayerAfter = GameWorldInstance.getPlayers().length;

  // The player wants to move up
  socket.send('ask_move_up secret');
  await delay(200);
  player = GameWorldInstance.getPlayerFromSecret("secret");
  assertExists(player);
  assertEquals(player.name,"valentin");
  const x2 = player.x
  const y2 = player.y

  socket.close();
  assertEquals(testNbPlayerBefore,0);
  assertEquals(testNbPlayerAfter,1);
  assertEquals(x1,x2);
  assertEquals(y1-1,y2);
});

Deno.test("Move down", async () => {
  GameWorldInstance.reset();
  const testNbPlayerBefore = GameWorldInstance.getPlayers().length;

  // One player join the game
  const socket = new WebSocket('ws://127.0.0.1:8080');
  socket.onopen = function() { socket.send('join_game vallelorand secret'); }
  await delay(200);

  let player = GameWorldInstance.getPlayerFromSecret("secret");
  assertExists(player);
  assertEquals(player.name,"vallelorand");
  const x1 = player.x
  const y1 = player.y
  const testNbPlayerAfter = GameWorldInstance.getPlayers().length;

  // The player wants to move down
  socket.send('ask_move_down secret');
  await delay(200);
  player = GameWorldInstance.getPlayerFromSecret("secret");
  assertExists(player);
  const x2 = player.x
  const y2 = player.y

  socket.close();
  assertEquals(testNbPlayerBefore,0);
  assertEquals(testNbPlayerAfter,1);
  assertEquals(x1,x2);
  assertEquals(y1+1,y2);
});

Deno.test("Move left", async () => {
  GameWorldInstance.reset();
  const testNbPlayerBefore = GameWorldInstance.getPlayers().length;

  // One player join the game
  const socket = new WebSocket('ws://127.0.0.1:8080');
  socket.onopen = function() { socket.send('join_game valentin secret'); }
  await delay(200);

  let player = GameWorldInstance.getPlayerFromSecret("secret");
  assertExists(player);
  assertEquals(player.name,"valentin");
  const x1 = player.x
  const y1 = player.y
  const testNbPlayerAfter = GameWorldInstance.getPlayers().length;

  // The player wants to move left
  socket.send('ask_move_left secret');
  await delay(200);
  player = GameWorldInstance.getPlayerFromSecret("secret");
  assertExists(player);
  const x2 = player.x
  const y2 = player.y

  socket.close();
  assertEquals(testNbPlayerBefore,0);
  assertEquals(testNbPlayerAfter,1);
  assertEquals(x1-1,x2);
  assertEquals(y1,y2);
});

Deno.test("Move right", async () => {
  GameWorldInstance.reset();
  const testNbPlayerBefore = GameWorldInstance.getPlayers().length;

  // One player join the game
  const socket = new WebSocket('ws://127.0.0.1:8080');
  socket.onopen = function() { socket.send('join_game valentin secret'); }
  await delay(200);

  let player = GameWorldInstance.getPlayerFromSecret("secret");
  assertExists(player);
  assertEquals(player.name,"valentin");
  const x1 = player.x
  const y1 = player.y
  const testNbPlayerAfter = GameWorldInstance.getPlayers().length;

  // The player wants to move right
  socket.send('ask_move_right secret');
  await delay(200);
  player = GameWorldInstance.getPlayerFromSecret("secret");
  assertExists(player);
  const x2 = player.x
  const y2 = player.y

  socket.close();
  assertEquals(testNbPlayerBefore,0);
  assertEquals(testNbPlayerAfter,1);
  assertEquals(x1+1,x2);
  assertEquals(y1,y2);
});