import {useNavigate} from "react-router-dom"
import axios from "axios";
import { useEffect, useState } from "react";

const UserAvatar = () => {
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
    <div>
      <button
        onClick={handleLogout}
        className={`text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base`}
      >
        Logout
      </button>
    </div>
  );
};
export default UserAvatar;