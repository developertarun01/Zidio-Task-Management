
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4004"); // Connect to your backend WebSocket server

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Listen for incoming notifications
    socket.on("notification", (message) => {
      setNotifications((prev) => [...prev, message]);
    });

    return () => socket.off("notification");
  }, []);

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button onClick={() => setShowDropdown(!showDropdown)} className="relative p-2">
        <span className="text-2xl">🔔</span>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3">
          <h3 className="font-bold mb-2">Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((note, index) => (
              <p key={index} className="text-sm border-b py-1">
                {note}
              </p>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No new notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
