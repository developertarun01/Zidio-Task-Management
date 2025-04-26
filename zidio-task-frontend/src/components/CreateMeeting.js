import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateMeeting = () => {
  const [meetingData, setMeetingData] = useState({
    title: "",
    date: "",
    time: "",
    participants: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !meetingData.title ||
      !meetingData.date ||
      !meetingData.time ||
      !meetingData.participants
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const res = await axios.post(
        "https://zidio-task-management-tanmoy9088.vercel.app/api/meetings",
        meetingData,
        { withCredentials: true }
      );
      toast.success("Meeting created successfully!");
      setMeetingData({
        title: "",
        date: "",
        time: "",
        participants: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to create meeting.");
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#042330] via-[#214753] to-[#06041e] backdrop-blur-md shadow-lg p-48 rounded-lg text-neon">
      <h2 className="text-2xl font-bold mb-6 text-indigo-300">Create Meeting</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Meeting Title *</label>
          <input
            type="text"
            name="title"
            value={meetingData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300"
            placeholder="Enter meeting title"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={meetingData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/20 text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Time *</label>
            <input
              type="time"
              name="time"
              value={meetingData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/20 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Participants *</label>
          <input
            type="text"
            name="participants"
            value={meetingData.participants}
            onChange={handleChange}
            placeholder="Comma separated emails or names"
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300"
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={meetingData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300"
            placeholder="Optional description..."
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg shadow transition duration-300"
        >
          Create Meeting
        </button>
      </form>
    </div>
  );
};

export default CreateMeeting;
