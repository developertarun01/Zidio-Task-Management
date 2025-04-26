// components/ChangePasswordModal.jsx
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ChangePasswordModal = ({ open, setOpen }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await axios.put(
        "https://zidio-task-management-tanmoy9088.vercel.app/api/users/change-password",
        {
          currentPassword,
          newPassword,
          updatedPassword: confirmPassword,
        },
        {
          //   headers: {
          //     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          //   },
          withCredentials: true,
        }
      );

      toast.success("Password changed successfully!");
      setOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Change Password
          </Dialog.Title>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ChangePasswordModal;
