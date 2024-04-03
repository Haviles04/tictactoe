const Game = require("../models/gameModel");

module.exports = (io, socket) => {
  const getGames = async () => {
    try {
      const games = await Game.find({ p1: null });
      socket.emit("gameList", { ok: true, data: games });
    } catch (err) {
      socket.emit("error", { ok: false, message: err.message });
    }
  };

  const leaveGame = async (payload) => {
    const { gameId } = payload;
    socket.leave(gameId);
  };

  const createGame = async (payload) => {
    try {
      const { name, p0, bot } = payload;

      if (!name) {
        throw new Error("Missing Game Name");
      }

      const p1 = bot ? "bot" : null;

      const newGame = await Game.create({ name, p0, p1, bot });

      if (!newGame._id) {
        throw new Error("Error creating game");
      }

      const populatedGame = await newGame.populate("p0");

      io.emit("newGame", { ok: true, data: populatedGame });

      const idString = populatedGame._id.toString();

      socket.join(idString);
      io.in(idString).emit("gameCreated", {
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

      if (!foundGame || !userId) {
        throw new Error("Error joining game");
      }

      if (foundGame.p1) {
        throw new Error("Game already full");
      }

      const updatedGame = await Game.findByIdAndUpdate(
        foundGame._id,
        {
          p1: userId,
        },
        {
          returnDocument: "after",
        }
      )
        .populate("p0")
        .populate("p1");

      const idString = updatedGame._id.toString();

      socket.join(idString);
      io.in(idString).emit("gameJoined", {
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

      const botTurn = whosTurn === "p1" && foundGame.bot;

      const getBoxValue = () => {
        const number = Math.floor(Math.random() * 9) + 1;
        if (![...foundGame.p0Boxes, ...foundGame.p1Boxes].includes(number)) {
          return number;
        }
        return getBoxValue();
      };

      const boxValue = botTurn ? getBoxValue() : box;

      const populatedGame = await Game.findByIdAndUpdate(
        foundGame._id,
        {
          [`${key}Boxes`]: [...foundGame[`${key}Boxes`], boxValue],
          turn: foundGame.turn + 1,
        },
        {
          returnDocument: "after",
        }
      )
        .populate("p0")
        .populate("p1");

      const idString = populatedGame._id.toString();

      if (checkWinGame(populatedGame[`${key}Boxes`])) {
        io.in(idString).emit(`${key}Win`, {
          ok: true,
        });
        return;
      }

      if (
        !checkWinGame(populatedGame[`${key}Boxes`]) &&
        populatedGame.turn === 9
      ) {
        io.in(idString).emit(`stalemate`, {
          ok: true,
        });
        return;
      }

      if (botTurn) {
        io.in(idString).emit("botMove", {
          ok: true,
          data: populatedGame,
        });
      } else {
        io.in(idString).emit("pMoveComplete", {
          ok: true,
          data: populatedGame,
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
  socket.on("leaveGame", leaveGame);
  socket.on("joinGame", joinGame);
  socket.on("p0Move", p0Move);
  socket.on("p1Move", p1Move);
};
