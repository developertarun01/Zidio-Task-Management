import React, { useEffect, useState } from "react";
import axios from "axios";
import tanmoyImg from "../assets/tanmoy.jpg"
const teamMembers = [
  {
    name: "Gayatri Sawant",
    role: "Project Manager",
    image: "https://via.placeholder.com/150", // Replace with real image URL
  },
  {
    name: "Tarun Dhiman",
    role: "Frontend Developer",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Pavan Gowda",
    role: "Backend Developer",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Pradi",
    role: "Backend Developer",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Satya Prakash",
    role: "Backend Developer",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Tanmoy Das",
    role: "Full Stack Developer",
    image: tanmoyImg,
  },
];

const About = () => {
  const [aboutInfo, setAboutInfo] = useState({});

  // useEffect(() => {
  //   axios.get("http://localhost:4000/api/about").then((response) => {
  //     setAboutInfo(response.data);
  //   });
  // }, []);

  return (
  <div className="min-h-screen bg-gray-100 py-10 px-4 bg-gradient-to-r from-blue-500 via-white-500 to-green-500">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h1>
      <p className="text-xl white-600 mb-8">
        We are a dedicated team of professionals committed to delivering top-notch solutions.
      </p>
    </div>
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {teamMembers.map((member, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-4 text-center">
          <img
            src={member.image}
            alt={member.name}
            className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-gray-300 hover:scale-105 transition-transform duration-300 "
          />
          <h2 className="text-xl font-semibold text-gray-800">{member.name}</h2>
          <p className="text-gray-500">{member.role}</p>
        </div>
      ))}
    </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">About the Project</h2>
        <p className="text-gray-700 mt-2">{aboutInfo.project}</p>
      </div>
    </div>
  );
};

export default About;

