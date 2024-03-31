import { useEffect, useState } from "react";
import "./App.css";

function App() {

  let p0Id = 1;
  const [games, setGames] = useState([]);
  const [gameName, setGameName] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/games");
        if (!res.ok) {
          throw new Error("Error fetching data");
        }
        const games = await res.json();
        setGames(games);
      } catch (err) {
        console.log(err);
      }
    };
    fetchGames();
  }, []);

  const handleCreateGame = async () => {
    if (!gameName) return;

    setLoading(true);
      const body = {
      p0: p0Id++,
      name: gameName,
    };

    const game = await fetch("http://localhost:5000/api/games", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const newGame = await game.json();

    setGames((prevGames) => [...prevGames, newGame]);
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic Tac Toe</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form className="createGameForm" onSubmit={handleCreateGame}>
            <label htmlFor="gameName">Enter Game Name</label>
            <input
              id="gameName"
              type="text"
              onChange={(e) => setGameName(e.target.value)}
            />
            <button type="submit">Create Game</button>
          </form>
        )}

        <h3>Open Games</h3>
        {games && games.map((game) => <p key={game.id}>{game.name}</p>)}
      </header>
    </div>
  );
}

export default App;
