import { useEffect } from "react";
import { gameState } from "../state/gameState";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { socket } from "../socket";
import { toast } from "react-toastify";

function Game() {
  const game = useRecoilValue(gameState);
  const setGameState = useSetRecoilState(gameState);

  useEffect(() => {
    socket.on("gameJoined", ({ data }) => {
      console.log("recieved");
      setGameState(data);
    });

    socket.on("error", (err) => {
      toast.error(err.message);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [setGameState]);

  return (
    <div>
      Game {game.name} {game.p1}
    </div>
  );
}

export default Game;
