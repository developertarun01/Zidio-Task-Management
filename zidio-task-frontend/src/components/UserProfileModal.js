import React, { useRef, useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ChangePasswordModal from "./ChangePasswordModal";

const ProfileModal = ({ open, setOpen, user }) => {
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || "");
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    birthday: user?.birthday ? user.birthday.substring(0, 10) : "",
    bio: user?.bio || "",
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get("https://zidio-task-management-tanmoy9088.vercel.app/api/users/search", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        });

        // Set form and avatar states
        formik.setValues({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          birthday: data.birthday || "",
          bio: data.bio || "",
          role: data.role || "employee",
        });
        setPreview(data.avatar || "");
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };

    fetchUserData();
  }, []);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      phone: Yup.string().matches(/^[0-9]{10,}$/, "Invalid phone number"),
      location: Yup.string(),
      birthday: Yup.date().nullable(),
      bio: Yup.string(),
    }),

    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (avatar instanceof File) {
        formData.append("avatar", avatar);
      }

      try {
        await axios.put(
          "https://zidio-task-management-tanmoy9088.onrender.com/api/users/update-profile",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        toast.success("Profile updated successfully!");
        setEditMode(false);
        setOpen(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to update profile.");
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const renderField = (label, name, type = "text", disabled = false) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        type={type}
        disabled={disabled}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-xs">{formik.errors[name]}</p>
      )}
    </div>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-auto">
          <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 shadow-xl">
            <Dialog.Title className="text-2xl font-bold mb-6 text-center">
              {editMode ? "Edit Profile" : "User Profile"}
            </Dialog.Title>

            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <img
                src={preview || "https://via.placeholder.com/100"}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500"
              />
              {editMode && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Change Photo
                  </button>
                </>
              )}
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {renderField("Full Name", "name", "text", !editMode)}
              {renderField("Email", "email", "email", true)}
              {renderField("Phone", "phone", "text", !editMode)}
              {renderField("Location", "location", "text", !editMode)}
              {renderField("Birthday", "birthday", "date", !editMode)}
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  disabled={!editMode}
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 ${
                    !editMode ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                />
                {formik.touched.bio && formik.errors.bio && (
                  <p className="text-red-500 text-xs">{formik.errors.bio}</p>
                )}
              </div>

              {/* Change Password */}
              {editMode && (
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setChangePassOpen(true)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Change Password
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                {!editMode ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-sm"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        formik.resetForm();
                      }}
                      className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      <ChangePasswordModal open={changePassOpen} setOpen={setChangePassOpen} />
    </>
  );
};

export default ProfileModal;
