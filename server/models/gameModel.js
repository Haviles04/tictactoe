const mongoose = require("mongoose");

const gameSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    p0: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    p1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    p0Boxes: {
      type: Array,
      default: [],
    },
    p1Boxes: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", gameSchema);
