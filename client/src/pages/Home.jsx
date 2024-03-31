import { useState, useEffect } from "react";
import CreateGameDialog from "../components/CreateGameDialog";

function Home() {
  const [gameList, setGameList] = useState([]);
  const [showGameDialog, setShowGameDialog] = useState(false);

  const fetchGames = async () => {
    const res = await fetch("api/games");
    const games = await res.json();
    setGameList(games);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="flex flex-col m-auto items-center">
      <h1 className="text-2xl mt-2">Open Games</h1>
      {gameList.length ? (
        gameList.map((game) => (
          <div
            key={game.id}
            className="flex items-center p-2 border-2 border-blue-200 rounded m-2 min-w-[250px] justify-between"
          >
            <p>{game.name}</p>
            <button className=" bg-blue-300 rounded p-2">Join</button>
          </div>
        ))
      ) : (
        <p className="mt-2">No Games Yet...</p>
      )}
      {showGameDialog && (
        <>
          <div className=" absolute h-dvh w-screen bg-black opacity-50"></div>
          <CreateGameDialog
            setShowGameDialog={setShowGameDialog}
            fetchGames={fetchGames}
          />
        </>
      )}
      <button
        className="bg-blue-200 rounded-xl p-2 mt-4"
        onClick={() => setShowGameDialog(!showGameDialog)}
      >
        Create Game
      </button>
    </div>
  );
}

export default Home;
