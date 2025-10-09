import React, { useEffect, useState } from 'react';
import UserHeader from '../../Layout/UserHeader';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import moment from 'moment';
import DataTableBase from '../../Utils/DataTable';

function WithdrawalRequest() {
    const [activeTab, setActiveTab] = useState("PENDING");
    const [withdrawalRequestData, setWithdrawalRequestData] = useState([]);
    const [withdrawalApprovedList, setWithdrawalApprovedList] = useState([]);
    const [withdrawalRejectedList, setWithdrawalRejectedList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    useEffect(() => {
        handlePendingWithdrawalList();
    }, []);
    const handlePendingWithdrawalList = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.pendingWithdrawalRequest();
            if (result?.success) {
                setWithdrawalRequestData(result?.data?.reverse());
            } else {
                // alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };



    const handleApprovedList = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.approvedWithdrawalRequest();
            if (result?.success) {
                setWithdrawalApprovedList(result?.data?.reverse());
            } else {
                // alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleRejectedList = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.cancelWithdrawalRequest();
            if (result?.success) {
                setWithdrawalRejectedList(result?.data?.reverse());
            } else {
                // alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleStatus = async (userId, status, transactionId) => {
        try {
            LoaderHelper.loaderStatus(true);
            const reason = status === "REJECTED" ? "Rejected by Admin" : "";
            const result = await AuthService.updateWithdrawalStatus(userId, status, transactionId, reason);
            if (result?.success) {
                alertSuccessMessage(`KYC ${status} successfully`);
                handlePendingWithdrawalList();
                if (status === "APPROVED") handleApprovedList();
                if (status === "REJECTED") handleRejectedList();
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    useEffect(() => {
        if (activeTab === "APPROVED" && withdrawalApprovedList?.length === 0) {
            handleApprovedList();
        }
        if (activeTab === "REJECTED" && withdrawalRejectedList?.length === 0) {
            handleRejectedList();
        }
    }, [activeTab]);

    // ---------------- Columns ----------------
    const withdrawalRequest = [
        { name: "SR No", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
        { name: "Full Name", selector: (row) => row?.userId?.fullName, sortable: true, wrap: true },
        { name: "Created At", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        { name: "Amount", selector: (row) => row?.amount, sortable: true, wrap: true },
        { name: "Status", selector: (row) => row?.status, sortable: true, wrap: true },
        { name: "Description", selector: (row) => row?.description, sortable: true, wrap: true },
        {
            name: "Actions", width: "200px",
            cell: (row) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatus(row?.userId?._id, "APPROVED", row?._id)}
                    >
                        Approve
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatus(row.userId?._id, "REJECTED", row?._id)}
                    >
                        Reject
                    </button>
                </div >
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const approvedWithdrawalList = [
        { name: "Sr. No.", center: true, wrap: true, selector: (row, index) => currentPage + 1 + index, },
        { name: "Created At", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        { name: "Transaction Type", selector: (row) => row?.transactionType, sortable: true, wrap: true },
        { name: "Amount", selector: (row) => row?.amount, sortable: true, wrap: true },
        { name: "Description", selector: (row) => row?.description || "------", sortable: true, wrap: true },
        { name: "Status", selector: (row) => row?.status, sortable: true, wrap: true },
    ];

    const rejectedWithdrawalList = [
        { name: "SR No", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
        { name: "Full Name", selector: (row) => row?.fullName, sortable: true, wrap: true },
        { name: "Email", selector: (row) => row?.emailId, sortable: true, wrap: true },
        {
            name: "Mobile",
            selector: (row) => row?.countryCode && row?.mobileNumber
                ? `${row.countryCode} ${row.mobileNumber}`
                : "N/A",
            sortable: true, wrap: true
        },
        { name: "UUID", selector: (row) => row?.uuid, sortable: true, wrap: true },
        {
            name: "KYC Status",
            cell: (row) => (
                <span style={{
                    color: "red",
                    fontWeight: "600",
                }}>
                    {row?.kycVerified}
                </span>
            ),
            sortable: true, wrap: true,
        },
        { name: "Status", selector: (row) => row?.status, sortable: true, wrap: true },
        { name: "Created At", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        { name: "Updated At", selector: (row) => moment(row.updatedAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
    ];

    return (
        <div className="dashboard_right">
            <UserHeader />
            <div className="dashboard_outer_s">
                <h2>Withdrawal Request Details</h2>
                <div className="dashboard_detail_s user_list_table user_summary_t">
                    <div className="user_list_top">
                        <div className="user_list_l">
                            <h4 className="text-xl font-semibold mb-4">
                                Withdrawal Request List{" "}
                                {activeTab === "PENDING" && <span style={{ color: "orange" }}>(Pending)</span>}
                                {activeTab === "APPROVED" && <span style={{ color: "green" }}>(Approved)</span>}
                                {activeTab === "REJECTED" && <span style={{ color: "red" }}>(Rejected)</span>}
                            </h4>
                        </div>
                    </div>
                    <div className="dashboard_summary">
                        <ul className="nav nav-tabs" role="tablist">
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === "PENDING" ? "active" : ""}`} onClick={() => setActiveTab("PENDING")}>
                                    Pending
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === "APPROVED" ? "active" : ""}`} onClick={() => setActiveTab("APPROVED")}>
                                    Approved
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === "REJECTED" ? "active" : ""}`} onClick={() => setActiveTab("REJECTED")}>
                                    Rejected
                                </button>
                            </li>
                        </ul>

                        <div className="p-4">
                            {activeTab === "PENDING" && (
                                <div className='table-responsive'>
                                    <DataTableBase columns={withdrawalRequest} data={withdrawalRequestData || []} pagination />

                                </div>
                            )}

                            {activeTab === "APPROVED" && (
                                <div className='table-responsive'>
                                    <DataTableBase columns={approvedWithdrawalList} data={withdrawalApprovedList || []} pagination />
                                </div>
                            )}

                            {activeTab === "REJECTED" && (
                                <div className='table-responsive'>
                                    <DataTableBase columns={rejectedWithdrawalList} data={withdrawalRejectedList || []} pagination />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WithdrawalRequest;
