require("dotenv").config();
const express = require("express");
const colors = require("colors");
const connectDb = require("./config/db");
const port = process.env.PORT;
const cors = require("cors");
const app = express();
const { errorHandler } = require("./middleware/errorMiddleware");
const games = require("./routes/gameRoutes");
const users = require("./routes/userRoutes");

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);
app.use(cors());
app.use("/api/games", games);
app.use("/api/users", users);

app.listen(port, () => {
  console.log(`Server started on port ${port}`.magenta);
});
