import React, { useState, useRef } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ChangePasswordModal from "./ChangePasswordModal";

const ProfileModal = ({ open, setOpen, user }) => {
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [preview, setPreview] = useState(user?.avatar || "");
  const [changePassOpen, setChangePassOpen] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name",name);
    formData.append("email", email);
    if (avatar instanceof File) {
      formData.append("avatar", avatar);
    }

    try {
      await axios.put("http://localhost:4004/api/users/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("Profile updated!");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Edit Profile
            </Dialog.Title>

            <div className="flex flex-col items-center gap-2 mb-4">
              <img
                src={preview || "https://via.placeholder.com/100"}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover"
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                className="text-blue-600 text-sm"
                onClick={() => fileInputRef.current.click()}
              >
                Change Photo
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mt-4 flex justify-between">
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setChangePassOpen(true)}
              >
                Change Password
              </button>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <ChangePasswordModal open={changePassOpen} setOpen={setChangePassOpen} />
    </>
  );
};

export default ProfileModal;
