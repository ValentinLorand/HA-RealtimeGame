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
  const socketURI = sockets[socketIndex % sockets.length]
  console.log(`Connecting to ${socketURI} ...`)
  const socket = new WebSocket(socketURI);

  socket.onopen = function(e) {
    console.log(`WebSocket connection established!`)
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
    console.log(`[message] Data received from server: ${event.data}`);

    // Handle non-JSON messages (according to Specification_sockets_messages.md)
    if (event.data.startsWith("error")) {
      const errCode = event.data.split(" ")[1]
      console.warn(`[error] server returned error code ${errCode}`)
      return
    } else if (event.data.startsWith("game_over")) {
      alert("Game Over! Winner is " + getWinner(lastReceivedData))
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
    console.warn(`Error occured with current websocket, trying to connect to the next WebSocket URI`);
    joinGame(sockets, socketIndex + 1);
  }
}

const connect = () => {
  getServers().then(joinGame)
}

if (getCookie("nickname") && getCookie("secret")) connect()