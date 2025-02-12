import React, { useEffect, useState } from "react";
import axios from "axios";

const About = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/about").then((response) => {
      setData(response.data);
    });
  }, []);

  return (
    <div className="flex flex-col items-center p-10 bg-gray-100 min-h-screen">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600">{data.title}</h1>
        <p className="text-gray-700 mt-4 text-center">{data.description}</p>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Meet Our Team</h2>
          <p className="text-gray-700 mt-2">{data.team}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">About the Project</h2>
          <p className="text-gray-700 mt-2">{data.project}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
