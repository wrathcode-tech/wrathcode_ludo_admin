import React from "react";
const UserHeader = () => {

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
                            <h3>{emailId||"---"}</h3>
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
