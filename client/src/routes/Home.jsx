import { useState, useEffect } from "react";
import CreateGameDialog from "../components/CreateGameDialog";
import { socket } from "../socket";
import { useRecoilValue } from "recoil";
import { userState } from "../state/userState";
import { useNavigate } from "react-router-dom";

function Home() {
  const [gameList, setGameList] = useState([]);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  const fetchGames = async () => {
    const res = await fetch("api/games");
    const games = await res.json();
    setGameList(games);
  };

  useEffect(() => {
    if (!user.id) {
      navigate("/login");
    }
    fetchGames();
    socket.on("newGame", () => fetchGames());
    return () => {
      socket.off("newGame");
    };
  }, [user.id, navigate]);

  const handleJoinGame = (id) => {
    navigate(`/game/${id}`);
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
              {p1 ? (
                <p>2/2</p>
              ) : (
                <>
                  <p>1/2</p>
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
            fetchGames={fetchGames}
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