import { NavLink, useNavigate } from "react-router-dom";
import { Search, Info } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white text-black p-4 my-8">
      <div className="container mx-auto flex justify-between items-center">
        <img className="w-1/6" src="/image/logo.png" alt="Logo" />
        <nav>
          <ul className="flex space-x-6 bg-blue-50 p-3 rounded-lg">
            {[
              { name: "HOME", path: "/" },
              { name: "ABOUT", path: "/about" },
              { name: "SERVICES", path: "/services" },
              { name: "CAREERS", path: "/careers" },
              { name: "CONTACT", path: "/contact" },
            ].map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `mx-5 grid hover:text-blue-600 ${isActive ? "text-blue-700" : "text-black"}`
                  }
                >
                  <b className="mt-3">{item.name}</b>
                </NavLink>
              </li>
            ))}
            <button
              type="button"
              className="bg-blue-600 text-white px-10 py-3 rounded w-full hover:bg-blue-500"
              onClick={() => navigate("/login")}
            >
              <b>Login / Signup</b>
            </button>
          </ul>
        </nav>
        <ul className="flex space-x-4 rounded-lg">
          <li className="cursor-pointer p-3">
            <Search className="h-6 w-6 text-gray-700" />
          </li>
          <li className="cursor-pointer p-3 bg-blue-600 rounded-3xl hover:bg-blue-500">
            <Info className="h-6 w-6 text-white" />
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
