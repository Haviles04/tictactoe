import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";

function GameOverDialog({ winner }) {
  const navigate = useNavigate();

  const winningMessage = winner === socket.id ? "You Win!" : "You Lose!";

  const handleClick = () => {
    navigate("/");
  };
  return (
    <div className="p-10 mt-10 bg-blue-200 rounded-xl min-w-[250px] min-h-[250px] flex justify-center items-center flex-col ">
      <h2 className="text-2xl">Game Over</h2>
      <p>{winner === "stalemate" ? "Stalemate!" : winningMessage}</p>
      <button
        className="mt-10 bg-blue-100 border-black border-2 rounded p-4"
        onClick={handleClick}
      >
        Go Home
      </button>
    </div>
  );
}

export default GameOverDialog;
