import { useState } from "react";
import {
  FaTasks,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTeamspeak,
  FaTags,
  FaTrash,
  FaUserCheck,
  FaMeetup,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion"; // Optional but great for animations

const Sidebar = ({isExpanded, toggleSidebar}) => {
  const user = JSON.parse(localStorage.getItem("user"))
  // const [expanded, setExpanded] = useState(true);
  let [upperCase] = [user.role];
   upperCase =(upperCase[0].toUpperCase()+upperCase.slice(1))
  const menu = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/auth/google/dashboard",
    },
    { name: "Task Assign", icon: <FaUserCheck />, path: "/task-to-do" },
    { name: "Tasks", icon: <FaTasks />, path: "/tasks" },
    { name: "Calendar", icon: <FaCalendarAlt />, path: "/calendar" },
    { name: "Analytics", icon: <FaChartBar />, path: "/analytics" },
    { name: "Create-Meeting", icon: <FaMeetup />, path: "/create-meeting" },
    { name: "Team", icon: <FaTeamspeak />, path: "/admin/team" },
    { name: "TrashBin", icon: <FaTrash />, path: "/trash" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
    // { name: "Logout", icon: <FaSignOutAlt />, path: "/logout" },
  ];

  return (
    <div
      className={`h-screen mx-auto p-5 z-500000 pt-8 transition-all duration-300 ${
        isExpanded ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 shadow-xl`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <motion.h1
          className={`text-2xl font-bold tracking-wider text-indigo-600 ${
            isExpanded && "hidden"
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {upperCase} Dashboard
        </motion.h1>
        <button
          onClick={() => toggleSidebar(isExpanded)}
          className="text-indigo-500 hover:text-indigo-700 text-xl"
        >
          ☰
        </button>
      </div>

      {/* Menu Items */}
      <ul className="space-y-3">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex mx-auto items-center gap-4 px-4 py-3 rounded-lg transition-all hover:bg-cyan-800/20 hover:shadow-md duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from indigo-100 to indigo-200 text-indigo-800 font-semibold shadow-glass"
                  : "text-gray-700 hover:bg-gradient-to-r hover: from-blue-50 hover:to-blue-100"
              }`
            }
          >
            <span className="text-xl group-hover:scale-110 transition-transform durantion-200">
              {item.icon}
            </span>
            <span
              className={`${
                isExpanded && "hidden"
              } transition-all whitespace-nowrap`}
            >
              {item.name}
            </span>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
