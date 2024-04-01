import { useState, useEffect } from "react";
import { userState } from "../state/userState";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "react-toastify";

function Login() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const setUserState = useSetRecoilState(userState);

  const { username, password } = userInfo;

  useEffect(() => {
    if (user.id) {
      navigate("/");
      return;
    }
  }, [user.id, navigate]);

  const handleChange = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = JSON.stringify({ username, password });
      const res = await fetch("/api/users/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: body,
      });
      const foundUser = await res.json();

      if (!foundUser) {
        throw new Error("Error logging in");
      }

      setUserState({ id: foundUser._id, username: foundUser.username });
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <main>
      <div className="mt-10 flex justify-center flex-col items-center">
        <h1 className="text-3xl">Login to start playing</h1>
        <form onSubmit={handleSubmit} className="flex flex-col mt-10 text-2xl ">
          <label htmlFor="username">Enter username</label>
          <input
            name="username"
            className="border-2"
            type="text"
            value={username}
            onChange={handleChange}
          />
          <label htmlFor="password">Enter password</label>
          <input
            name="password"
            className="border-2"
            type="password"
            value={password}
            onChange={handleChange}
          />
          <button type="submit" className="mt-4 p-4 bg-blue-100 rounded-xl">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;
