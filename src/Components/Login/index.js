import React, { useState } from 'react'
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { useNavigate } from 'react-router-dom';


function LoginPage() {
    const navigate = useNavigate();
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [signId, setSignId] = useState("");


    const handleLogin = async (emailId, password, otp,) => {
        if (!emailId || !password) {
            alertErrorMessage("Please enter both email and password.");
            return;
        }
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.login(emailId, password, otp,);
            if (result?.success) {
                sessionStorage.setItem("token", result?.data?.token);
                sessionStorage.setItem("userId", result?.data?.userId);
                sessionStorage.setItem("emailId", result?.data?.emailId);
                alertSuccessMessage("Login successful!");
                navigate("/dashboard/home");
                window.location.reload();
            } else {
                alertErrorMessage(result?.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alertErrorMessage("Something went wrong during login.");
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleGetCode = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.getOtp(emailId);
            if (result?.success) {
                alertSuccessMessage("OTP sent successfully to your email!");
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            console.error("Get OTP error:", error);
            alertErrorMessage("Something went wrong while sending OTP.");
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };


    return (
        <>
            <div class="login_section">
                <div class="left_side_cnt">
                    <h1>Welcome to <span>Battle Ludo</span> Admin Dashboard</h1>
                    <div class="logo_vector">
                        <img src="/images/logo_login.svg" alt="logo" />
                    </div>
                </div>
                <div class="login_form_r">
                    <div class="form_login">
                        <h2>Sign in to account</h2>
                        <p>Enter your email & password to login</p>

                        <form>
                            <div class="form_input">
                                <input type="email" placeholder="Email *" value={emailId} onChange={(e) => setEmailId(e.target.value)} required="" />
                            </div>
                            <div class="form_input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password *"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                                <div
                                    className="view_icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ cursor: 'pointer' }}>
                                    <img
                                        src={showPassword ? "/images/view_close.svg" : "/images/view_icon.svg"}
                                        alt="view" />
                                </div>
                                <input
                                    type="number"
                                    placeholder="OTP *"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required />
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleGetCode}
                                >
                                    Get OTP
                                </button>
                            </div>
                            <div class="form_input" onClick={() => handleLogin(emailId, password, otp)}>
                                <input type="button" value="Login" />
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </>

    )
}

export default LoginPage
