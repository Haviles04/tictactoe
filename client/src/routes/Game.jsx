import { useState, useEffect } from "react";
import { gameState } from "../state/gameState";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { socket } from "../socket";
import { useParams } from "react-router-dom";
import Box from "../components/game/Box";
import GameOverDialog from "../components/game/GameOverDialog";

function Game() {
  const [winner, setWinner] = useState();
  const game = useRecoilValue(gameState);
  const setGameState = useSetRecoilState(gameState);
  const { gameId } = useParams();

  useEffect(() => {
    socket.on("gameJoined", ({ data }) => {
      setGameState(data);
    });

    socket.on("pMoveComplete", ({ data }) => {
      setGameState(data);
      if (data.bot) {
        socket.volatile.emit("p1Move", { box: null, gameId: data._id });
      }
    });

    socket.on("botMove", ({ data }) => {
      setGameState(data);
    });

    socket.on("p0Win", ({ data }) => {
      setWinner(game.p0);
    });
    socket.on("p1Win", ({ data }) => {
      setWinner(game.p1);
    });
    socket.on("stalemate", ({ data }) => {
      setWinner("stalemate");
    });

    return () => {
      socket.off("gameJoined");
      socket.off("p0moveComplete");
      socket.off("p0Win");
      socket.off("p1Win");
    };
  }, [setGameState, gameId, game.p0, game.p1]);

  const boxes = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <main>
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-3xl">Game {game.name}</h1>

        {winner ? (
          <GameOverDialog winner={winner} gameId={game._id} />
        ) : (
          <div className="grid grid-cols-3 mt-10 p-2 relative">
            {boxes.map((num) => (
              <Box
                key={`box ${num}`}
                value={num}
                p0={game.p0}
                p1={game.p1}
                game={game}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Game;
