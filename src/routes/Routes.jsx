import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import SignUp from "../Auth/SignUp";
import Login from "../Auth/Login";
import ForgotPassword from "../Auth/ForgotPassword";
import Dashboard from "../dashboard/Dashboard";
import LandingPage from "../pages/LandingPage";
import AuthAction from "../Auth/auth-action";
import ChatClass from "../classes/ChatClass";
import CreateClass from "../classes/CreateClass";
import JoinClass from "../classes/JoinClass";
import ClassmateAI from "../AI/AI";
import ProfilePage from "../pages/profile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Outlet />
          </>
        }
      >
        <Route index element={<LandingPage />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="auth-action" element={<AuthAction />} />
        <Route path="class/:id" element={<ChatClass />} />
        <Route path="create-class" element={<CreateClass />} />
        <Route path="join-class" element={<JoinClass />} />
        <Route path="ai-assistant" element={<ClassmateAI />} />
        <Route path="profile" element={<ProfilePage/>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
