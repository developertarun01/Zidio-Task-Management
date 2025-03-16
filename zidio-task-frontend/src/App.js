import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Services from "./pages/Services";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { AuthContext, AuthProvider } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user === null) {
    return <p>Loading...</p>; // ✅ Prevents unwanted redirection
  }

  return user ? children : <Navigate to="/login" />;
};


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="container mx-auto">
          <Routes>
            <Route path="/" element={<Auth isSignup={false} />} />
            <Route path="/signup" element={<Auth isSignup={true} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<ProtectedRoute>
              <About />
            </ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute>
              <Services />
            </ProtectedRoute>} />
            <Route path="/careers" element={<ProtectedRoute>
              <Careers />
            </ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute>
              <Contact />
            </ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
