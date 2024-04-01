const express = require("express");
const router = express.Router();
const {
  getGames,
  createGame,
  joinGame,
  deleteGames,
} = require("../controllers/gameController");

router.route("/").get(getGames).post(createGame);
router.route("/:id").delete(deleteGames).put(joinGame);

module.exports = router;
