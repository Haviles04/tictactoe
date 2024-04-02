import { useState } from "react";
import { socket } from "../socket";

function CreateGameDialog({ setShowGameDialog, userId }) {
  const [gameName, setGameName] = useState("");

  const closeDialog = (e) => {
    e.preventDefault();
    setShowGameDialog(false);
  };

  const handleChange = (e) => {
    setGameName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    socket.emit("createGame", { name: gameName, p0: userId });
    setShowGameDialog(false);
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <form
        className="flex bg-white flex-col p-10 rounded-xl"
        onSubmit={handleSubmit}
      >
        <label htmlFor="gameName">Enter a Game Name</label>
        <input
          id="gameName"
          name="gameName"
          type="text"
          value={gameName}
          className="mt-4 rounded border border-b-2 border-black"
          onChange={handleChange}
        />
        <button className="bg-blue-200 mt-4 rounded" type="submit">
          Create Game
        </button>
        <button className="bg-blue-100 mt-2 rounded" onClick={closeDialog}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default CreateGameDialog;
