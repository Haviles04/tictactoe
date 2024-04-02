import { atom } from "recoil";

export const gameState = atom({
  key: "game",
  default: {
    _id: null,
    name: "",
    p0: {},
    p1: {},
    p0Boxes: [],
    p1Boxes: [],
  },
});
