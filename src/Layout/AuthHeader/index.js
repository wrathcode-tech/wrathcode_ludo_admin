import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../Api/Api_Services/AuthService";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import { alertErrorMessage } from "../../Utils/CustomAlertMessage";


const AuthHeader = () => {

  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    handleDashboardData();
  }, []);

  const handleDashboardData = async () => {

    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.dashboardData();
      if (result?.success) {
        setProfileData(result?.data);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-2">
              <div className="logo">
                <Link to="/"><img src="/images/logo.png" alt="logo" /></Link>
              </div>
            </div>
            <div className="col-sm-12  col-md-12 col-lg-6 ">
              <div className="navigation">
                <div class="toggle_menu">
                  <img src="/images/toggle_icon.svg" alt="toggle" />
                </div>
                <div className="navi_sidebar">
                  <nav className="navbar navbar-expand-lg ">
                    <div className="container-fluid">
                      {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                      data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                      aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon">
                        <img src="/images/toggle_icon.svg" alt="toggle" />
                      </span>
                    </button> */}
                      <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                          <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/">Home</Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/about_us">About Us</Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/wallet_recovery">Wallet Recovery</Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/Scam_tracing">Scam Tracing</Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/blog">Blog</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4  col-lg-4">
              <div className="header_right">
                <div className="button_outer">
                  <Link className="login_btn sign_btn" to="/register">Sign up</Link>
                  <Link className="login_btn" to="/login">Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AuthHeader;