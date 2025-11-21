import React, { useEffect, useState } from 'react';
import UserHeader from '../../Layout/UserHeader';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import moment from 'moment';
import DataTableBase from '../../Utils/DataTable';
import { imageUrl } from '../../Api/Api_Config/ApiEndpoints';
import { useNavigate } from 'react-router-dom';

function UserKyc() {
    const [kycPendingList, setKycPendingList] = useState([]);
    const [activeTab, setActiveTab] = useState("PENDING");
    const [kycApprovedList, setKycApprovedList] = useState([]);
    const [kycRejectedList, setKycRejectedList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // ✅ Reject Modal States
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");


    const handlePendingList = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.getpendingKycList();
            if (result?.success) {
                setKycPendingList(result?.data?.reverse());
            }
        } catch (error) {
            // alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    useEffect(() => {
        handlePendingList();
    }, []);

    const handleApprovedList = async (userId) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.getapprovedKycList(userId);
            if (result?.success) {
                // alertSuccessMessage(result?.message);

                // Remove the approved user from the pending list
                setKycPendingList(prev => prev.filter(user => user._id !== userId));
            } else {
                // alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };


    const handleRejectedList = async (userId) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.getrejectedKycList(userId);
            if (result?.success) {
                alertSuccessMessage("KYC Rejected Successfully");

                // Remove the rejected user from the pending list
                setKycPendingList(prev => prev.filter(user => user._id !== userId));
            } else {
                // alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleKycStatus = async (userId, status, reason = "") => {
        try {
            LoaderHelper.loaderStatus(true);
            const finalReason = status === "REJECTED" ? reason : "";
            const result = await AuthService.updateKycStatus(userId, status, finalReason);

            if (result?.success) {
                alertSuccessMessage(`KYC ${status} successfully`);

                // ✅ Clear table immediately (instant update)
                setKycPendingList([]);

                // ✅ Optionally re-fetch updated list
                setTimeout(() => {
                    handlePendingList();
                }, 500);
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
            setShowModal(false);
            setRejectReason("");
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

    const navigate = useNavigate();
    const handleUserClick = (userId) => {
        navigate(`/dashboard/UserDetails`, { state: { userId } });
    };

    // ---------------- Columns ----------------
    const PendingKycList = [
        { name: "Sr. No.", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
        { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        {
            name: "User Id",
            wrap: true,
            width: "160px",
            selector: (row) => (
                <div className="d-flex align-items-center ">
                    <button
                        onClick={() => handleUserClick(row?._id)}
                        className="btn p-0 text-primary"
                        style={{ cursor: "pointer" }}
                    >
                        {row?.uuid || "------"}
                    </button>
                    <div className="mx-2 " style={{ cursor: "pointer" }}
                        onClick={() => {
                            if (row?.uuid) {
                                navigator?.clipboard?.writeText(row?.uuid);
                                alertSuccessMessage("UUID copied!");
                            } else {
                                alertErrorMessage("No UUID found");
                            }
                        }}
                    >
                        <i className="far fa-copy" aria-hidden="true"></i>
                    </div>
                </div>
            ),
        },
        { name: "User Name", selector: (row) => row?.fullName, sortable: true, wrap: true },
        { name: "Mobile Number", selector: (row) => row?.mobileNumber, sortable: true, wrap: true },
        {
            name: "Document Front Img",
            cell: (row) =>
                row?.kycDetails?.documentFrontImage ? (
                    <a
                        href={imageUrl + row?.kycDetails?.documentFrontImage}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={imageUrl + row?.kycDetails?.documentFrontImage}
                            alt="Document Front" loading="lazy"
                            style={{
                                width: "70px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        />
                    </a>
                ) : (
                    "N/A"
                ),
            sortable: false,
            wrap: true,
        },
        {
            name: "Document Back Img",
            cell: (row) =>
                row?.kycDetails?.documentBackImage ? (
                    <a
                        href={imageUrl + row?.kycDetails?.documentBackImage}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={imageUrl + row?.kycDetails?.documentBackImage}
                            alt="Document Back" loading="lazy"
                            style={{
                                width: "70px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        />
                    </a>
                ) : (
                    "N/A"
                ),
            sortable: false,
            wrap: true,
        },


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

        // ✅ Action Buttons
        {
            name: "Actions",
            width: "200px",
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
                        onClick={() => handleRejectClick(row._id)}
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

    const handleRejectClick = (userId) => {
        setSelectedUserId(userId);
        setShowModal(true);
    };

    const ApprovedKycList = [
        { name: "Sr. No.", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
        { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        { name: "UUID", selector: (row) => row?.uuid, sortable: true, wrap: true },
        { name: "User Name", selector: (row) => row?.fullName, sortable: true, wrap: true },
        { name: "Mobile Number", selector: (row) => row?.mobileNumber, sortable: true, wrap: true },
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
    ];

    const RejectedKycList = [
        { name: "Sr. No.", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
        { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        { name: "Updated At", selector: (row) => moment(row.updatedAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        { name: "UUID", selector: (row) => row?.uuid, sortable: true, wrap: true },
        { name: "User Name", selector: (row) => row?.fullName, sortable: true, wrap: true },
        { name: "Mobile Number", selector: (row) => row?.mobileNumber, sortable: true, wrap: true },
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
                                {activeTab === "PENDING" && <span>Pending Kyc List</span>}
                                {activeTab === "APPROVED" && <span >Approved Kyc List</span>}
                                {activeTab === "REJECTED" && <span >Rejected Kyc List</span>}
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
                                <DataTableBase columns={PendingKycList} data={kycPendingList || []} pagination />
                            )}

                            {activeTab === "APPROVED" && (
                                <DataTableBase columns={ApprovedKycList} data={kycApprovedList || []} pagination />
                            )}

                            {activeTab === "REJECTED" && (
                                <DataTableBase columns={RejectedKycList} data={kycRejectedList || []} pagination />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Reject Reason Modal */}
            {showModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <h4>Reject KYC</h4>
                        <textarea
                            rows="4"
                            className="form-control"
                            placeholder="Enter reason for rejection"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div style={{ marginTop: "15px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleKycStatus(selectedUserId, "REJECTED", rejectReason)}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Inline CSS for modal */}
            <style>{`
                .custom-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .custom-modal {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    width: 400px;
                    max-width: 90%;
                }
                .form-control {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
}

export default UserKyc;
