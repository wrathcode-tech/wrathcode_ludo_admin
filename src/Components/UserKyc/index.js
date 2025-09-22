import React, { useEffect, useState } from 'react';
import UserHeader from '../../Layout/UserHeader';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import moment from 'moment';
import DataTable from 'react-data-table-component';

function UserKyc() {
    const [kycPendingList, setKycPendingList] = useState([]);
    const [activeTab, setActiveTab] = useState("PENDING");
    const [kycApprovedList, setKycApprovedList] = useState([]);
    const [kycRejectedList, setKycRejectedList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const handlePendingList = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.getpendingKycList();
            if (result?.success) {
                setKycPendingList(result?.data?.reverse());
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
        handlePendingList();
    }, []);

    const handleApprovedList = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.getapprovedKycList();
            if (result?.success) {
                setKycApprovedList(result?.data?.reverse());
            } else {
                alertErrorMessage(result?.message);
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
            const result = await AuthService.getrejectedKycList();
            if (result?.success) {
                setKycRejectedList(result?.data?.reverse());
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleKycStatus = async (userId, status) => {
        try {
            LoaderHelper.loaderStatus(true);
            const reason = status === "REJECTED" ? "Rejected by Admin" : ""; // 👈 custom reason dal sakte ho
            const result = await AuthService.updateKycStatus(userId, status, reason);
            if (result?.success) {
                alertSuccessMessage(`KYC ${status} successfully`);
                // ✅ Refresh Pending List
                handlePendingList();
                // ✅ Refresh respective list
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
        if (activeTab === "APPROVED" && kycApprovedList.length === 0) {
            handleApprovedList();
        }
        if (activeTab === "REJECTED" && kycRejectedList.length === 0) {
            handleRejectedList();
        }
    }, [activeTab]);

    // ---------------- Columns ----------------
    const PendingKycList = [
        { name: "SR No", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
        { name: "Full Name", selector: (row) => row?.fullName, sortable: true, wrap: true },
        { name: "Email", selector: (row) => row?.emailId, sortable: true, wrap: true },
        // {
        //     name: "Mobile",
        //     selector: (row) => row?.countryCode && row?.mobileNumber
        //         ? `${row.countryCode} ${row.mobileNumber}`
        //         : "N/A",
        //     sortable: true, wrap: true
        // },
        { name: "UUID", selector: (row) => row?.uuid, sortable: true, wrap: true },
        {
            name: "KYC Status",
            cell: (row) => (
                <span style={{
                    color: row.kycVerified === "APPROVED"
                        ? "green"
                        : row.kycVerified === "PENDING"
                            ? "orange"
                            : "red",
                    fontWeight: "600",
                }}>
                    {row?.kycVerified}
                </span>
            ),
            sortable: true, wrap: true,
        },
        { name: "Status", selector: (row) => row?.status, sortable: true, wrap: true },
        { name: "Created At", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        // { name: "Updated At", selector: (row) => moment(row.updatedAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },

        // ✅ Action Buttons
        {
            name: "Actions", width: "200px",
            cell: (row) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleKycStatus(row._id, "APPROVED")}
                    >
                        Approve
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleKycStatus(row._id, "REJECTED")}
                    >
                        Reject
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const ApprovedKycList = [
        { name: "SR No", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
        { name: "Full Name", selector: (row) => row?.fullName, sortable: true, wrap: true },
        { name: "Email", width: "200px", selector: (row) => row?.emailId, sortable: true, wrap: true },
        {
            name: "KYC Status",
            cell: (row) => (
                <span style={{
                    color: "green",
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

    const RejectedKycList = [
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
                <h2>Kyc Verification Details</h2>
                <div className="dashboard_detail_s user_list_table user_summary_t">
                    <div className="user_list_top">
                        <div className="user_list_l">
                            <h4 className="text-xl font-semibold mb-4">
                                Users List{" "}
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
                                <DataTable
                                    columns={PendingKycList}
                                    data={kycPendingList}
                                    pagination
                                    highlightOnHover
                                    striped
                                    responsive
                                    paginationPerPage={rowsPerPage}
                                    paginationRowsPerPageOptions={[rowsPerPage]}
                                    onChangePage={(page) => setCurrentPage(page)}
                                    noDataComponent="No pending records found"
                                />
                            )}

                            {activeTab === "APPROVED" && (
                                <DataTable
                                    columns={ApprovedKycList}
                                    data={kycApprovedList}
                                    pagination
                                    highlightOnHover
                                    striped
                                    responsive
                                    paginationPerPage={rowsPerPage}
                                    paginationRowsPerPageOptions={[rowsPerPage]}
                                    onChangePage={(page) => setCurrentPage(page)}
                                    noDataComponent="No approved records found"
                                />
                            )}

                            {activeTab === "REJECTED" && (
                                <DataTable
                                    columns={RejectedKycList}
                                    data={kycRejectedList}
                                    pagination
                                    highlightOnHover
                                    striped
                                    responsive
                                    paginationPerPage={rowsPerPage}
                                    paginationRowsPerPageOptions={[rowsPerPage]}
                                    onChangePage={(page) => setCurrentPage(page)}
                                    noDataComponent="No rejected records found"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserKyc;
