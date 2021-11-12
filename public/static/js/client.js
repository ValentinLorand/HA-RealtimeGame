let websocketURI
if (window.location.hostname.includes("8000")) {
  // If app is ran in GitPod, websocket is at url 8080-<url>
  websocketURI = `wss://${window.location.hostname.replace("8000", "8080")}`
} else {
  // If ran as a regular server, websocket is on same hostname, unsecure, port 8080
  websocketURI = `ws://${window.location.hostname}:8080`
}

function joinGame($event) {

  let nickname = getCookie("nickname")
  let secret = getCookie("secret")

  const socket = new WebSocket(websocketURI);

  socket.onopen = function(e) {

    if (secret != "" && nickname != "") {
      console.log(`Found cookie, using nickname ${nickname} and secret ${secret}`)
      socket.send(`get_state ${secret}`)
    } else {
      console.log(`No previous session found, creating one...`)
      nickname = document.getElementById("nickname").value.trim()
      setCookie("nickname", nickname)
      secret = makeid(10)
      setCookie("secret", secret)
      socket.send(`join_game ${nickname} ${secret}`);
      console.log(`[open] Session created. Game joined using nickname : ${nickname} secret : ${secret}`);
    }

  };
  
  socket.onmessage = function(event) {
    console.log(`[message] Data received from server: ${event.data}`);
    render(JSON.parse(event.data))
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

  socket.onerror = console.error

}

if (getCookie("nickname") && getCookie("secret")) joinGame()