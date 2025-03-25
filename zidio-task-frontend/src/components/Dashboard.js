import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      axios
        .get("https://zidio-task-management-api.vercel.app/user", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.error(err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    window.open("https://zidio-task-management-api.vercel.app/api/auth/logout", "_self");
    navigate("/");
  };
    return (
        <div className="flex flex-col items-center justify-center my-20">
            <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
            <button
                className="mt-4 bg-red-500 text-white p-2 rounded"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
