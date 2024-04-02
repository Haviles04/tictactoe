import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import { socket } from "../socket";
import { toast } from "react-toastify";

function Root() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected");
    });
    socket.on("disconnet", () => {
      console.log("socket disconnected");
    });

    socket.on("error", (err) => {
      toast.error(err.message);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
      <ToastContainer />
    </>
  );
}

export default Root;
