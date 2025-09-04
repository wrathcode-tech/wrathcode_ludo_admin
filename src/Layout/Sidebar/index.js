import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ProfileContext } from "../../Context";
import { ApiConfig } from "../../Api/Api_Config/ApiEndpoints";
import { alertSuccessMessage } from "../../Utils/CustomAlertMessage";
import copy from "copy-to-clipboard";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    let URL = window.location.href?.split('/');
    let route = URL.pop();
    if (URL?.length < 4 || !route) {
      navigate('/profile/Settings')
    }
  }, []);

  // ********* Context ********** //
  const { firstName, email, lastName, userImage, kycStatus, handleUserDetials, UIN } = useContext(ProfileContext);


  useEffect(() => {
    handleUserDetials();
  }, []);

  return (
    <>
      <section className="inner-page-banner">
        <div className="container">
          <div className="inner text-center">
            <h1 className="title">Account Settings</h1>
            <nav className="mt-4">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Account Settings
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </section>
      <section className="pb-90 account_sec ">
        <div className=" container-custom">
          <form>
            <div className="create-item-wrapper my_acc ">
              <div className="row">
                <div className="col-lg-3 col-md-12 col-md-4">
                  <div className=" d-flex align-items-center ">
                    <img className="img-account-profile rounded-circle me-3" alt="UserImage"
                      src={userImage ? `${ApiConfig.baseUrl + userImage}` : "/images/profilelogo.png"}
                    />
                    <div>
                      <h5 className="fw-bolder pp-name fs-4 mb-0">
                        {`${firstName + ' ' + lastName}`}
                        <small className="text-success ms-2">
                          {kycStatus === 2 &&
                            <i className="ri-checkbox-circle-line"></i>
                          }
                        </small>
                      </h5>
                      <div className=" text-gray">
                        <small>{email && email}</small>
                      </div>
                      <div className=" text-gray">
                        <small> UIN : {UIN}</small><span className="mx-2"><i className="ri-file-copy-line" style={{ cursor: 'pointer' }} onClick={() => { copy(UIN); alertSuccessMessage('UIN Copied!!') }}></i></span>
                      </div>
                    </div>
                  </div>
                  <div className="acc_tabs form-field-wrapper mt-5 mb-5">
                    <ul className="nav nav-pills flex-column" id="cardTab" role="tablist">
                      <li  >
                        <Link to="Settings" className={`menu-link nav-link ${activeTab === 'Settings' ? 'active' : ' '}`}>
                          <span className="menu-bullet">
                            <span className="bullet"></span>
                          </span>
                          <span className="menu-title"> My Profile </span>
                        </Link>
                      </li>

                      <li >
                        <Link to="Twofactor" className={`menu-link nav-link ${activeTab === 'Twofactor' ? 'active' : ' '}`}> <span className="menu-bullet"><span className="bullet"></span>
                        </span><span className="menu-title"> Two Factor Authentication</span></Link>
                      </li>

                      <li >
                        <Link to="CurrencyPrefrence" className={`menu-link nav-link ${activeTab === 'CurrencyPrefrence' ? 'active' : ' '}`}> <span className="menu-bullet"><span className="bullet"></span>
                        </span><span className="menu-title">Currency Preference</span></Link>
                      </li>

                      <li className="active"  >
                        <Link className="menu-link  nav-link" id="kyc" to="/KycPage">
                          <span className="menu-bullet">
                            <span className="bullet"></span>
                          </span>
                          <span className="menu-title"> KYC Verification</span>
                        </Link>
                      </li>
                      <li >
                        <Link to="Activitylog" className={`menu-link nav-link ${activeTab === 'Activitylog' ? 'active' : ' '}`}> <span className="menu-bullet"><span className="bullet"></span>
                        </span><span className="menu-title"> Activity Logs</span></Link>
                      </li>
                      <li >
                        <Link to="Notifications" className={`menu-link nav-link ${activeTab === 'Notifications' ? 'active' : ' '}`}> <span className="menu-bullet"><span className="bullet"></span>
                        </span><span className="menu-title">Notification</span></Link>
                      </li>
                      <li >
                        <Link to="SecurityPage" className={`menu-link nav-link ${activeTab === 'SecurityPage' ? 'active' : ' '}`}> <span className="menu-bullet"><span className="bullet"></span>
                        </span><span className="menu-title">Security</span></Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-9">
                  <Outlet context={[setActiveTab]} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default AccountPage;
