# HA-RealtimeGame

A basic game made with constraints for distributed systems's course at ESIR :
- realtime multiplayer
- high availability (SPOF elimination, redundancy, failure detection)
- basic graphical interface

[Link to Notion Page](https://vlo.notion.site/Eat-my-sweets-1716ee206fcf43c184ea5ee9b9c2df74)

**Requirements :** Deno(1.15.1)

## Start the application in dev mode
```
cd HA-RealtimeGame
deno run --allow-net --allow-read --watch src/server.ts
```

## Lancement des tests
```
cd HA-RealtimeGame
deno test
```

Developed by Leo Rolland and Valentin Lorand.