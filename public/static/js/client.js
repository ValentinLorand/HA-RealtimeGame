let websocketURI
if (window.location.hostname.includes("8000")) {
  // If app is ran in GitPod, websocket is at url 8080-<url>
  websocketURI = `wss://${window.location.hostname.replace("8000", "8080")}`
} else {
  // If ran as a regular server, websocket is on same hostname, unsecure, port 8080
  websocketURI = `ws://${window.location.hostname}:8080`
}
const socket = new WebSocket(websocketURI);

socket.onopen = function(e) {
  console.log("[open] Connection established");
  socket.send("join_game");
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