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
                        <img src="/images/logo_login.svg" alt="logo" />
                    </div>
                    <div class="toggle_menu" id="toggleBtn">
                        <img src="/images/toggle_icon.svg" alt="toggle" />
                    </div>
                    <div class="navi_sidebar" id="content">
                        <div className="responsive_scrool">
                        <ul className="list-unstyled ps-0">
                            <li className={actived === "home" ? "active" : ""}>
                                <Link to="/dashboard/home" onClick={() => setActived("home")}><img src="/images/dashboad_icon.svg" alt="dashboard" />My Dashboard</Link>
                            </li>
                            {/* <li className={actived === "admin" ? "active" : ""}>
                                <Link to="/dashboard/home" onClick={() => setActived("admin")}><img src="/images/admin_icon.svg" alt="dashboard" />Sub Admin</Link>
                            </li> */}

                            <li className={actived === "userList" ? "active" : ""}>
                                <Link to="/dashboard/userList" onClick={() => setActived("userList")}><img src="/images/user_list_icon.svg" alt="dashboard" />All Users</Link>
                            </li>
                            <li className={actived === "notification" ? "active" : ""}>
                                <Link to="/dashboard/notification" onClick={() => setActived("notification")}><img src="/images/notification_icon.svg" alt="dashboard" />Notifications</Link>
                            </li>
                            <li className={actived === "blog" ? "active" : ""}>
                                <Link to="/dashboard/blog" onClick={() => setActived("blog")}><img src="/images/blog_icon.svg" alt="dashboard" />Blog</Link>
                            </li>
                            <li className={actived === "support" ? "active" : ""}>
                                <Link to="/dashboard/support" onClick={() => setActived("support")}><img src="/images/support_icon.svg" alt="dashboard" />Support</Link>
                            </li>
                            <li className={actived === "contactRequest" ? "active" : ""}>
                                <Link to="/dashboard/contactRequest" onClick={() => setActived("contactRequest")}><img src="/images/support_icon.svg" alt="dashboard" />Contact Request</Link>
                            </li>

                        </ul>
                        </div>
                        <div class="logout_btn">
                            <a href="#/" onClick={handleLogout}><img src="/images/logout_icon.svg" alt="dashboard" />Logout</a>
                        </div>

                    </div>
                </div>
                {/* <div class="logout_btn">
                    <a href="#/" onClick={handleLogout}><img src="/images/logout_icon.svg" alt="dashboard" />Logout</a>
                </div> */}
            </div>

            <Outlet />
        </div>
    );
};

export default Sidebar;
