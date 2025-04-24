import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, BellDot } from "lucide-react";
// import NotificationToast from "./NotificationCompoment";
import UserAvatar from "./UserAvatar";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Zidio TaskManager
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 text-gray-700 rounded-lg p-2 mr-4 ml-4 shadow-inner">
          <Search className="h-5 w-5 mr-2 text-gray-500 " />
          <input
            type="text"
            placeholder="Search..."
            className="outline-none bg-transparent wd-full"
          />
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          {/* <Link to="/home" className="hover:text-indigo-600 transition ">
            Home
          </Link> */}
          <Link to="/about" className="hover:text-indigo-600 transition">
            About Us
          </Link>
          <Link to="/services" className="hover:text-indigo-600 transition">
            Services
          </Link>
          <Link to="/careers" className="hover:text-indigo-600 transition">
            Careers
          </Link>
          <Link to="/contact" className="hover:text-indigo-600 transition">
            Contact Us
          </Link>
        </div>
        <div className="ml-4">
          <Link className="hover:text-indigo-600 transition">
            <UserAvatar />
          </Link>
        </div>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 "
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-gray-200 py-3 space-y-1 text-center text-gray-700 font-medium ">
        {/* <Link to="/home" className="block hover:bg-indigo-100 p-2">
            Home
          </Link> */}
          <Link
            to="/auth/google/dashboard"
            className="block hover:bg-indigo-100 p-2"
          >
            Dashboard
          </Link>
          <Link to="/about" className="block hover:bg-indigo-100 p-2">
            About Us
          </Link>
          <Link
            to="/services"
            className="block hover:bg-indigo-100 p-2"
          >
            Services
          </Link>
          <Link
            to="/careers"
            className="block hover:bg-indigo-100 p-2"
          >
            Career
          </Link>
          <Link
            to="/contact"
            className="block hover:bg-indigo-100 p-2"
          >
            Contact Us
          </Link>

          <Link to="/trash" className="block hover:bg-indigo-100 p-2">
            Trash
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
