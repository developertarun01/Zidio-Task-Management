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
import ProtectedRoute from "./components/PrivateRoute";
import Sidebar from "./components/Sidebar";
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
import CalendarView from "./components/CalendarView";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar";
import Trash from "./pages/Trash";
import NotificationToast from "./components/NotificationCompoment";
import TaskAssignment from "./components/TaskAssignment";
import UserDashboard from "./components/UserDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import TaskList from "./components/TaskList";
import TeamPage from "./components/TeamPage";
import AnalyticsPage from "./pages/AnalyticPage"; // Add the import for AnalyticsPage
// import { Sidebar } from "lucide-react";
import CreateMeeting from "./components/CreateMeeting";

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-white to-gray-100 text-gray-900">
      {/* Fixed Sidebar */}
      <div className="fixed z-40 inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-lg hidden md:block">
        <MobileSidebar />
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Navbar */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <Navbar />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 2xl:px-14 bg-white animate-fade-in">
          <Outlet />
        </main>
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
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/team" element={<TeamPage />} />
          </Route>
          <Route
            element={<ProtectedRoute allowedRoles={["admin", "manager"]} />}
          >
            <Route path="manager/dashboard" element={<ManagerDashboard />} />
          </Route>
          <Route path="/auth/google/dashboard" element={<Dashboard />} />
          {/* <Route path="/employee/dashboard" element={<UserDashboard />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/about" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/task-to-do" element={<TaskAssignment />} />
          <Route path="/services" element={<Services />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/notification" element={<NotificationToast />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/create-meeting" element={<CreateMeeting />} />
        </Route>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="h-screen text-center mt-32 text-red-500 text-2xl">
              404 Server error
            </div>
          }
        />
      </Routes>

      {/* <Footer /> */}
    </AuthProvider>
  );
};

export default App;
