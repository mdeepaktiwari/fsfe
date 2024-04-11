const express = require("express");
const server = require("http").createServer();

const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", {root: __dirname});
});

server.on("request", app);

server.listen(3000, function () {
  console.log("Server is running on port 3000");
});

// web Socket

const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({server: server});

wss.on("connection", function connection(ws) {
  const numCLient = wss.clients.size;
  console.log("Client connected", numCLient);
  wss.broadcast("Current visitors "+ numCLient);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server");
  }

  ws.on("close", function close() {
    wss.broadcast("Current visitors " + numCLient);
    console.log("Client has disconnected");
  });
});

wss.broadcast = function (data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
