import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage } from '../../Utils/CustomAlertMessage';
import DataTableBase from '../../Utils/DataTable';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Utils/Loading';

function DashboardPage() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState([]);
    const [dashboardList, setDashboardList] = useState([]);
    const [loading, setLoading] = useState(false);
    // state setup
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10); // default

    useEffect(() => {
        handleDashboardData();
    }, []);

    const handleDashboardData = async () => {

        try {
            setLoading(true);
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.dashboardData();
            if (result?.success) {
                setDashboardData(result?.data)
                setDashboardList(result?.data?.activityLogs?.reverse())
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            setLoading(false);
            LoaderHelper.loaderStatus(false);
        }
    };
    const columns = [
        {
            name: "Sr No",
            cell: (row, rowIndex) => (rowIndex + 1 + (currentPage - 1) * rowsPerPage),
            width: '80px',
        },
        {
            name: "Activity",
            selector: (row) => row.Activity,
            sortable: true,
            cell: (row) => (
                <div className="td_first" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="title">{row.Activity}</div>
                </div>
            ),
        },
        {
            name: "IP Address",
            selector: (row) => row.adminIP || "-",
            sortable: true,
            wrap: true,
        },
        {
            name: "Date - Time",
            selector: (row) => new Date(row.createdAt).toLocaleString(),
            sortable: true,
            wrap: true,
        },
    ];

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
                                    <div className="user_cnt_top"
                                        onClick={() => navigate("/dashboard/userList")}
                                        style={{ cursor: "pointer" }} // pointer dikhane ke liye
                                    >
                                        <div className="cnt_lft">
                                            <span>Total User</span>
                                            <h3>{dashboardData?.totalUser}</h3>
                                        </div>
                                        <div className="dashboard_icon">
                                            <img src="/images/user2.svg" alt="user" />
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="user_cnt_top"
                                        onClick={() => navigate("/dashboard/disputeResponse")}
                                        style={{ cursor: "pointer" }} // pointer dikhane ke liye
                                    >
                                        <div className="cnt_lft">
                                            <span>Total Disputes</span>
                                            <h3>{dashboardData?.totalDispute}</h3>
                                        </div>
                                        <div className="dashboard_icon">
                                            <img src="/images/user2.svg" alt="user" />
                                        </div>
                                    </div>
                                </li>

                                <li class="nth_three">
                                    <div class="user_cnt_top"
                                        onClick={() => navigate("/dashboard/earn_depositWithdrawSummary")}
                                        style={{ cursor: "pointer" }}>
                                        <div class="cnt_lft">
                                            <span>Total Deposit (INR)</span>
                                            <h3>{dashboardData?.totalDepositInr}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon3.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p><span><img src="/images/markert_range_icon.svg" alt="market" />8.5%</span>Up from yesterday</p> */}
                                </li>
                                <li class="nth_two">
                                    <div class="user_cnt_top"
                                        onClick={() => navigate("/dashboard/withdrawalRequest")}
                                        style={{ cursor: "pointer" }}>
                                        <div class="cnt_lft">
                                            <span>Total Withdrawal (INR)</span>
                                            <h3>{dashboardData?.totalWithdrawalInr}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon2.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p class="low_market"><span><img src="/images/markert_range_low.svg" alt="market" />4.3%</span>Down from
                                        yesterday</p> */}
                                </li>
                                <li class="nth_six">
                                    <div class="user_cnt_top" onClick={() => navigate("/dashboard/AllGamesList")}
                                        style={{ cursor: "pointer" }}>
                                        <div class="cnt_lft">
                                            <span>Total Running Games</span>
                                            <h3>{dashboardData?.totalRunninnGame}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon6.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p class="low_market"><span><img src="/images/markert_range_low.svg" alt="market" />8.5%</span>Down from
                                        yesterday</p> */}
                                </li>
                                <li class="nth_seven">
                                    <div class="user_cnt_top" onClick={() => navigate("/dashboard/AllGamesList")}
                                        style={{ cursor: "pointer" }}>
                                        <div class="cnt_lft">
                                            <span>Total Open Battles</span>
                                            <h3>{dashboardData?.totalWaitingGame}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon7.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p><span><img src="/images/markert_range_icon.svg" alt="market" />8.5%</span>Up from yesterday</p> */}
                                </li>
                                <li class="nth_four">
                                    <div class="user_cnt_top" onClick={() => navigate("/dashboard/AllGamesList")}
                                        style={{ cursor: "pointer" }}>
                                        <div class="cnt_lft">
                                            <span>Total Admin Commission</span>
                                            <h3>{dashboardData?.totalAdminCommission}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon5.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p><span><img src="/images/markert_range_icon.svg" alt="market" />8.5%</span>Up from yesterday</p> */}
                                </li>
                                <li class="nth_five">
                                    <div class="user_cnt_top" onClick={() => navigate("/dashboard/commissionBonusList")}
                                        style={{ cursor: "pointer" }}>
                                        <div class="cnt_lft">
                                            <span>Total Commission Distibuted</span>
                                            <h3>{dashboardData?.totalUserCommission}</h3>
                                        </div>
                                        <div class="dashboard_icon">
                                            <img src="/images/dashboad_list_icon5.svg" alt="dashboard" />
                                        </div>
                                    </div>
                                    {/* <p><span><img src="/images/markert_range_icon.svg" alt="market" />8.5%</span>Up from yesterday</p> */}
                                </li>

                            </ul>
                        </div>
                    </div>
                    <div className="dashboard_detail_s">
                        <h3>Login Details</h3>
                        {loading ? (
                            <div style={{ minHeight: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Loading />
                            </div>
                        ) : (
                            <DataTableBase
                                columns={columns}
                                data={dashboardList}
                                pagination
                                paginationServer={false}
                                paginationPerPage={rowsPerPage}
                                paginationDefaultPage={currentPage}
                                onChangePage={(page) => setCurrentPage(page)}
                                onChangeRowsPerPage={(newPerPage, page) => {
                                    setRowsPerPage(newPerPage);
                                    setCurrentPage(page);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div >
        </>
    )
}

export default DashboardPage