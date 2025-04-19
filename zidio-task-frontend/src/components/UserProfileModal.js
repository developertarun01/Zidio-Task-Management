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

  const originalValues = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    birthday: user?.birthday || "",
    bio: user?.bio || "",
    role: user?.role || "User",
  };

  const formik = useFormik({
    initialValues: originalValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().matches(/^[0-9]{10,}$/, "Invalid phone number"),
      location: Yup.string(),
      birthday: Yup.date().nullable(),
      bio: Yup.string(),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) =>
        formData.append(key, value)
      );
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

        toast.success("Profile updated successfully!");
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

  const handleReset = () => {
    formik.resetForm({ values: originalValues });
    setAvatar(null);
    setPreview(user?.avatar || "");
  };

  useEffect(() => {
    if (formik.dirty) {
      toast("You have unsaved changes", { icon: "⚠️", duration: 2000 });
    }
  }, [formik.dirty]);

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 shadow-xl">
            <Dialog.Title className="text-2xl font-bold mb-6 text-center">
              Edit Profile
            </Dialog.Title>

            {/* Avatar Preview */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <img
                src={preview || "https://via.placeholder.com/100"}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500"
              />
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
            </div>

            {/* Form Fields */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Name */}
              <InputField formik={formik} name="name" placeholder="Full Name" />
              {/* Email */}
              <InputField formik={formik} name="email" placeholder="Email Address" type="email" />
              {/* Phone */}
              <InputField formik={formik} name="phone" placeholder="Phone Number" />
              {/* Location */}
              <InputField formik={formik} name="location" placeholder="Location" />
              {/* Birthday */}
              <InputField formik={formik} name="birthday" placeholder="Birthday" type="date" />
              {/* Bio */}
              <textarea
                name="bio"
                placeholder="Short Bio"
                rows={3}
                value={formik.values.bio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-white"
              />
              {formik.touched.bio && formik.errors.bio && (
                <p className="text-red-500 text-xs">{formik.errors.bio}</p>
              )}

              {/* Change Password Link */}
              <div className="mt-2 text-right">
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() => setChangePassOpen(true)}
                >
                  Change Password
                </button>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-6 gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Change Password Modal */}
      <ChangePasswordModal open={changePassOpen} setOpen={setChangePassOpen} />
    </>
  );
};

// Reusable InputField component
const InputField = ({ formik, name, placeholder, type = "text" }) => (
  <div>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-white"
    />
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
    )}
  </div>
);

export default ProfileModal;
