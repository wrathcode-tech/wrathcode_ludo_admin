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
// import Chatpage from "../Components/SupportPage/Chatpage";
import ContactusList from "../Components/ContactusList";
import UserKyc from "../Components/UserKyc";
import MatchDetails from "../Components/MatchDetails/Index";
import OverAllReferralEarnList from "../Components/ReferralBonusEarn/Index";
import OverAllCommissionEarnList from "../Components/AllCommissionBonusEarn/Index";
import DepostiWithdraSummary from "../Components/DepositsList/DepostiWithdraSummary";
import UserEarningSummary from "../Components/UserEarningSummary";
import WithdrawalRequest from "../Components/WithdrawalRequest/Index";
import UserDetails from "../Components/AllUser/UserDetails";
import BannerManagement from "../Components/BannerManagement/BannerManagement";
import DisputeResponse from "../Components/DisputeResponse/DisputeResponse";
import CommissionBonusList from "../Components/AllCommissionBonusList/CommissionBonusList";
import AddBankDetails from "../Components/AdminBankDetails/AddBankDetails";
import DepositRequest from "../Components/DepositsList/DepositRequest";
import AllGameList from "../Components/AllGamesList/AllGameList";

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
        <Route path="UserKyc" element={<ProtectedRoute> <UserKyc /></ProtectedRoute>} />
        <Route path="DespositRequest" element={<ProtectedRoute> <DepositRequest /></ProtectedRoute>} />
        <Route path="matchDetails" element={<ProtectedRoute> <MatchDetails /></ProtectedRoute>} />
        <Route path="blog" element={<ProtectedRoute> <BlogPage /></ProtectedRoute>} />
        <Route path="contactRequest" element={<ProtectedRoute> <ContactusList /></ProtectedRoute>} />
        <Route path="earn_referralBonus" element={<ProtectedRoute> <OverAllReferralEarnList /></ProtectedRoute>} />
        <Route path="earn_commissionBonus" element={<ProtectedRoute> <OverAllCommissionEarnList /></ProtectedRoute>} />
        <Route path="earn_depositWithdrawSummary" element={<ProtectedRoute> <DepostiWithdraSummary /></ProtectedRoute>} />
        <Route path="earn_userEarningSummary" element={<ProtectedRoute> <UserEarningSummary /></ProtectedRoute>} />
        <Route path="withdrawalRequest" element={<ProtectedRoute> <WithdrawalRequest /></ProtectedRoute>} />
        <Route path="UserDetails" element={<ProtectedRoute> <UserDetails /></ProtectedRoute>} />
        <Route path="BannerManagement" element={<ProtectedRoute> <BannerManagement /></ProtectedRoute>} />
        <Route path="disputeResponse" element={<ProtectedRoute> <DisputeResponse /></ProtectedRoute>} />
        <Route path="commissionBonusList" element={<ProtectedRoute> <CommissionBonusList /></ProtectedRoute>} />
        <Route path="addBank" element={<ProtectedRoute> <AddBankDetails /></ProtectedRoute>} />



        {/* <Route path="chat/:id" element={<ProtectedRoute> <Chatpage /></ProtectedRoute>} /> */}
        <Route path="AllGamesList" element={<ProtectedRoute> <AllGameList /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={token ? <Navigate to="/dashboard/home" replace /> : <Navigate to="/" replace />} />
    </Routes>
  );
};

export default Routing;
