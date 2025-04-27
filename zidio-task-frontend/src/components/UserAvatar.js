import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoArrowForwardSharp, IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils";
import { AuthContext } from "../context/AuthContext";
import UserProfileModal from "./UserProfileModal"; // adjust the path if needed
import ChangePasswordModal from "./ChangePasswordModal"; // adjust path as needed
import { toast } from "react-hot-toast";
import LogoutConfirmModal from "./LogoutConfirmModal";

const UserAvatar = () => {
  // const getInitials = (name = "") => {
  //   if (!name) return "";
  //   const nameParts = name.split(" ");
  //   return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  // };
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // const [isProfileOpen, setProfileOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const users = localStorage.getItem("user");
  const role = localStorage.getItem("userRole");
  const email = localStorage.getItem("userEmail");
  const name = localStorage.getItem("userName");
  // Default to a placeholder if the user doesn't have an avatar
  const avatarUrl = user?.avatar || "https://via.placeholder.com/100";

  useEffect(() => {
    const fetchUser = async () => {
      const token = new URLSearchParams(window.location.search).get("token");
      if (token) {
        localStorage.setItem("authToken", token);
        try {
          const res = await axios.get("https://zidio-task-management-tanmoy9088.onrender.com/api/users", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          setUser(res.data);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("https://zidio-task-management-tanmoy9088.onrender.com/api/auth/logout", {
        credentials: "include",
      });
      toast.success("Logout successfully");
      console.log("logged out");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/"); // or use window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed");
    }
  };

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="w-10 h-10 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-gray-800 text-white flex hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500">
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full object-cover"
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
              <div className="p-4">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpen(true)}
                      className="text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base"
                    >
                      <FaUser className="mr-2" aria-hidden="true" />
                      Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenPassword(true)}
                      className={`text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <FaUserLock className="mr-2" aria-hidden="true" />
                      Change Password
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div>
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className={`text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                      >
                        <IoLogOutOutline className="mr-2" aria-hidden="true" />
                        Logout
                      </button>
                    </div>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <UserProfileModal open={open} setOpen={setOpen} user={users} />
      <ChangePasswordModal open={openPassword} setOpen={setOpenPassword} />
      <LogoutConfirmModal
        open={showLogoutModal}
        setOpen={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default UserAvatar;
