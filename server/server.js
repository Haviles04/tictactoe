require("dotenv").config();
const express = require("express");
const colors = require("colors");
const connectDb = require("./config/db");
const { createServer } = require("node:http");
const port = process.env.PORT;
const cors = require("cors");
const app = express();
const { errorHandler } = require("./middleware/errorMiddleware");
const games = require("./routes/gameRoutes");
const users = require("./routes/userRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use("/api/games", games);
app.use("/api/users", users);
app.use(errorHandler);
const { Server } = require("socket.io");
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.set("io", io);
connectDb();

server.listen(port, () => {
  console.log(`Server started on port ${port}`.magenta);
});

io.on("connection", (socket) => {
  console.log("a user connected");
});
