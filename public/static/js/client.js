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
  alert("[open] Connection established");
  socket.send("Bonjour à toi serveur");
};

socket.onmessage = function(event) {
  alert(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    alert('[close] Connection died');
  }
};

socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
};