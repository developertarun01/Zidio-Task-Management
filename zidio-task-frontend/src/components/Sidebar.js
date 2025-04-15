import { useState } from "react";
import {
  FaTasks, FaCalendarAlt, FaChartBar, FaCog, FaSignOutAlt, FaTachometerAlt,
  FaTeamspeak,
  FaTags,
  FaTrash
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/auth/google/dashboard" },
    { name: "To-do", icon: <FaTags/>, path: "/task-to-do" },
    { name: "Tasks", icon: <FaTasks />, path: "/tasks" },
    { name: "Calendar", icon: <FaCalendarAlt />, path: "/calendar" },
    
    { name: "Analytics", icon: <FaChartBar />, path: "/analytics" },
    { name: "Team", icon: <FaTeamspeak />, path: "/admin/team" },
    { name: "TrashBin", icon: <FaTrash />, path: "/trash" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
    { name: "Logout", icon: <FaSignOutAlt />, path: "/logout" },
  ];

  return (
    <div className={`h-screen p-5 pt-8 ${expanded ? "w" : "w-20"} duration-300 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg shadow-lg border-r border-white/10 `}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-xl font-bold text-cyan-300 ${!expanded && "hidden"}`}>Zidio</h1>
        <button onClick={() => setExpanded(!expanded)} className="text-white">
          ☰
        </button>
      </div>

      <ul className="space-y-6">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition ${
                isActive ? "bg-white/10 text-cyan-400" : ""
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className={`${!expanded && "hidden"} transition-all`}>{item.name}</span>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
