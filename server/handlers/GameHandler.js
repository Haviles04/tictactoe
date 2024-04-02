const Game = require("../models/gameModel");
const User = require("../models/userModel");

module.exports = (io, socket) => {
  const getGames = async () => {
    try {
      const games = await Game.find();
      socket.emit("gameList", { ok: true, data: games });
    } catch (err) {
      socket.emit("error", { ok: false, message: err.message });
    }
  };

  const createGame = async (payload) => {
    try {
      const { name, p0 } = payload;

      if (!name) {
        throw new Error("Missing Game Name");
      }

      const newGame = await Game.create({ name, p0 });

      if (!newGame._id) {
        throw new Error("Error creating game");
      }

      const populatedGame = await newGame.populate("p0");

      io.emit("newGame", { ok: true, data: populatedGame });

      console.log(populatedGame._id);

      socket.join(Number(populatedGame._id));
      io.in(Number(populatedGame._id)).emit("gameCreated", {
        ok: true,
        data: populatedGame,
      });
    } catch (err) {
      socket.emit("error", { ok: false, message: err.message });
    }
  };

  const joinGame = async (payload) => {
    try {
      const { gameId, userId } = payload;
      const foundGame = await Game.findById(gameId);
      const foundUser = await User.findById(userId);

      if (!foundGame || !foundUser) {
        throw new Error("Error joining game");
      }

      if (foundGame.p0._id === foundUser._id) {
        throw new Error("Cannot join game you are already a part of");
      }

      if (foundGame.p1) {
        throw new Error("Game already full");
      }

      const updatedGame = await Game.findByIdAndUpdate(
        foundGame._id,
        {
          p1: foundUser._id,
        },
        {
          returnDocument: "after",
        }
      )
        .populate("p0")
        .populate("p1");
      console.log(updatedGame._id);

      socket.join(Number(updatedGame._id));
      io.in(Number(updatedGame._id)).emit("gameJoined", {
        ok: true,
        data: updatedGame,
      });
    } catch (err) {
      socket.emit("error", { ok: false, message: err.message });
    }
  };

  socket.on("getGames", getGames);
  socket.on("createGame", createGame);
  socket.on("joinGame", joinGame);
};
