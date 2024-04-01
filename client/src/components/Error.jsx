import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl">OOPS!</h1>
      <p>This wasn't supposed to happen.</p>
      <button className="mt-4 p-4 bg-blue-100 rounded-xl" onClick={handleClick}>
        Go Home
      </button>
    </div>
  );
}

export default Error;
