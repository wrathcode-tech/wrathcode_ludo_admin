import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../Components/Login";
import DashboardPage from "../Components/DashboardPage";
import Notification from "../Components/NotificationPage";
import SupportPage from "../Components/SupportPage";
import AllUserList from "../Components/AllUser";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import BlogPage from "../Components/BlogPage";
import Chatpage from "../Components/SupportPage/Chatpage";
import ContactusList from "../Components/ContactusList";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};
const token = sessionStorage.getItem("token");

const Routing = () => {


  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
        <Route path="home" element={<ProtectedRoute> <DashboardPage /></ProtectedRoute>} />
        <Route path="notification" element={<ProtectedRoute> <Notification /></ProtectedRoute>} />
        <Route path="support" element={<ProtectedRoute> <SupportPage /></ProtectedRoute>} />
        <Route path="userList" element={<ProtectedRoute> <AllUserList /></ProtectedRoute>} />
        <Route path="blog" element={<ProtectedRoute> <BlogPage /></ProtectedRoute>} />
        <Route path="contactRequest" element={<ProtectedRoute> <ContactusList /></ProtectedRoute>} />
        <Route path="chat/:id" element={<ProtectedRoute> <Chatpage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={token ? <Navigate to="/dashboard/home" replace /> : <Navigate to="/" replace />} />
    </Routes>
  );
};

export default Routing;
