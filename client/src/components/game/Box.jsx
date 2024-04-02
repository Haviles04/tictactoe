import { socket } from "../../socket";
import { useState } from "react";

function Box({ value, p0, p1, user }) {
  const [displayChar, setDisplayChar] = useState("");

  console.log(displayChar);

  const handleClick = () => {
    if (user.username === p0.username) {
      socket.emit("p0Move", value);
      setDisplayChar("X");
    }
    if (user.username === p1.username) {
      socket.emit("p1Move", value);
      setDisplayChar("O");
    }
  };

  return (
    <button
      className="p-4 border-2 border-black rounded min-h-[100px] min-w-[100px]"
      onClick={handleClick}
    >
      <p className="text-2xl">{displayChar}</p>
    </button>
  );
}

export default Box;
