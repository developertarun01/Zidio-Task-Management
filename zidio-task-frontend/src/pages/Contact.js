import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://zidio-task-management-tanmoy9088.onrender.com/feedback", form);

      setStatus("Message sent successfully!");
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#079cdd] via-[#0d8ab0] to-[#1c0fac] relative min-h-screen flex items-center justify-center overflow-hidden shadow-md rounded-md ">
      {/* Blurred background effects */}
      <div className="absolute w-72 h-72 bg-blue-300 opacity-30 rounded-full top-10 left-10 blur-3xl animate-pulse" />
      <div className="absolute w-64 h-64 bg-green-300 opacity-30 rounded-full bottom-10 right-10 blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-blue-100 backdrop-blur-md bg-opacity-70 shadow-xl rounded-lg max-w-4xl w-full mx-4 p-10 z-10"
      >
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Get In Touch
        </h2>

        {submitted ? (
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-green-600 text-center font-medium text-lg"
          >
            ✅ Thank you! We'll get back to you shortly.
          </motion.p>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-gray-700">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="text-gray-700">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message"
                  className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
              >
                Send Message
              </button>
            </form>

            {/* Contact details section */}
            <div className="text-gray-700 space-y-6">
              <div className="flex items-center space-x-4">
                <FaPhoneAlt className="text-purple-600" />
                <span>+91 9088 769088</span>
              </div>
              <div className="flex items-center space-x-4">
                <FaEnvelope className="text-purple-600" />
                <span>contact@zidio.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <FaMapMarkerAlt className="text-purple-600" />
                <span> 123-Taskmanager, Bengaluru, 560105, India</span>
              </div>
              <p className="mt-8">
                We typically respond within 24 hours. Whether it's a bug,
                feature request, or feedback — we’d love to hear from you!
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Contact;
