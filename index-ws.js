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

process.on("SIGINT", () => {
  wss.clients.forEach(client => {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
});

// web Socket

const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({server: server});

wss.on("connection", function connection(ws) {
  const numCLient = wss.clients.size;
  console.log("Client connected", numCLient);
  wss.broadcast("Current visitors " + numCLient);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server");
  }

  db.run(
    `INSERT INTO visitors(count, time) VALUES (${numCLient}, datetime('now'))`
  );

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

// end web socket
const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS  visitors (
      count INTEGER,
      time TEXT

    )
  `);
});

function getCounts() {
  db.each("SELECT * from visitors", (error, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log("Shutting down db");
  db.close();
}
