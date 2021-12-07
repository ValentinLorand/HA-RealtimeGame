// let websocketURI; DEFINE BEFORE IN HTML
let websocketURI2;
let websocketURI3;

function updateSocketsURIs(URIs) {
  if(websocketURI !== `${URIs[0]}`) {
    websocketURI=`${URIs[0]}`;
    console.log(`WebSocket server updated ! We need to create a new WebSocket tunnel`);
  }
  websocketURI2=`${URIs[1]}`;
  websocketURI3=`${URIs[2]}`;
}

function joinGame($event) {

  let nickname = getCookie("nickname")
  let secret = getCookie("secret")
  // console.log(websocketURI);
  const socket = new WebSocket(websocketURI);

  socket.onopen = function(e) {

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

    //If error received
    if (event.data.startsWith("error")) {
      const errCode = event.data.split(" ")[1]
      console.warn(`[error] server returned error code ${errCode}`)
      return
    }
    //Else do the job
    const data = JSON.parse(event.data)

    updateSocketsURIs(data["socket_servers"]);
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
    }
  };

  socket.onerror = function(event) {
    console.warn(`Error occured with current websocket, trying to connect to the next WebSocket URI`);
    websocketURI = websocketURI2;
    joinGame();
  }
}

if (getCookie("nickname") && getCookie("secret")) joinGame()