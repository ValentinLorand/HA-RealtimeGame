import { assertEquals, AssertionError, assertThrows } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { GameWorldInstance } from "../src/server.ts";
import * as log from "https://deno.land/std@0.111.0/log/mod.ts";

const loggerServer = log.getLogger()
loggerServer.level = 40

Deno.test({
  name: "GET list of available servers",
  async fn() {
      GameWorldInstance.reset();
      const SERVER_URL = Deno.env.get("SERVER_URL")!;  
      const SOCKETS_PRIORITY = Deno.env.get("SOCKETS_PRIORITY")!;  

      fetch(SERVER_URL   + "/servers")
      //If the request succeed
      .then( async(response) =>  {
          if (response.ok) {
              assertEquals(response.status, 200);
              assertEquals(await response.json(),{"socket_servers":SOCKETS_PRIORITY.split(',')})
          } else {
              throw new AssertionError("Response KO");
          }
      })
      //If the request failed
      .catch((error) => {
          throw new AssertionError(error);
      });
  },
  sanitizeResources: false,
  sanitizeOps: false, 
});

Deno.test({
  name: "POST current state of the game",
  async fn() {
      GameWorldInstance.reset();
      const SERVER_URL = Deno.env.get("SERVER_URL")!;  
      const SOCKETS_PRIORITY = Deno.env.get("SOCKETS_PRIORITY")!;  
      
      fetch(SERVER_URL,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: `{"socket_servers" : ${SOCKETS_PRIORITY.split(",")}}`
      })
      //If the request succeed
      .then( async(response) =>  {
          if (response.ok) {
              assertEquals(response.status, 200);
              assertEquals({'code' : 0, 'message':'Done'},await response.json())
          } else {
              throw new AssertionError("Response KO");
          }
      })
      //If the request failed
      .catch((error) => {
          throw new AssertionError(error);
      });
  },
  sanitizeResources: false,
  sanitizeOps: false, 
});