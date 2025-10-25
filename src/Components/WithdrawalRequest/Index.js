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
                const data = result?.data || [];

                if (data.length === 0) {
                    // ✅ No pending withdrawals, clear the list
                    setWithdrawalRequestData([]);
                } else {
                    // Reverse to show latest first
                    setWithdrawalRequestData(data.reverse());
                }
            } else {
                // Optional: clear list on error
                setWithdrawalRequestData([]);
                // alertErrorMessage(result?.message);
            }

        } catch (error) {
            alertErrorMessage(error?.message);
            setWithdrawalRequestData([]); // clear list on catch
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

    const handleStatus = async (userId, status, transactionId, reason) => {
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
        { name: "Sr. No.", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
        { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        { name: "UUID", selector: (row) => row?.userId?.uuid, sortable: true, wrap: true },
        { name: "Full Name", selector: (row) => row?.userId?.fullName, sortable: true, wrap: true },
        { name: "Amount", selector: (row) => row?.amount, sortable: true, wrap: true },
        { name: "Transaction Type", selector: (row) => row?.transactionType, sortable: true, wrap: true },
        // { name: "Description", selector: (row) => row?.description, sortable: true, wrap: true },
        {
            name: "Status", selector: (row) => row?.status, cell: (row) => (
                <span style={{ color: "orange", fontWeight: "500" }}>
                    {row?.status || "—"}
                </span>
            ), sortable: true, wrap: true
        },
        {
            name: "Actions",
            width: "250px",
            cell: (row) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleView(row)}
                    >
                        View
                    </button>

                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatus(row.userId?._id, "APPROVED", row?._id)}
                    >
                        Approve
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatus(row.userId?._id, "REJECTED", row?._id)}
                    >
                        Reject
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }


    ];
    const approvedWithdrawalList = [
        { name: "Sr. No.", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
        { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        { name: "UUID", selector: (row) => row?.userId?.uuid, sortable: true, wrap: true },
        { name: "Full Name", selector: (row) => row?.userId?.fullName, sortable: true, wrap: true },
        { name: "Amount", selector: (row) => `₹ ${(row?.amount) || 0}`, sortable: true, wrap: true },
        { name: "Transaction Type", selector: (row) => row?.transactionType, sortable: true, wrap: true },
        { name: "Description", selector: (row) => row?.description || "------", sortable: true, wrap: true },
        {
            name: "Status", selector: (row) => row?.status, cell: (row) => (
                <span style={{ color: "green", fontWeight: "500" }}>
                    {row?.status || "—"}
                </span>
            ), sortable: true, wrap: true
        },
    ];

    const rejectedWithdrawalList = [
        { name: "Sr. No.", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
        { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        { name: "UUID", selector: (row) => row?.userId?.uuid, sortable: true, wrap: true },
        { name: "Full Name", selector: (row) => row?.userId?.fullName, sortable: true, wrap: true },
        { name: "Amount", selector: (row) => `₹ ${(row?.amount) || 0}`, sortable: true, wrap: true },
        { name: "Transaction Type", selector: (row) => row?.transactionType, sortable: true, wrap: true },
        { name: "Description", selector: (row) => row?.description || "------", sortable: true, wrap: true },
        {
            name: "Status", selector: (row) => row?.status, cell: (row) => (
                <span style={{ color: "red", fontWeight: "500" }}>
                    {row?.status || "—"}
                </span>
            ), sortable: true, wrap: true
        },


        // {
        //     name: "Mobile",
        //     selector: (row) => row?.countryCode && row?.mobileNumber
        //         ? `${row.countryCode} ${row.mobileNumber}`
        //         : "N/A",
        //     sortable: true, wrap: true
        // },
        // {
        //     name: "KYC Status",
        //     cell: (row) => (
        //         <span style={{
        //             color: "red",
        //             fontWeight: "600",
        //         }}>
        //             {row?.kycVerified}
        //         </span>
        //     ),
        //     sortable: true, wrap: true,
        // },
    ];

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);


    const handleView = (row) => {
        setSelectedUser(row); // store the full withdrawal object
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedUser(null);
    };


    return (
        <div className="dashboard_right">
            <UserHeader />
            <div className="dashboard_outer_s">
                <h2>Withdrawal Request Details</h2>
                <div className="dashboard_detail_s user_list_table user_summary_t">
                    <div className="user_list_top">
                        <div className="user_list_l">
                            <h4 className="text-xl font-semibold mb-4">
                                {/* Withdrawal Request List{" "} */}
                                {activeTab === "PENDING" && <span >Pending Withdrawal Request List</span>}
                                {activeTab === "APPROVED" && <span>Approved Withdrawal Request List</span>}
                                {activeTab === "REJECTED" && <span>Rejected Withdrawal Request List</span>}
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
                                <DataTableBase columns={withdrawalRequest} data={withdrawalRequestData || []} pagination />


                            )}

                            {activeTab === "APPROVED" && (
                                <DataTableBase columns={approvedWithdrawalList} data={withdrawalApprovedList || []} pagination />

                            )}

                            {activeTab === "REJECTED" && (
                                <DataTableBase columns={rejectedWithdrawalList} data={withdrawalRejectedList || []} pagination />

                            )}
                        </div>
                    </div>
                    {/* Bootstrap 5 Modal */}
                    <div
                        className={`modal fade ${showModal ? "show d-block" : ""}`}
                        id="viewUserModal"
                        tabIndex="-1"
                        aria-labelledby="viewUserModalLabel"
                        aria-hidden={!showModal}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="viewUserModalLabel">User Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleClose}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {selectedUser ? (
                                        <div>
                                            <p><strong>Name:</strong> {selectedUser.userId?.fullName}</p>
                                            <p><strong>UUID:</strong> {selectedUser.userId?.uuid}</p>
                                            <p><strong>Email:</strong> {selectedUser.userId?.email || "N/A"}</p>
                                            <p><strong>Phone:</strong> {selectedUser.userId?.phone || "N/A"}</p>
                                            <hr />
                                            <h6>Withdrawal Details:</h6>
                                            <p><strong>Amount:</strong> ₹ {selectedUser.amount}</p>
                                            <p><strong>Transaction Type:</strong> {selectedUser.transactionType}</p>
                                            <p><strong>Status:</strong> {selectedUser.status}</p>
                                            <p><strong>Withdrawal Method:</strong> {selectedUser.withdrawalMethod || "—"}</p>
                                            {selectedUser.bankAndUpi && (
                                                <>
                                                    <hr />
                                                    <h6>Bank / UPI Details:</h6>
                                                    {selectedUser.bankAndUpi.upiId && (
                                                        <p><strong>UPI ID:</strong> {selectedUser.bankAndUpi.upiId}</p>
                                                    )}
                                                    {selectedUser.bankAndUpi.upiName && (
                                                        <p><strong>UPI Name:</strong> {selectedUser.bankAndUpi.upiName}</p>
                                                    )}
                                                    {selectedUser.bankAndUpi.accountNumber && (
                                                        <p><strong>Account Number:</strong> {selectedUser.bankAndUpi.accountNumber}</p>
                                                    )}
                                                    {selectedUser.bankAndUpi.bankName && (
                                                        <p><strong>Bank Name:</strong> {selectedUser.bankAndUpi.bankName}</p>
                                                    )}
                                                    {selectedUser.bankAndUpi.ifscCode && (
                                                        <p><strong>IFSC Code:</strong> {selectedUser.bankAndUpi.ifscCode}</p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WithdrawalRequest;
