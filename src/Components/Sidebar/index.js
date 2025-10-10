import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
    const [actived, setActived] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const segments = location.pathname.split("/");
        const currentRoute = segments[segments.length - 1] || "dashboard";
        setActived(currentRoute);
    }, [location]);

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.reload()
        navigate("/login");
    };

    return (
        <div className="dashboard">
            <div class="leftside_menu">
                <div class="leftside_items">
                    <div class="logo">
                        <Link to="/dashboard/home" onClick={() => setActived("home")}><img src="/images/logoplayfista.png" alt="logo" /></Link>
                    </div>
                    <div class="toggle_menu" id="toggleBtn">
                        <img src="/images/toggle_icon.svg" alt="toggle" />
                    </div>
                    <div class="navi_sidebar" id="content">
                        <div className="responsive_scrool">
                            <ul className="list-unstyled ps-0">
                                <li className={actived === "home" ? "active" : ""}>
                                    <Link to="/dashboard/home" onClick={() => setActived("home")}>
                                        <img src="/images/dashboard_icon.png" alt="Dashboard" />Dashboard
                                    </Link>
                                </li>
                                <li className={actived === "userList" ? "active" : ""}>
                                    <Link to="/dashboard/userList" onClick={() => setActived("userList")}>
                                        <img src="/images/user_icon.png" alt="User List" />User List
                                    </Link>
                                </li>

                                <li className={actived === "UserKyc" ? "active" : ""}>
                                    <Link to="/dashboard/UserKyc" onClick={() => setActived("UserKyc")}>
                                        <img src="/images/user_kyc_icon.png" alt="User KYC" />User KYC Verification
                                    </Link>
                                </li>
                                <li className={actived === "DespositRequest" ? "active" : ""}>
                                    <Link to="/dashboard/DespositRequest" onClick={() => setActived("DespositRequest")}>
                                        <img src="/images/deposit_icon.png" alt="Deposit Requests" />Deposit Requests
                                    </Link>
                                </li>

                                <li className={actived === "withdrawalRequest" ? "active" : ""}>
                                    <Link to="/dashboard/withdrawalRequest" onClick={() => setActived("withdrawalRequest")}>
                                        <img src="/images/withdarawal_icon.png" alt="Withdrawal Requests" />Withdrawal Requests
                                    </Link>
                                </li>

                                <li className={actived === "earn_depositWithdrawSummary" ? "active" : ""}>
                                    <Link to="/dashboard/earn_depositWithdrawSummary" onClick={() => setActived("earn_depositWithdrawSummary")}>
                                        <img src="/images/deposit_withdarawal_icon.png" alt="Deposit/Withdrawal Summary" />Deposit & Withdrawal Summary
                                    </Link>
                                </li>

                                <li className={actived === "addBank" ? "active" : ""}>
                                    <Link to="/dashboard/addBank" onClick={() => setActived("addBank")}>
                                        <img src="/images/support_icon.png" alt="Admin Bank Details" />Admin Bank Details
                                    </Link>
                                </li>

                                {/* 🎮 Game Management */}
                                <li className={actived === "AllGamesList" ? "active" : ""}>
                                    <Link to="/dashboard/AllGamesList" onClick={() => setActived("AllGamesList")}>
                                        <img src="/images/gamelist_icon.png" alt="All Games" />All Games
                                    </Link>
                                </li>

                                <li className={actived === "matchDetails" ? "active" : ""}>
                                    <Link to="/dashboard/matchDetails" onClick={() => setActived("matchDetails")}>
                                        <img src="/images/match_detail_icon.png" alt="Match Details" />Match Details
                                    </Link>
                                </li>

                                {/* 🎁 Bonus & Earnings */}
                                <li className={actived === "earn_referralBonus" ? "active" : ""}>
                                    <Link to="/dashboard/earn_referralBonus" onClick={() => setActived("earn_referralBonus")}>
                                        <img src="/images/bouns_refrence_icon.png" alt="Referral Bonus" />Referral Bonus List
                                    </Link>
                                </li>

                                <li className={actived === "commissionBonusList" ? "active" : ""}>
                                    <Link to="/dashboard/commissionBonusList" onClick={() => setActived("commissionBonusList")}>
                                        <img src="/images/commision_bouns_icon.png" alt="Commission Bonus" />Commission Bonus List
                                    </Link>
                                </li>

                                {/* 🧾 Support & Disputes */}
                                <li className={actived === "support" ? "active" : ""}>
                                    <Link to="/dashboard/support" onClick={() => setActived("support")}>
                                        <img src="/images/support_icon.png" alt="Support" />User Support
                                    </Link>
                                </li>

                                <li className={actived === "disputeResponse" ? "active" : ""}>
                                    <Link to="/dashboard/disputeResponse" onClick={() => setActived("disputeResponse")}>
                                        <img src="/images/support_icon.svg" alt="Dispute Response" />Dispute Management
                                    </Link>
                                </li>

                                {/* ⚙️ System Management */}
                                <li className={actived === "notification" ? "active" : ""}>
                                    <Link to="/dashboard/notification" onClick={() => setActived("notification")}>
                                        <img src="/images/notification_icon.png" alt="Notifications" />Send Notifications
                                    </Link>
                                </li>

                                <li className={actived === "BannerManagement" ? "active" : ""}>
                                    <Link to="/dashboard/BannerManagement" onClick={() => setActived("BannerManagement")}>
                                        <img src="/images/banner_management_icon.png" alt="Banner Management" />Banner Management
                                    </Link>
                                </li>

                            </ul>
                        </div>

                        <div class="logout_btn">
                            <a href="#/" onClick={handleLogout}><img src="/images/logout_icon.png" alt="Logout" />Logout</a>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default Sidebar;
