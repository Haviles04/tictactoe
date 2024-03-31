import { FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    navigate("/login");
  };

  return (
    <nav className="w-full bg-blue-100 rounded-b-xl">
      <div className="flex flex-row justify-between items-center max-w-[1200px] m-auto p-4 ">
        <Link to="/" className="text-2xl">
          Tic-Tac-Toe
        </Link>
        <ul>
          <li>
            <button
              onClick={handleLogout}
              className="flex flex-row items-center rounded border border-black p-2"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
