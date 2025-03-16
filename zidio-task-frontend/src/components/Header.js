import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Info, Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white text-black p-4 ">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <img className="w-1/6" src="/image/logo.png" alt="Logo" />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Navigation (No Changes) */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 bg-blue-50 p-3 rounded-lg my-8 justify-center">
            {[
              { name: "HOME", path: "/home" },
              { name: "ABOUT", path: "/about" },
              { name: "SERVICES", path: "/services" },
              { name: "CAREERS", path: "/careers" },
              { name: "CONTACT", path: "/contact" },
            ].map((item) => (
              <li key={item.path} className="flex items-center">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `mx-5 grid hover:text-blue-600 ${isActive ? "text-blue-700" : "text-black"
                    }`
                  }
                >
                  <b>{item.name}</b>
                </NavLink>
              </li>
            ))}
            <button
              type="button"
              className="bg-blue-600 text-white px-10 py-3 rounded w-full hover:bg-blue-500 mt-3 lg:mt-0"
              onClick={() => navigate("/dashboard")}
            >
              <b>Dashboard</b>
            </button>
          </ul>
        </nav>

        {/* Desktop Icons (No Changes) */}
        <ul className="hidden md:flex space-x-4 rounded-lg">
          <li className="cursor-pointer p-3">
            <Search className="h-6 w-6 text-gray-700" />
          </li>
          <li className="cursor-pointer p-3 bg-blue-600 rounded-3xl hover:bg-blue-500">
            <Info className="h-6 w-6 text-white" />
          </li>
        </ul>
      </div>

      {/* Mobile Menu (Only Appears When Opened) */}
      {menuOpen && (
        <div className="z-50 md:hidden absolute top-16 mt-2 left-0 w-full bg-white shadow-md my-0">
          <nav>
            <ul className="flex flex-col space-y-3 bg-blue-50 p-3 rounded-lg">
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
                      `block text-center hover:text-blue-600 ${isActive ? "text-blue-700" : "text-black"
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    <b>{item.name}</b>
                  </NavLink>
                </li>
              ))}
              <button
                type="button"
                className="bg-blue-600 text-white px-10 py-3 rounded w-full hover:bg-blue-500"
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
              >
                <b>Login / Signup</b>
              </button>
            </ul>
          </nav>

          {/* Icons inside Mobile Menu */}
          <ul className="flex justify-center space-x-4 my-4">
            <li className="cursor-pointer p-3">
              <Search className="h-6 w-6 text-gray-700" />
            </li>
            <li className="cursor-pointer p-3 bg-blue-600 rounded-3xl hover:bg-blue-500">
              <Info className="h-6 w-6 text-white" />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
