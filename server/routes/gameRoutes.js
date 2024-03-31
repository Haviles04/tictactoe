const express = require('express');
const router = express.Router();
const { getGames, setGames, updateGames, deleteGames } = require('../controllers/gameController');

router.route('/').get(getGames).post(setGames);
router.route('/:id').delete(deleteGames).put(updateGames)

module.exports = router;