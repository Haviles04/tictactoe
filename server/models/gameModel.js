const mongoose = require("mongoose");

const gameSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    p0: {
      type: String,
      required: true,
      default: "",
    },
    p1: {
      type: String,
    },
    p0Boxes: {
      type: Array,
      default: [],
    },
    p1Boxes: {
      type: Array,
      default: [],
    },
    turn: {
      type: Number,
      default: 0,
    },
    bot: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", gameSchema);
