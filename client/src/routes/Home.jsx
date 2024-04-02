import { useState, useEffect } from "react";
import CreateGameDialog from "../components/CreateGameDialog";
import { socket } from "../socket";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../state/userState";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { gameState } from "../state/gameState";

function Home() {
  const [gameList, setGameList] = useState([]);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const setGameState = useSetRecoilState(gameState);

  const fetchGames = async () => {
    socket.emit("getGames");
    socket.on("gameList", ({ data }) => {
      setGameList(data);
    });
  };

  useEffect(() => {
    if (!user.id) {
      navigate("/login");
    }

    fetchGames();

    socket.on("newGame", ({ data }) => setGameList((prev) => [...prev, data]));

    socket.on("gameCreated", ({ data }) => {
      setGameState(data);
      if (data.p0 === user.id) {
        navigate(`/game/${data.id}`);
      }
    });

    socket.on("gameJoined", ({ data }) => {
      navigate(`/game/${data.id}`);
    });

    socket.on("error", (err) => {
      toast.error(err.message);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [user.id, navigate, setGameState]);

  const handleJoinGame = async (id) => {
    socket.emit("joinGame", { gameId: id, userId: user.id });
  };

  return (
    <main className="flex flex-col m-auto items-center">
      <h1 className="text-2xl mt-2">Open Games</h1>
      {gameList.length ? (
        <ul>
          {gameList.map(({ name, _id, p1 }) => (
            <li
              key={_id}
              className="flex items-center p-2 border-2 border-blue-200 rounded m-2 min-w-[250px] justify-between"
            >
              <p>{name}</p>
              {!p1 && (
                <>
                  <button
                    className="bg-blue-300 rounded p-2"
                    onClick={() => handleJoinGame(_id)}
                  >
                    Join
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2">No Games Yet...</p>
      )}
      {showGameDialog && (
        <>
          <div className=" absolute h-dvh w-screen bg-black opacity-50"></div>
          <CreateGameDialog
            setShowGameDialog={setShowGameDialog}
            userId={user.id}
          />
        </>
      )}
      <button
        className="bg-blue-200 rounded-xl p-2 mt-4"
        onClick={() => setShowGameDialog(!showGameDialog)}
      >
        Create Game
      </button>
    </main>
  );
}

export default Home;
