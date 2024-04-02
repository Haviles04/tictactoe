const Game = require("../models/gameModel");
const asyncHandler = require("express-async-handler");

module.exports = (io, socket) => {
  const getGames = async () => {
    const games = await Game.find({ id: 10232131 });

    if (!games) {
      socket.emit("error", "No Games Available");
    }
    socket.emit("gameList", games);
  };

  // @desc Set Games
  // @route POST /api/Games
  // @acess Private
  const createGame = async (payload) => {
    const { p0, name } = payload;

    if (p0 || name) {
      throw new Error("Missing Params");
    }

    const newGame = await Game.create({ p0, name });

    io.emit("newGame", newGame);
  };

  // @desc Update Game
  // @route PUT /api/Games/id
  // @acess Private
  const joinGame = asyncHandler(async (req, res, next) => {
    const foundGame = await Game.findById(req.params.id);
    if (!foundGame) {
      res.status(400);
      throw new Error("Game not found");
    }

    if (foundGame.p0._id === req.body.p1) {
      throw new Error("Cannot join game you are already a part of");
    }

    if (foundGame.p1) {
      res.status(400);
      throw new Error("Game already full");
    }

    global.io.emit("gameJoined");
    global.io.on("gameJoined", (socket) => {
      socket.join(req.params.id);
      console.log("socket joined room");
    });
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(updatedGame);
  });

  // @desc Delete Game
  // @route GET /api/Games/id
  // @acess Private
  const deleteGames = asyncHandler(async (req, res) => {
    const foundGame = await Game.findById(req.params.id);

    if (!foundGame) {
      res.status(400);
      throw new Error("Game not found");
    }

    await Game.deleteOne({ _id: req.params.id });

    res.status(200).json({ id: req.params.id });
  });

  socket.on("getGames", getGames);
  socket.on("createGame", createGame);
  socket.on("joinGame", joinGame);
};
