import React, { useEffect, useState } from "react";
import axios from "axios";
import tanmoyImg from "../assets/tanmoyImg.png"
import tarunImg from "../assets/tarun.png"
import user from "../assets/user.png"
const teamMembers = [
  {
    name: "Tarun",
    role: "Project Manager",
    image: tarunImg,
  },
  {
    name: "Tanmoy Das",
    role: "Full Stack Developer",
    image: tanmoyImg,
  },
  {
    name: "Gayatri Sawant",
    role: "Frontend Developer",
    image: user, // Replace with real image URL
  },
  {
    name: "Satya Prakash",
    role: "Backend Developer",
    image: user,
  },
  {
    name: "Pavan Gowda",
    role: "Backend Developer",
    image: user,
  },
  {
    name: "Pradi",
    role: "Backend Developer",
    image: user,
  }
];

const About = () => {
  const [aboutInfo, setAboutInfo] = useState({});

  useEffect(() => {
    axios.get("https://zidio-task-management-api.vercel.app/api/about").then((response) => {
      setAboutInfo(response.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 shadow-lg rounded-lg ">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h1>
        <p className="text-xl white-600">{aboutInfo.team}</p>
        <p className="text-xl white-600 mb-8">
          We are a dedicated team of professionals committed to delivering top-notch solutions.
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
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
      <div className="max-w-4xl mx-auto text-center pt-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{aboutInfo.title}</h2>
        <p className="text-xl white-600">{aboutInfo.description}</p>
        <p className="text-xl white-600">{aboutInfo.project}</p>
      </div>
    </div>
  );
};

export default About;

