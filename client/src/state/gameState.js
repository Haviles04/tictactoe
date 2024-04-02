import { atom } from "recoil";

export const gameState = atom({
  key: "game",
  default: {
    _id: null,
    name: "",
    p0: null,
    p1: null,
    p0Boxes: [],
    p1Boxes: [],
  },
});
