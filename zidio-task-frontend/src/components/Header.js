import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Info, Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle mobile menu

  return (
    <header className="bg-white text-black p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <img className="w-1/6" src="/image/logo.png" alt="Logo" />

        {/* Hamburger Menu Button (Visible on Small Screens) */}
        <button 
          className="lg:hidden p-2 focus:outline-none" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-8 w-8 text-black" /> : <Menu className="h-8 w-8 text-black" />}
        </button>

        {/* Navbar Links (Hidden on small screens, shown on large screens) */}
        <nav className={`absolute lg:static top-16 left-0 w-full lg:w-auto bg-white lg:bg-transparent p-5 lg:p-0 shadow-lg lg:shadow-none transition-all duration-300 ease-in-out 
          ${menuOpen ? "block" : "hidden"} lg:flex`}
        >
          <ul className="flex flex-col lg:flex-row lg:space-x-6 bg-blue-50 lg:bg-transparent p-3 rounded-lg lg:p-0">
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
                    `block px-4 py-2 hover:text-blue-600 ${isActive ? "text-blue-700" : "text-black"}`
                  }
                >
                  <b>{item.name}</b>
                </NavLink>
              </li>
            ))}
            <button
              type="button"
              className="bg-blue-600 text-white px-10 py-3 rounded w-full hover:bg-blue-500 mt-3 lg:mt-0"
              onClick={() => navigate("/login")}
            >
              <b>Login / Signup</b>
            </button>
          </ul>
        </nav>

        {/* Search and Info Icons (Hidden on small screens) */}
        <ul className="hidden lg:flex space-x-4">
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
