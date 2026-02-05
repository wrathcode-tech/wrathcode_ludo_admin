import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../../Api/Api_Services/AuthService";

const Sidebar = () => {
  const [actived, setActived] = useState("");
  const [pendingCounts, setPendingCounts] = useState({ deposit: 0, withdrawal: 0, dispute: 0, support: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const segments = location.pathname.split("/");
    const currentRoute = segments[segments.length - 1] || "home";
    setActived(currentRoute);
  }, [location]);

  const fetchPendingCounts = async () => {
    try {
      const counts = await AuthService.getPendingCounts();
      if (counts) setPendingCounts(counts);
    } catch (_) {}
  };

  useEffect(() => {
    fetchPendingCounts();
  }, [location.pathname]);

  useEffect(() => {
    const onRefreshCounts = () => fetchPendingCounts();
    window.addEventListener("refreshSidebarCounts", onRefreshCounts);
    return () => window.removeEventListener("refreshSidebarCounts", onRefreshCounts);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    window.location.reload();
    navigate("/login");
  };

  const BadgeCount = ({ count }) => {
    if (count == null || count <= 0) return null;
    return (
      <span
        className="sidebar-pending-badge"
        style={{
          background: "#dc2626",
          color: "#fff",
          borderRadius: "50%",
          minWidth: "20px",
          height: "20px",
          fontSize: "0.7rem",
          fontWeight: "700",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 5px",
          marginLeft: "6px",
        }}
      >
        {count > 99 ? "99+" : count}
      </span>
    );
  };

  const navLink = (to, slug, label, icon, count) => (
    <li className={actived === slug ? "active" : ""}>
      <Link to={to} onClick={() => setActived(slug)}>
        <i className={`fas ${icon}`} />
        <span>{label}</span>
        {count != null && count > 0 && <BadgeCount count={count} />}
      </Link>
    </li>
  );

  const sectionLabel = (text) => (
    <li className="sidebar-section-label">
      <span>{text}</span>
    </li>
  );

  return (
    <div className="dashboard">
      <div className="leftside_menu sidebar-premium">
        <div className="leftside_items">
          <div className="logo sidebar-logo">
            <Link to="/dashboard/home" onClick={() => setActived("home")}>
              <img src="/images/logoplayfista.png" loading="lazy" alt="Play Fista" />
            </Link>
          </div>
          <div className="toggle_menu" id="toggleBtn">
            <img src="/images/toggle_icon.svg" loading="lazy" alt="toggle" />
          </div>
          <div className="navi_sidebar" id="content">
            <div className="responsive_scrool">
              <ul className="list-unstyled ps-0">
                {sectionLabel("Main")}
                {navLink("/dashboard/home", "home", "Dashboard", "fa-home")}
                {navLink("/dashboard/userList", "userList", "User List", "fa-users")}
                {navLink("/dashboard/UserKyc", "UserKyc", "User KYC Verification", "fa-id-card")}

                {sectionLabel("Support & Disputes")}
                {navLink("/dashboard/support", "support", "User Support", "fa-headset", pendingCounts.support)}
                {navLink("/dashboard/disputeResponse", "disputeResponse", "Dispute Management", "fa-gavel", pendingCounts.dispute)}

                {sectionLabel("Finance")}
                {navLink("/dashboard/DespositRequest", "DespositRequest", "Deposit Requests", "fa-arrow-down", pendingCounts.deposit)}
                {navLink("/dashboard/withdrawalRequest", "withdrawalRequest", "Withdrawal Requests", "fa-arrow-up", pendingCounts.withdrawal)}
                {navLink("/dashboard/earn_depositWithdrawSummary", "earn_depositWithdrawSummary", "Deposit & Withdrawal Summary", "fa-chart-pie")}
                {navLink("/dashboard/addBank", "addBank", "Admin Bank Details", "fa-university")}

                {sectionLabel("Games")}
                {navLink("/dashboard/AllGamesList", "AllGamesList", "All Games", "fa-gamepad")}
                {navLink("/dashboard/matchDetails", "matchDetails", "Match Details", "fa-trophy")}

                {sectionLabel("Bonus & Earnings")}
                {navLink("/dashboard/earn_referralBonus", "earn_referralBonus", "Referral Bonus List", "fa-gift")}
                {navLink("/dashboard/commissionBonusList", "commissionBonusList", "Commission Bonus List", "fa-percent")}

                {sectionLabel("System")}
                {navLink("/dashboard/notification", "notification", "Send Notifications", "fa-bell")}
                {navLink("/dashboard/partners", "partners", "Partners", "fa-handshake")}
                {navLink("/dashboard/BannerManagement", "BannerManagement", "Banner Management", "fa-image")}
                {navLink("/dashboard/settings", "settings", "Settings", "fa-cog")}
              </ul>
            </div>

            <div className="logout_btn">
              <a href="#/" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt" />
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Sidebar;
