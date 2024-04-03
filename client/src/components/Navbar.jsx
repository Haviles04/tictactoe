import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { gameState } from "../state/gameState";
import { socket } from "../socket";

function Navbar() {
  const game = useRecoilValue(gameState);
  const navigate = useNavigate();

  const handleNav = () => {
    if (game._id) {
      socket.emit("leaveGame", { gameId: game._id });
    }
    navigate("/");
  };

  return (
    <nav className="w-full bg-blue-100 rounded-b-xl">
      <div className="flex flex-row justify-between items-center max-w-[1200px] m-auto p-4 ">
        <button onClick={handleNav} className="text-2xl">
          Tic-Tac-Toe
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
