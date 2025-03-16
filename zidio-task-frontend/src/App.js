import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { useContext } from "react";
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
  if (user === null) return <p>Loading...</p>; // ✅ Prevents unwanted redirection
  return user ? children : <Navigate to="/login" />;
};

// ✅ Component to Show Heading on Login/Signup
const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <h1 className="text-3xl font-bold text-blue-700 mb-6">Welcome to Zidio Task Management</h1>
    {children}
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
};

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";

  return (
    <>
      {!isAuthPage && <Header />}
      <main className="container mx-auto">
        <Routes>
          <Route path="/" element={<AuthLayout><Auth isSignup={false} /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><Auth isSignup={true} /></AuthLayout>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/careers" element={<ProtectedRoute><Careers /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
};

export default App;
