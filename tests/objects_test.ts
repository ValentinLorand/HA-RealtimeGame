import { assertEquals } from "https://deno.land/std@0.112.0/testing/asserts.ts";
import { GameWorld, Player, Sweet } from "../src/objects.ts";

// Simple name and function, compact form, but not configurable
Deno.test("Create Player", () => {
  const player = new Player("leo", undefined, 2, 3);
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
  assertEquals(game.number_sweet(), 5);
  assertEquals(game.number_player(), 0);
  assertEquals(game.get_players(), []);
});

Deno.test("Manage Gameworld", () => {
  const game = new GameWorld(25, 25);
  const player = new Player("Valentin");
  const player2 = new Player("Léo");
  game.add_player(player);
  assertEquals(game.number_sweet(), 5);
  assertEquals(game.number_player(), 1);
  assertEquals(game.get_players(), [player]);
  game.add_player(player2);
  assertEquals(game.number_sweet(), 5);
  assertEquals(game.number_player(), 2);
  assertEquals(game.get_players(), [player, player2]);
});

Deno.test("Move Player", () => {
  const game = new GameWorld(15, 15);
  const player = new Player("Valentin", undefined, 0, 0);
  game.add_player(player);
  for (let i = 0; i < 18; i++) game.move_horizontal(player, 1);
  assertEquals(game.number_player(), 1);
  assertEquals(player.x, 14);
  assertEquals(player.y, 0);
  for (let i = 0; i < 18; i++) game.move_vertical(player, 1);
  assertEquals(game.number_player(), 1);
  assertEquals(player.x, 14);
  assertEquals(player.y, 14);
});

Deno.test("Move Player2", () => {
    const game = new GameWorld(15, 15);
    const player = new Player("Valentin", undefined, 0, 0);
    game.add_player(player);
    game.move_horizontal(player, -1);
    assertEquals(player.x, 0);
    assertEquals(player.y, 0);
    game.move_vertical(player, -1);
    assertEquals(player.x, 0);
    assertEquals(player.y, 0);
    assertEquals(game.number_player(), 1);
  });
