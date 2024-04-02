import { useEffect } from "react";
import { gameState } from "../state/gameState";
import { userState } from "../state/userState";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { socket } from "../socket";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Box from "../components/game/Box";

function Game() {
  const user = useRecoilValue(userState);
  const game = useRecoilValue(gameState);
  const setGameState = useSetRecoilState(gameState);
  const { gameId } = useParams();

  useEffect(() => {
    socket.on("gameJoined", ({ data }) => {
      setGameState(data);
    });

    socket.on("error", (err) => {
      toast.error(err.message);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [setGameState, gameId]);

  const boxes = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <main>
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-3xl">Game {game.name}</h1>
        <h2 className="text-2xl">
          {game.p0.username} vs. {game.p1?.username}
        </h2>
        <div className="grid grid-cols-3 mt-10">
          {boxes.map((num) => (
            <Box
              key={`box ${num}`}
              value={num}
              p0={game.p0}
              p1={game.p1}
              user={user}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Game;
