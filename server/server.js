require("dotenv").config();
const path = require("path");
const express = require("express");
const colors = require("colors");
const connectDb = require("./config/db");
const { createServer } = require("node:http");
const port = process.env.PORT;
const app = express();
const registerGamesHandler = require("./handlers/GameHandler");

connectDb();
const onConnection = (socket) => {
  registerGamesHandler(io, socket);
};

const { Server } = require("socket.io");
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "client", "build", "index.html")
    )
  );
}

io.sockets.on("connection", onConnection);

server.listen(port, () => {
  console.log(`Server started on port ${port}`.magenta);
});
