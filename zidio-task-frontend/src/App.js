import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
// import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { setOpenSidebar } from "./redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import MobileSidebar from "./components/MobileSidebar";
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
import Trash from "./pages/Trash";
import NotificationComponent from "./components/NotificationCompoment";
import TaskAssignment from "./components/TaskAssignment";

function Layout() {
  const { user } = useSelector((state) => state.auth);

  const location = useLocation();

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row">

      <MobileSidebar />

      <div className="flex-1 overflow-y-auto">
        <Navbar />

        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}



const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/auth/google/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/addtask" element={<TaskAssignment />} />
          <Route path="/services" element={<Services />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/noti" element={<NotificationComponent />} />
        </Route>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer />
    </AuthProvider>
  );
};

export default App;
