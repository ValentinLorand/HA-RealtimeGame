import { assertEquals } from "https://deno.land/std@0.112.0/testing/asserts.ts";
import { GameWorld } from "../src/game/GameWorld.ts";
import { Player } from "../src/game/Player.ts";
import { Sweet } from "../src/game/Sweet.ts";

// Simple name and function, compact form, but not configurable
Deno.test("Create Player", () => {
  const player = new Player("leo", "mysecret",undefined, 2, 3);
  assertEquals(player.name, "leo");
  assertEquals(player.x, 2);
  assertEquals(player.y, 3);
});

Deno.test("Create Sweet", () => {
  const sweet = new Sweet("miam", 5, 6);
  assertEquals(sweet.name, "miam");
  assertEquals(sweet.x, 5);
  assertEquals(sweet.y, 6);
});

Deno.test("Create Gameworld", () => {
  const game = new GameWorld(25, 25);
  assertEquals(game.dimension_x, 25);
  assertEquals(game.dimension_y, 25);
  assertEquals(game.getSweetCount(), 5);
  assertEquals(game.getPlayers(), []);
});

Deno.test("Manage Gameworld", () => {
  const game = new GameWorld(25, 25);
  const player = new Player("Valentin","monsecret");
  const player2 = new Player("Léo","sonsecret");
  game.addPlayer(player);
  assertEquals(game.getSweetCount(), 5);
  assertEquals(game.getPlayers(), [player]);
  game.addPlayer(player2);
  assertEquals(game.getSweetCount(), 5);
  assertEquals(game.getPlayers(), [player, player2]);
});

Deno.test("Move Player", () => {
  const game = new GameWorld(15, 15);
  const player = new Player("Valentin", "monsecret", undefined, 0, 0);
  game.addPlayer(player);
  for (let i = 0; i < 18; i++) game.moveHorizontal(player, 1);
  assertEquals(game.getPlayers().length, 1);
  assertEquals(player.x, 14);
  assertEquals(player.y, 0);
  for (let i = 0; i < 18; i++) game.moveVertical(player, 1);
  assertEquals(game.getPlayers().length, 1);
  assertEquals(player.x, 14);
  assertEquals(player.y, 14);
});

Deno.test("Move Player2", () => {
    const game = new GameWorld(15, 15);
    const player = new Player("Valentin", "monsecret", undefined, 0, 0);
    game.addPlayer(player);
    game.moveHorizontal(player, -1);
    assertEquals(player.x, 0);
    assertEquals(player.y, 0);
    game.moveVertical(player, -1);
    assertEquals(player.x, 0);
    assertEquals(player.y, 0);
    assertEquals(game.getPlayers().length, 1);
  });
