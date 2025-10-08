import React, { useEffect, useState } from "react";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage } from "../../Utils/CustomAlertMessage";
const UserHeader = () => {

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

    const emailId = sessionStorage.getItem("emailId")
    return (
        <>
            <div class="top_header_dash">
                <div class="user_profile">
                    <div class="user_info_d">
                        {/* <div class="user_img">
                            <img src="/images/user_profile_img.png" alt="user" />
                        </div> */}
                        <div class="user_profile_cnt">
                            <h3> {profileData?.adminProfile?.emailId || "---"}</h3>
                            <span>Admin</span>
                        </div>
                    </div>
                    {/* <div class="profile_btn">
                        <button><img src="/images/arrow_btn.svg" alt="arrow" /></button>
                    </div> */}
                </div>
                <div class="toggle_menu">
                    <img src="/images/toggle_icon.svg" alt="toggle" />
                </div>
            </div>
        </>
    );
};

export default UserHeader;
