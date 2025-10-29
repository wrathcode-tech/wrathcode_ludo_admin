import React, { useState, useEffect } from 'react'
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
    const [timer, setTimer] = useState(0); // countdown in seconds
    const [isOtpSent, setIsOtpSent] = useState(false);

    const handleLogin = async (emailId, password, otp) => {
        if (!emailId || !password) {
            alertErrorMessage("Please enter both email and password.");
            return;
        }
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.login(emailId, password, otp);
            if (result?.success) {
                sessionStorage.setItem("token", result?.data?.token);
                sessionStorage.setItem("userId", result?.data?.id);
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
                alertSuccessMessage("OTP sent successfully to your Mobile Number!");
                setTimer(30);
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

    useEffect(() => {
        if (timer === 0) return; // stop when timer is 0
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    return (
        <div className="login_section">
            <div className="left_side_cnt">
                <h1>
                    Welcome to <span>PlayFista Ludo</span> Admin Dashboard
                </h1>
                <div className="logo_vector">
                    <img src="/images/logoplayfista.png" alt="logo" />
                </div>
            </div>

            <div className="login_form_r">
                <div className="form_login">
                    <h2>Sign in to account</h2>
                    <p>Enter your email & password to login</p>

                    <form>
                        <div className="form_input d-flex">
                            <input
                                type="email"
                                placeholder="Email *"
                                value={emailId}
                                onChange={(e) => setEmailId(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="getotp"
                                onClick={handleGetCode}
                                disabled={timer > 0}
                            >
                                {timer > 0 ? `Resend OTP in ${timer}s` : isOtpSent ? "Resend OTP" : "Get OTP"}
                            </button>
                        </div>

                        <div className="form_input">
                            <input
                                type="number"
                                placeholder="OTP *"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form_input d-flex">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password *"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div
                                className="view_icon"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: "pointer" }}
                            >
                                <img
                                    src={
                                        showPassword
                                            ? "/images/view_close.svg"
                                            : "/images/view_icon.svg"
                                    }
                                    alt="view"
                                />
                            </div>
                        </div>

                        <div
                            className="form_input"
                            onClick={() => handleLogin(emailId, password, otp)}
                        >
                            <input type="button" value="Login" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
