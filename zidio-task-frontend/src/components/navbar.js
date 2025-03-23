import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 shadow-md text-white">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">Zidio TaskManager</Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-white text-gray-700 rounded-lg p-2">
          <Search className="h-5 w-5 mr-2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="outline-none bg-transparent"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/home" className="hover:text-gray-200">Home</Link>
          <Link to="/about" className="hover:text-gray-200">About Us</Link>
          <Link to="/careers" className="hover:text-gray-200">Careers</Link>
          <Link to="/contact" className="hover:text-gray-200">Contact Us</Link>
          <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
          <Link to="/trash" className="hover:text-gray-200">Trash</Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden focus:outline-none">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 py-3 space-y-2">
          <Link to="/home" className="block text-center hover:bg-blue-800 p-2">Home</Link>
          <Link to="/about" className="block text-center hover:bg-blue-800 p-2">About Us</Link>
          <Link to="/careers" className="block text-center hover:bg-blue-800 p-2">Career</Link>
          <Link to="/contact" className="block text-center hover:bg-blue-800 p-2">Contact Us</Link>
          <Link to="/dashboard" className="block text-center hover:bg-blue-800 p-2">Dashboard</Link>
          <Link to="/trash" className="block text-center hover:bg-blue-800 p-2">Trash</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
