import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaUser, FaCog, FaKey } from "react-icons/fa"; // Icons for profile, settings, password change

const Settings = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openProfile, setOpenProfile] = useState(false);
  const [openTaskSettings, setOpenTaskSettings] = useState(false);
  const [openNotificationSettings, setOpenNotificationSettings] = useState(false);
  const [openPasswordSettings, setOpenPasswordSettings] = useState(false);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("https://zidio-task-management-tanmoy9088.vercel.app/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    // Fetch tasks data
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("https://zidio-task-management-tanmoy9088.vercel.app/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks data", error);
      }
    };

    fetchUserData();
    fetchTasks();
    setLoading(false);
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (updatedUserData) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `https://zidio-task-management-tanmoy9088.vercel.app/api/users/${user._id}`,
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Error updating profile", error);
    }
  };

  // Handle task settings update
  const handleTaskSettingsUpdate = async (taskId, updatedTaskData) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `https://zidio-task-management-tanmoy9088.vercel.app/api/tasks/${taskId}`,
        updatedTaskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Error updating task");
      console.error("Error updating task", error);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (passwordData) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `https://zidio-task-management-tanmoy9088.vercel.app/users/password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error("Error updating password");
      console.error("Error updating password", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-page">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>

      {/* Profile Settings */}
      <section className="settings-section">
        <h2
          className="text-2xl font-semibold cursor-pointer"
          onClick={() => setOpenProfile(!openProfile)}
        >
          <FaUser className="inline mr-2" />
          Profile Settings
        </h2>
        {openProfile && (
          <div className="settings-content">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProfileUpdate({ name: user.name, email: user.email });
              }}
            >
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Name"
                className="input-field"
              />
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email"
                className="input-field"
              />
              <button type="submit" className="btn-submit">
                Save Changes
              </button>
            </form>
          </div>
        )}
      </section>

      {/* Task Management Settings */}
      <section className="settings-section">
        <h2
          className="text-2xl font-semibold cursor-pointer"
          onClick={() => setOpenTaskSettings(!openTaskSettings)}
        >
          <FaCog className="inline mr-2" />
          Task Management Settings
        </h2>
        {openTaskSettings && (
          <div className="settings-content">
            {tasks.map((task) => (
              <div key={task._id} className="task-item">
                <h3>{task.name}</h3>
                <select
                  value={task.priority}
                  onChange={(e) =>
                    handleTaskSettingsUpdate(task._id, {
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={() => handleTaskSettingsUpdate(task._id, { completed: !task.completed })}
                  className="btn-complete"
                >
                  {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Notification Settings */}
      <section className="settings-section">
        <h2
          className="text-2xl font-semibold cursor-pointer"
          onClick={() => setOpenNotificationSettings(!openNotificationSettings)}
        >
          <FaCog className="inline mr-2" />
          Notification Settings
        </h2>
        {openNotificationSettings && (
          <div className="settings-content">
            {/* Add notification options here */}
            <div>
              <label>
                Enable Task Notifications:
                <input type="checkbox" />
              </label>
            </div>
          </div>
        )}
      </section>

      {/* Password Settings */}
      <section className="settings-section">
        <h2
          className="text-2xl font-semibold cursor-pointer"
          onClick={() => setOpenPasswordSettings(!openPasswordSettings)}
        >
          <FaKey className="inline mr-2" />
          Change Password
        </h2>
        {openPasswordSettings && (
          <div className="settings-content">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Handle password change
                handlePasswordUpdate({ password: "newPassword" }); // update with actual form data
              }}
            >
              <input
                type="password"
                placeholder="New Password"
                className="input-field"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="input-field"
              />
              <button type="submit" className="btn-submit">
                Change Password
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};

export default Settings;
