import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Services from "./pages/Services";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" replace />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      
      {/* Root path redirects */}
      <Route path="/" element={
        user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to={user ? "/home" : "/login"} replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="container mx-auto flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;