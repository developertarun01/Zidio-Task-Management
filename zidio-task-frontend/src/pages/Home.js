import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col items-center justify-center text-white px-4">
      {/* Hero Section */}
      <motion.h1
        className="text-5xl font-extrabold text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to Zidio Task Manager 🚀
      </motion.h1>
      <motion.p
        className="text-lg mt-4 text-center max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Organize your tasks efficiently with our feature-rich task manager. Plan, track, and manage your projects in one place.
      </motion.p>

      {/* Animated Buttons */}
      <motion.div
        className="mt-8 flex space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <Link to="/auth/google/dashboard">
          <motion.button
            className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:bg-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Go to Dashboard
          </motion.button>
        </Link>
        <Link to="/addtask">
          <motion.button
            className="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg shadow-lg hover:bg-gray-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Get Started
          </motion.button>
        </Link>
      </motion.div>

      {/* Animated Features Section */}
      <motion.div
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <FeatureCard
          title="📅 Task Scheduling"
          description="Plan your tasks and never miss a deadline."
        />
        <FeatureCard
          title="✅ Real-Time Updates"
          description="Stay updated with real-time task tracking."
        />
        <FeatureCard
          title="📊 Progress Analytics"
          description="Monitor your performance with detailed charts."
        />
      </motion.div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ title, description }) => {
  return (
    <motion.div
      className="p-6 bg-white text-gray-900 rounded-lg shadow-lg text-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm mt-2">{description}</p>
    </motion.div>
  );
};

export default Home;
