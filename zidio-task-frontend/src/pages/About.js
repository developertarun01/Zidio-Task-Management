import React from "react";

const About = () => {
  return (
    <div className="flex flex-col items-center p-10 bg-gray-100 min-h-screen">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600">About Zidio Task Management</h1>
        <p className="text-gray-700 mt-4 text-center">
          Zidio Task Management is designed to help teams stay organized and boost productivity.
          Effortlessly manage, track, and complete your tasks on time with an intuitive interface.
        </p>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Meet Our Team</h2>
          <p className="text-gray-700 mt-2">
            We are a team of 7 dedicated developers, designers, and project managers working together to
            create an efficient task management system. Our team is committed to delivering a seamless
            experience for all users.
          </p>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">About the Project</h2>
          <p className="text-gray-700 mt-2">
            This project is built using the MERN stack (MongoDB, Express, React, Node.js). It allows users
            to create, assign, and track tasks effectively. With features like subtasks, deadlines, and
            priority levels, Zidio Task Management helps businesses streamline workflow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
