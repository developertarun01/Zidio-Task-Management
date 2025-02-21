import React from "react";

const Careers = () => {
  return (
    <div className="flex flex-col md:flex-row p-8 gap-8">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-blue-50 p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-700">Join Zidio Management</h1>
        <p className="mt-4 text-gray-600">
          Become part of an innovative team and shape the future of task management.
          We’re looking for passionate individuals to help us build powerful solutions.
        </p>
      </div>
      
      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">Apply for a Position</h2>
        <form className="mt-4 space-y-4">
          <select className="w-full p-2 border rounded-lg">
            <option>Select a Role</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>UI/UX Designer</option>
            <option>Project Manager</option>
          </select>
          <input type="text" placeholder="Full Name" className="w-full p-2 border rounded-lg" />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded-lg" />
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
