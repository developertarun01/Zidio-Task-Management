import React, { useState } from "react";
import axios from "axios";

const Careers = () => {
  const [formData, setFormData] = useState({
    name: "",
    role:"",
    email: "",
    // fileSave:"",
  });
  const handleSubmit = axios.post("https://zidio-task-management-tanmoy9088.onrender.com/api/users/submit", formData);
  return (
    <div className="flex pt-24 h-screen bg-gradient-to-br from-[#042330] via-[#214753] to-[#06041e] flex-col md:flex-row gap-8 px-4">
      {/* Left Section */}
      <div className="w-full h-96 md:w-1/2 bg-green-100 hover:bg-teal-200 rounded-lg p-6 flex flex-col justify-center items-center shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4 text-center">
          Zidio Task Management
        </h2>
        <p className="text-base md:text-lg text-gray-600 text-center px-2 md:px-4">
          Become part of an innovative team and shape the future of task
          management. We’re looking for passionate individuals to help us build
          powerful solutions.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-full h-96 md:w-1/2 bg-teal-400 p-6 rounded-2xl shadow-md">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 text-center">
          Apply for a Position
        </h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <select className="w-full p-2 border rounded-lg">
            <option>Select a Role</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>UI/UX Designer</option>
            <option>Project Manager</option>
          </select>
          <input
            type="text"
            placeholder="Full Name"
            value={formData}
            onc

            className="w-full p-2 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg"
          />
          <input type="file" className="w-full p-2 border rounded-lg" />
          <button className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default Careers;
