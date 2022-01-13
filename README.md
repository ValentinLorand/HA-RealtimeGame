# HA-RealtimeGame 

![GitHub release (latest by date)](https://img.shields.io/github/v/release/ValentinLorand/HA-RealtimeGame)
<img src="https://img.shields.io/badge/Deno%20-%20v1.15.1-green"> ![GitHub repo size](https://img.shields.io/github/repo-size/ValentinLorand/HA-RealtimeGame)

A basic game made with constraints for distributed systems's course at ESIR :
- Realtime client-server multiplayer
- High Availability (SPOF elimination, redundancy, automatic failure detection & mitigation)
- Basic graphical interface

### One-click demonstration :

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ValentinLorand/HA-RealtimeGame)

1. Wait for servers to start and page being displayed
2. Navigate to the left side "Docker" section
3. Stop the currently used container (deno-1, port 8080)
4. Observe that <b>websockets automatically migrate to other replicas</b> and the game still works !
---

Engineering notes & doc : [![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)
](https://vlo.notion.site/Eat-my-sweets-1716ee206fcf43c184ea5ee9b9c2df74)


**Requirements :** Deno(1.15.1)

## Launch the application (1 instance) in dev mode
```
cd HA-RealtimeGame
export $(cat .env | sed 's/#.*//g' | xargs)
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
export $(cat .env | sed 's/#.*//g' | xargs)
deno test --allow-net --allow-env
```

Developed by [Leo Rolland](https://github.com/leorolland) and [Valentin Lorand](https://github.com/ValentinLorand).