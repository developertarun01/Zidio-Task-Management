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

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

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
      className={`h-screen p-5 pt-8 duration-300 ${
        expanded ? "w-64" : "w-20"
      } bg-gradient-to-b from-[#0f172a] to-[#1e293b] backdrop-blur-md shadow-xl border-r border-white/10 transition-all`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          className={`text-2xl font-extrabold tracking-wider text-cyan-400 ${
            !expanded && "hidden"
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Zidio
        </motion.h1>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-cyan-300 hover:text-cyan-400 transition"
        >
          ☰
        </button>
      </div>

      {/* Menu Items */}
      <ul className="space-y-5">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl group transition-all hover:bg-cyan-800/20 hover:shadow-md ${
                isActive
                  ? "bg-cyan-700/20 text-cyan-300 font-semibold shadow-inner"
                  : "text-slate-200"
              }`
            }
          >
            <span className="text-xl group-hover:scale-110 transition-all">
              {item.icon}
            </span>
            <span
              className={`${
                !expanded && "hidden"
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
