const serverEl = document.getElementById('server')

let lastReceivedData;
/**
 * Get the list of sockets URIs (as a Promise)
 * Example :
 *  
 *  Promise of :
 *     [
 *         "ws://127.0.0.1:8080",
 *         "ws://127.0.0.1:8081",
 *         "ws://127.0.0.1:8082"
 *     ]
 * 
 */
const getServers = () => fetch('/servers')
  .then(r => r.json())
  .then(json => json['socket_servers'])

function joinGame(sockets, socketIndex=0) {

  let nickname = getCookie("nickname")
  let secret = getCookie("secret")

  // Establish a WebSocket connection
  let socketURI = sockets[socketIndex % sockets.length]
  if (GITPOD_INTEGRATION) {
    const targetPort = socketURI.split(':').at(-1)
    socketURI = location.host.replace(/^[0-9]*/g, `wss://${targetPort}`)
  }
  serverEl.innerText = `Connecting to ${socketURI} ...`
  // If using a Gitpod context, override the provided server address by Gitpod Ingress (and WSS)
  const socket = new WebSocket(socketURI);

  socket.onopen = function(e) {
    serverEl.innerText = `Websocket successfully connected to ${socketURI}`
    if (secret != "" && nickname != "") {
      console.log(`Found cookie, using nickname ${nickname} and secret ${secret}`)
      socket.send(`${secret} get_state`)
    } else {
      console.log(`No previous session found, creating one...`)
      nickname = document.getElementById("nickname").value.trim()
      setCookie("nickname", nickname)
      secret = makeid(10)
      setCookie("secret", secret)
      socket.send(`${secret} join_game ${nickname}`);
      console.log(`[open] Session created. Game joined using nickname : ${nickname} secret : ${secret}`);
    }

    setupKeydownHandler(socket, secret)

  };
  
  socket.onmessage = function(event) {
    // Handle non-JSON messages (according to Specification_sockets_messages.md)
    if (event.data.startsWith("error")) {
      const errCode = event.data.split(" ")[1]
      switch (errCode) {
        case 'unknown_secret':
          clearCookies()
          location.reload();
          break;
        default:
          console.warn(`[error] server returned error code ${errCode}`)
      }
      return
    } else if (event.data.startsWith("game_over")) {
      let winnerName = event.data.split('game_over ')[1]
      alert("Game Over! Winner is " + winnerName)
      return
    }
    //Handle JSON message
    const data = JSON.parse(event.data)
    // Store last received data 
    lastReceivedData = data;

    sockets = data["socket_servers"]
    if("game" in data) {
      render(data);
    }
  };
  
  socket.onclose = function(event) {
    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.error('[close] Connection died');
      // TODO : check if connection closed expectedly
      joinGame(sockets, socketIndex + 1);
    }
  };

  socket.onerror = function(event) {
    serverEl.innerText = `Error occured with current websocket, trying to connect to the next WebSocket URI`
    socket.close()
  }
}

const connect = () => {
  getServers().then(joinGame)
}

if (getCookie("nickname") && getCookie("secret")) connect()