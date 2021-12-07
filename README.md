# HA-RealtimeGame

A basic game made with constraints for distributed systems's course at ESIR :
- realtime multiplayer
- high availability (SPOF elimination, redundancy, failure detection)
- basic graphical interface

[Link to Notion Page](https://vlo.notion.site/Eat-my-sweets-1716ee206fcf43c184ea5ee9b9c2df74)

**Requirements :** Deno(1.15.1)

## Launch the application in dev mode
```
cd HA-RealtimeGame
echo -e "SERVER_URL=127.0.0.1:8000\nSOCKET_URL=127.0.0.1:8080" > .env
deno run --allow-net --allow-read --allow-env --watch src/server.ts
```

## Start a server instance
```
cd HA-RealtimeGame
docker build -t realtimegame:latest .
docker run -it -p 8000:8000 -p 8080:8080 --name=realtimegame realtimegame:latest
```

## Start three servers instances
```
cd HA-RealtimeGame
docker-compose up --build
```

## Run tests
```
cd HA-RealtimeGame
deno test --allow-net
```

Developed by Leo Rolland and Valentin Lorand.