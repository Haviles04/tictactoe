const Game = require("../models/gameModel");
const User = require("../models/userModel");

module.exports = (io, socket) => {
  const getGames = async () => {
    try {
      const games = await Game.find({ p1: null });
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

      socket.join(Number(updatedGame._id));
      io.in(Number(updatedGame._id)).emit("gameJoined", {
        ok: true,
        data: updatedGame,
      });
    } catch (err) {
      socket.emit("error", { ok: false, message: err.message });
    }
  };

  const p0Move = async (payload) => {
    pMove(payload, "p0");
  };

  const p1Move = async (payload) => {
    pMove(payload, "p1");
  };

  const pMove = async (payload, key) => {
    try {
      const { box, gameId } = payload;
      const foundGame = await Game.findById(gameId);

      const whosTurn = (foundGame.turn + 1) % 2 === 1 ? "p0" : "p1";
      if (whosTurn !== key) {
        throw new Error("Not your turn!");
      }

      const populatedGame = await Game.findByIdAndUpdate(
        foundGame._id,
        {
          [`${key}Boxes`]: [...foundGame[`${key}Boxes`], box],
          turn: foundGame.turn + 1,
        },
        {
          returnDocument: "after",
        }
      )
        .populate("p0")
        .populate("p1");

      io.in(Number(populatedGame._id)).emit("pMoveComplete", {
        ok: true,
        data: populatedGame,
      });

      if (checkWinGame(populatedGame[`${key}Boxes`])) {
        io.in(Number(populatedGame._id)).emit(`${key}Win`, {
          ok: true,
        });
      }

      if (
        !checkWinGame(populatedGame[`${key}Boxes`]) &&
        populatedGame.turn === 9
      ) {
        console.log("stalemate!");
        io.in(Number(populatedGame._id)).emit(`stalemate`, {
          ok: true,
        });
      }
    } catch (err) {
      socket.emit("error", { ok: false, message: err.message });
    }
  };

  const checkWinGame = (arr) => {
    const wins = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 5, 9],
      [3, 5, 7],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ];

    for (let win of wins) {
      if (win.every((num) => arr.includes(num))) {
        return true;
      }
    }
  };

  socket.on("getGames", getGames);
  socket.on("createGame", createGame);
  socket.on("joinGame", joinGame);
  socket.on("p0Move", p0Move);
  socket.on("p1Move", p1Move);
};
