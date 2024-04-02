import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { gameListState } from "../state/gameListState";
import { gameState } from "../state/gameState";
import { userState } from "../state/userState";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Root() {
  const setGameList = useSetRecoilState(gameListState);
  const setGameState = useSetRecoilState(gameState);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("gameList", ({ data }) => {
      setGameList(data);
    });

    socket.on("newGame", ({ data }) => setGameList((prev) => [...prev, data]));

    socket.on("gameCreated", ({ data }) => {
      console.log(data);
      setGameState(data);
      if (data.p0._id === user.id) {
        navigate(`/game/${data._id}`);
      }
    });

    socket.on("gameJoined", ({ data }) => {
      setGameState(data);
      if (data.p1._id === user.id) {
        navigate(`/game/${data._id}`);
      }
    });

    socket.on("error", (err) => {
      toast.error(err.message);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [user.id, navigate, setGameState, setGameList]);

  return (
    <>
      <Navbar />
      <Outlet />
      <ToastContainer />
    </>
  );
}

export default Root;
