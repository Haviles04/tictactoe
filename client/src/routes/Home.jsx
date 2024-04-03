import { useState, useEffect } from "react";
import CreateGameDialog from "../components/CreateGameDialog";
import { socket } from "../socket";
import { userState } from "../state/userState";
import { useNavigate } from "react-router-dom";
import { gameListState } from "../state/gameListState";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { gameState } from "../state/gameState";

function Home() {
  const setGameList = useSetRecoilState(gameListState);
  const setGameState = useSetRecoilState(gameState);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const gameList = useRecoilValue(gameListState);

  const fetchGames = async () => {
    socket.emit("getGames");
  };

  useEffect(() => {
    //   if (!user.id) {
    //     navigate("/login");
    //   }

    fetchGames();

    socket.on("gameList", ({ data }) => {
      setGameList(data);
    });

    socket.on("newGame", ({ data }) => {
      setGameList((prev) => [...prev, data]);
    });

    socket.on("gameCreated", ({ data }) => {
      setGameState(data);
      if (data.p0 === socket.id) {
        navigate(`/game/${data._id}`);
      }
    });

    socket.on("gameJoined", ({ data }) => {
      setGameState(data);
      if (data.p1 === socket.id) {
        navigate(`/game/${data._id}`);
      }
    });

    return () => {
      socket.off("gameList");
      socket.off("newGame");
      socket.off("gameCreated");
      socket.off("gameJoined");
    };
  }, [navigate, setGameList, setGameState]);

  const handleJoinGame = async (id) => {
    socket.emit("joinGame", { gameId: id, userId: socket.id });
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
