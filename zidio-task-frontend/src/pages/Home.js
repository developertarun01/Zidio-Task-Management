import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// import Navbar from "../components/navbar"; 

// --- Configuration ---

// 1. Data Array for Features (same as before)
const featuresData = [
  { title: "📅 Task Scheduling", description: "Plan your tasks and never miss a deadline." },
  { title: "✅ Real-Time Updates", description: "Stay updated with real-time task tracking." },
  { title: "📊 Progress Analytics", description: "Monitor your performance with detailed charts." },
  { title: "🤝 Create Meeting", description: "Schedule and manage team meetings directly." },
  { title: "📈 Performance Analyze", description: "Review individual and team productivity metrics." },
  { title: "💬 Connect through AI chat", description: "Get instant support and task suggestions." },
];

// Framer Motion Variants for Staggered Effect (same as before)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// --- Testimonial Data for the new section ---
const testimonials = [
    { quote: "This is the most intuitive task manager I've ever used. The gradient is stunning!", author: "Sarah C., Project Manager" },
    { quote: "Seamless collaboration and zero learning curve. Our team's productivity doubled in a month.", author: "Mike L., Startup Founder" },
    { quote: "Finally, a free tool that doesn't feel limited. The analytics are a game-changer.", author: "Aisha R., Freelancer" },
];

// --- Components ---

// Feature Card Component (same as before)
const FeatureCard = ({ title, description, variants }) => {
  return (
    <motion.div
      className="p-6 bg-[#ffffff] text-gray-900 rounded-xl shadow-2xl text-center border-b-4 border-[#7200c9]"
      variants={variants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <h3 className="text-xl font-extrabold font-display">{title}</h3>
      <p className="text-sm mt-2">{description}</p>
    </motion.div>
  );
};

// Testimonial Card Component (New)
const TestimonialCard = ({ quote, author }) => (
    <motion.div
        className="p-6 bg-white/20 rounded-xl shadow-xl border border-white/30 backdrop-blur-md text-left"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
    >
        <p className="italic text-lg mb-4">"{quote}"</p>
        <p className="font-bold text-sm text-yellow-300">- {author}</p>
    </motion.div>
);


// --- Main Component ---

const Home = () => {
  // Utility class for attention-grabbing headings (assuming a custom font)
  const fontDisplayClass = "font-extrabold tracking-tight"; 
  
  return (
    <div
      className={`bg-gradient-to-r from-[#e94315] from-5% via-[#7200c9] via-60% to-[#0e8ccb] to-90% flex flex-col items-center justify-start text-white pt-16`}
    >
      {/* <Navbar /> */}
      
      {/* 1. Hero Section */}
      <div className="flex flex-col items-center justify-center p-4 min-h-[50vh]">
        <motion.h1
          className={`text-6xl md:text-8xl text-center ${fontDisplayClass} max-w-4xl`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Your Next-Gen Task Manager is <span className="text-yellow-400">Completely Free</span>.
        </motion.h1>
        <motion.p
          className="text-xl mt-6 text-center max-w-3xl font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Organize your tasks efficiently with our feature-rich task manager.
          Plan, track, and manage your projects in one beautifully animated place.
        </motion.p>

        {/* Animated Buttons */}
        <motion.div
          className="mt-8 flex space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link to="/register">
            <motion.button
              className="px-8 py-3 bg-yellow-400 text-gray-900 font-extrabold rounded-full shadow-lg hover:bg-yellow-300 transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Start Free Today
            </motion.button>
          </Link>
          <Link to="/login">
            <motion.button
              className="px-8 py-3 bg-gray-900/50 text-white font-bold rounded-full shadow-lg border border-white/30 hover:bg-gray-800/70 transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Login
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* 2. Animated Staggered Features Section */}
      <motion.div
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {featuresData.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            variants={itemVariants}
          />
        ))}
      </motion.div>

      {/* --- New Section 3: Value Proposition / Collaboration Focus --- */}
      <div className="w-full mt-24 bg-white/10 backdrop-blur-sm shadow-inner py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className={`text-4xl md:text-5xl mb-4 ${fontDisplayClass}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Stop Juggling: One Tool for Seamless Teamwork 🚀
          </motion.h2>
          <motion.p
            className="text-xl text-white/80 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We integrate **real-time chat**, **file sharing**, and **AI assistance** directly into your task board, ensuring your team is always aligned and ready to execute.
          </motion.p>
        </div>
      </div>
      
      {/* --- New Section 4: Testimonials / Social Proof --- */}
      <div className="w-full py-16 px-4">
        <div className="max-w-6xl mx-auto">
            <motion.h2
                className={`text-center text-4xl md:text-5xl mb-12 ${fontDisplayClass}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
            >
                Trusted by Teams Worldwide
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, index) => (
                    <TestimonialCard key={index} quote={t.quote} author={t.author} />
                ))}
            </div>
        </div>
      </div>

      {/* --- New Section 5: Final CTA (Simplified Pricing) --- */}
      <div className="w-full bg-[#1e053f]/80 py-20 px-4 mt-16">
        <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.0 }}
        >
            <h2 className={`text-5xl text-yellow-300 mb-4 ${fontDisplayClass}`}>
                Always Free. No Limits.
            </h2>
            <p className="text-xl text-white/70 mb-8">
                Enjoy unlimited tasks, projects, and collaboration features. Upgrade only if you need enterprise support.
            </p>
            
            <Link to="/register">
                <motion.button
                    className="px-12 py-5 bg-yellow-400 text-gray-900 font-extrabold rounded-full text-xl shadow-2xl hover:bg-yellow-300 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Claim Your Free Account Now →
                </motion.button>
            </Link>
            <p className="mt-4 text-sm text-white/50">
                Setup takes less than 60 seconds.
            </p>
        </motion.div>
      </div>

    </div>
  );
};

export default Home;