const Game = require("../models/gameModel");
const asyncHandler = require("express-async-handler");

// @desc Get Games
// @route GET /api/Games
// @acess Private
const getGames = asyncHandler(async (req, res) => {
  const Games = await Game.find();
  res.status(200).json(Games);
});

// @desc Set Games
// @route POST /api/Games
// @acess Private
const createGame = asyncHandler(async (req, res) => {
  const { p0, name } = req.body;

  if (!req.body.p0 || !req.body.name) {
    res.status(400);
    throw new Error("Missing Game Name");
  }

  const newGame = await Game.create({ p0, name });

  req.app.get("io").emit("newGame", newGame);
  res.status(200).json(newGame);
});

// @desc Update Game
// @route PUT /api/Games/id
// @acess Private
const joinGame = asyncHandler(async (req, res, next) => {
  try {
    const foundGame = await Game.findById(req.params.id);
    if (!foundGame) {
      res.status(400);
      throw new Error("Game not found");
    }

    if (foundGame.p1) {
      res.status(400);
      throw new Error("Game already full");
    }

    req.app.get("io").emit("gameJoined");
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(updatedGame);
  } catch (err) {
    next(err);
  }
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

module.exports = {
  getGames,
  createGame,
  joinGame,
  deleteGames,
};
