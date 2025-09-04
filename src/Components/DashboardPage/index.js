import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage } from '../../Utils/CustomAlertMessage';

function DashboardPage() {

    const [dashboardData, setDashboardData] = useState([]);
    const [dashboardList, setDashboardList] = useState([]);

    console.log(dashboardData, "dashboardData");

    useEffect(() => {
        handleDashboardData();
        handleDashboardList();
    }, []);

    const handleDashboardData = async () => {

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.dashboardData();
            if (result?.success) {
                setDashboardData(result)
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleDashboardList = async () => {

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.dashboardList();
            if (result?.success) {
                setDashboardList(result?.data?.reverse())
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
            <div class="dashboard_right">
                <UserHeader />
                <div class="dashboard_outer_s">
                    <div class="dashboard_summary_info">
                        <h2>Dashboard</h2>
                        <div class="dashboard_info_s">
                            <ul class="list_dashboard_cate">
                                <li>
                                    <div class="user_cnt_top">
                                        <div class="cnt_lft">
                                            <span>Total User</span>
                                            <h3>{dashboardData?.totalUser}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/user2.svg" alt="user" />
                                        </div>
                                    </div>
                                    {/* <p><span><img src="/images/markert_range_icon.svg" alt="market" />8.5%</span>Up from yesterday</p> */}
                                </li>
                                <li class="nth_one">
                                    <div class="user_cnt_top">
                                        <div class="cnt_lft">
                                            <span>Active User</span>
                                            <h3>{dashboardData?.activeUser}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p><span><img src="/images/markert_range_icon.svg" alt="market" />8.5%</span>Up from yesterday</p> */}
                                </li>
                                <li class="nth_two">
                                    <div class="user_cnt_top">
                                        <div class="cnt_lft">
                                            <span>Inactive User</span>
                                            <h3>{dashboardData?.inactiveUser}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon2.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p class="low_market"><span><img src="/images/markert_range_low.svg" alt="market" />4.3%</span>Down from
                                        yesterday</p> */}
                                </li>
                                <li class="nth_three">
                                    <div class="user_cnt_top">
                                        <div class="cnt_lft">
                                            <span>Open Support Tickets</span>
                                            <h3>{dashboardData?.openSupportTickets}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon3.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p><span><img src="/images/markert_range_icon.svg" alt="market" />8.5%</span>Up from yesterday</p> */}
                                </li>
                                <li class="nth_four">
                                    <div class="user_cnt_top">
                                        <div class="cnt_lft">
                                            <span>Resolved Support Tickets</span>
                                            <h3>{dashboardData?.resolvedSupportTickets}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon4.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p><span><img src="/images/markert_range_icon.svg" alt="market" />8.5%</span>Up from yesterday</p> */}
                                </li>
                                <li class="nth_five">
                                    <div class="user_cnt_top">
                                        <div class="cnt_lft">
                                            <span>Total ContactUs Requests</span>
                                            <h3>{dashboardData?.totalContactUsRequests}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon5.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p><span><img src="/images/markert_range_icon.svg" alt="market" />8.5%</span>Up from yesterday</p> */}
                                </li>
                                <li class="nth_six">
                                    <div class="user_cnt_top">
                                        <div class="cnt_lft">
                                            <span>Total Support Tickets</span>
                                            <h3>{dashboardData?.totalSupportTickets}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon6.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p class="low_market"><span><img src="/images/markert_range_low.svg" alt="market" />8.5%</span>Down from
                                        yesterday</p> */}
                                </li>
                                <li class="nth_seven">
                                    <div class="user_cnt_top">
                                        <div class="cnt_lft">
                                            <span>Closed Support Tickets</span>
                                            <h3>{dashboardData?.closedSupportTickets}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon7.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p><span><img src="/images/markert_range_icon.svg" alt="market" />8.5%</span>Up from yesterday</p> */}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="dashboard_detail_s">
                        <h3>Login Details</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th className="first_child">Activity</th>
                                    <th>IP Address</th>
                                    <th>Date - Time</th>
                                    {/* <th>Admin ID</th> */}
                                    {/* <th className="last_child">User ID</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardList.map((log, index) => (
                                    <tr key={log._id || index}>
                                        <td>
                                            <div className="td_first">
                                                <div className="product">
                                                    <img src="/images/product_img_t.png" alt="activity" />
                                                </div>
                                                <div className="title">{log.Activity}</div>
                                            </div>
                                        </td>
                                        <td>{log.IP || "-"}</td>
                                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                                        {/* <td>{log.adminId || "-"}</td> */}
                                        {/* <td>{log.userId || "-"}</td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardPage