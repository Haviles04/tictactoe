import { socket } from "../../socket";

function Box({ value, p0, p1, user, game }) {
  const handleClick = () => {
    if (user.username === p0.username) {
      socket.emit("p0Move", { box: value, gameId: game._id });
      return;
    }
    socket.emit("p1Move", { box: value, gameId: game._id });
  };

  return (
    <button
      className="p-4 border-2 border-black rounded min-h-[100px] min-w-[100px]"
      onClick={handleClick}
    >
      <p className="text-2xl">
        {game.p0Boxes?.includes(value)
          ? "X"
          : game.p1Boxes?.includes(value)
          ? "O"
          : value}
      </p>
    </button>
  );
}

export default Box;
