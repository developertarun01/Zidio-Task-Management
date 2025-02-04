import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Zidio Task Management</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <NavLink
                exact
                to="/"
                activeClassName="text-gray-200"
                className="hover:text-gray-300"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                activeClassName="text-gray-200"
                className="hover:text-gray-300"
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                activeClassName="text-gray-200"
                className="hover:text-gray-300"
              >
                Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/faq"
                activeClassName="text-gray-200"
                className="hover:text-gray-300"
              >
                FAQ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                activeClassName="text-gray-200"
                className="hover:text-gray-300"
              >
                Contact Us
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
