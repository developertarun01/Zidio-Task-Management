import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import EditTeamModal from "./EditTeamModal";
import {
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaFileCsv,
  FaFilePdf,
} from "react-icons/fa";

const TeamPage = () => {
  const role = localStorage.getItem("userRole");
  const [team, setTeam] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({
    username: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [tasks, setTasks] = useState("");

  const handleExportCSV = () => {
    const csv = Papa.unparse(tasks);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "tasks.csv");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Tasks", 10, 10);
    const taskRows = tasks.map((task) => [
      task.title,
      task.priority,
      task.status,
      new Date(task.deadline).toLocaleDateString(),
    ]);
    doc.autoTable({
      head: [["Title", "Priority", "Status", "Deadline"]],
      body: taskRows,
    });
    doc.save("tasks.pdf");
  };

  const fetchTeam = async () => {
    try {
      const response = await axios.get("https://zidio-task-management-tanmoy9088.onrender.com/users/");
      setTeam(response.data);
    } catch (error) {
      console.error("Failed to fetch team", error);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        "https://zidio-task-management-tanmoy9088.onrender.com/api/auth/register",
        newMember
      );
      setTeam([...team, response.data]);
      setNewMember({ username: "", email: "", password: "", role: "employee" });
    } catch (error) {
      console.error("Error adding team member", error);
    }
  };

  const handleUpdateMember = async (updatedData) => {
    try {
      await axios.put(
        `https://zidio-task-management-tanmoy9088.onrender.com/api/users/${updatedData._id}`,
        updatedData
      );
      fetchTeam();
      setEditingMember(null);
    } catch (err) {
      console.error("Error updating member", err);
    }
  };

  const handleEditClick = (member) => {
    setEditingMember(member);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://zidio-task-management-tanmoy9088.onrender.com/api/users/${id}`);
      setTeam((prev) => prev.filter((member) => member._id !== id));
    } catch (err) {
      console.error("Error deleting member", err);
    }
  };
  // Restrict to admin or manager only
  if (role !== "admin" && role !== "manager") {
    return (
      <div className="text-center text-red-500 font-bold p-6">
        You do not have permission to assign tasks.
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <h1 className="text-3xl font-bold mb-6">✨ Team Management</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 transition rounded shadow"
        >
          <FaFileCsv /> Export CSV
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 transition rounded shadow"
        >
          <FaFilePdf /> Export PDF
        </button>
      </div>

      <div className="mb-10 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-xl border border-white/30">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUserPlus /> Add New Member
        </h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={newMember.username}
            onChange={(e) =>
              setNewMember({ ...newMember, username: e.target.value })
            }
            className="p-2 rounded bg-white/20 text-white placeholder-white/70"
          />
          <input
            type="email"
            placeholder="Email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
            className="p-2 rounded bg-white/20 text-white placeholder-white/70"
          />
          <input
            type="password"
            placeholder="Password"
            value={newMember.password}
            onChange={(e) =>
              setNewMember({ ...newMember, password: e.target.value })
            }
            className="p-2 rounded bg-white/20 text-white placeholder-white/70"
          />
          <select
            value={newMember.role}
            onChange={(e) =>
              setNewMember({ ...newMember, role: e.target.value })
            }
            className="p-2 rounded bg-white/20 text-white"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded shadow transition"
          >
            Add Member
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">👨‍💼 Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, i) => (
          <div
            key={member._id}
            className="bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-xl border border-cyan-400/50 transition transform hover:scale-[1.03] hover:shadow-cyan-500/50 duration-300"
          >
            <h3 className="text-lg font-bold text-cyan-300">
              {member.username}
            </h3>
            <p className="text-sm text-white/80">{member.email}</p>
            {/* <p className="text-sm text-white/80 ">{member.password}</p> */}
            <p className="text-sm capitalize text-white/70">
              Role: {member.role}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEditClick(member)}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(member._id)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingMember && (
        <EditTeamModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleUpdateMember}
        />
      )}
    </div>
  );
};

export default TeamPage;
