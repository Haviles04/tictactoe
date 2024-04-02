import { useNavigate } from "react-router-dom";

function GameOverDialog({ winner }) {
  const navigate = useNavigate();

  console.log(winner);
  const handleClick = () => {
    navigate("/");
  };
  return (
    <div className="absolute p-10 bg-blue-200 rounded-xl w-full h-full flex justify-center items-center flex-col ">
      <h2 className="text-2xl">Game Over</h2>
      <p>{winner === "stalemate" ? "Stalemate!" : `${winner} Wins!`}</p>
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
