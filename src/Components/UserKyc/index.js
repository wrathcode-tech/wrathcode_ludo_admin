import React, { useEffect, useState } from 'react';
import UserHeader from '../../Layout/UserHeader';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import moment from 'moment';
import DataTableBase from '../../Utils/DataTable';
import { imageUrl } from '../../Api/Api_Config/ApiEndpoints';
import { useNavigate } from 'react-router-dom';

const TEAL_BTN = "linear-gradient(135deg, #0d9488, #0f766e)";

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
        { name: "Sr. No.", cell: (row, index) => <span className="text-secondary fw-medium" style={{ fontSize: "0.875rem" }}>{(currentPage - 1) * rowsPerPage + index + 1}</span>, width: "72px" },
        { name: "Date & Time", cell: (row) => <span style={{ fontSize: "0.875rem" }}>{moment(row.createdAt).format("DD MMM YYYY, hh:mm A")}</span>, sortable: true, wrap: true },
        {
            name: "User Id",
            wrap: true,
            width: "160px",
            cell: (row) => (
                <div className="d-flex align-items-center gap-1">
                    <button type="button" onClick={() => handleUserClick(row?._id)} className="btn btn-link p-0 text-decoration-none border-0" style={{ color: "#0d9488", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>{row?.uuid || "—"}</button>
                    <button type="button" className="btn btn-sm p-1 rounded" style={{ background: "#f1f5f9", color: "#64748b" }} onClick={() => { if (row?.uuid) { navigator?.clipboard?.writeText(row.uuid); alertSuccessMessage("Copied!"); } else alertErrorMessage("No UUID found"); }} title="Copy"><i className="far fa-copy" style={{ fontSize: "0.7rem" }} /></button>
                </div>
            ),
        },
        { name: "User Name", cell: (row) => <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{row?.fullName || "—"}</span>, sortable: true, wrap: true },
        { name: "Mobile", cell: (row) => <span style={{ fontSize: "0.875rem" }}>{row?.mobileNumber || "—"}</span>, sortable: true, wrap: true },
        {
            name: "Document Front",
            width: "120px",
            cell: (row) =>
                row?.kycDetails?.documentFrontImage ? (
                    <a href={imageUrl + row.kycDetails.documentFrontImage} target="_blank" rel="noopener noreferrer" className="d-inline-block">
                        <img src={imageUrl + row.kycDetails.documentFrontImage} alt="Document Front" loading="lazy" className="rounded-3 shadow-sm" style={{ width: "70px", height: "50px", objectFit: "cover", cursor: "pointer" }} />
                    </a>
                ) : <span className="text-muted" style={{ fontSize: "0.875rem" }}>N/A</span>,
            sortable: false,
            wrap: true,
        },
        {
            name: "Document Back",
            width: "120px",
            cell: (row) =>
                row?.kycDetails?.documentBackImage ? (
                    <a href={imageUrl + row.kycDetails.documentBackImage} target="_blank" rel="noopener noreferrer" className="d-inline-block">
                        <img src={imageUrl + row.kycDetails.documentBackImage} alt="Document Back" loading="lazy" className="rounded-3 shadow-sm" style={{ width: "70px", height: "50px", objectFit: "cover", cursor: "pointer" }} />
                    </a>
                ) : <span className="text-muted" style={{ fontSize: "0.875rem" }}>N/A</span>,
            sortable: false,
            wrap: true,
        },
        {
            name: "KYC Status",
            width: "100px",
            cell: (row) => {
                const status = row?.kycVerified || "—";
                const style = status === "APPROVED" ? { background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" } : status === "PENDING" ? { background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff" } : { background: "#dc2626", color: "#fff" };
                return <span className="badge rounded-pill border-0 px-3 py-1" style={{ fontSize: "0.75rem", fontWeight: 600, ...style }}>{status}</span>;
            },
            sortable: true,
            wrap: true,
        },
        {
            name: "Actions",
            width: "200px",
            cell: (row) => (
                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-sm rounded-pill border-0 px-3" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 600 }} onClick={() => handleKycStatus(row._id, "APPROVED")}>Approve</button>
                    <button type="button" className="btn btn-sm rounded-pill border-0 px-3" style={{ background: "#dc2626", color: "#fff", fontWeight: 600 }} onClick={() => handleRejectClick(row._id)}>Reject</button>
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
        { name: "Sr. No.", cell: (row, index) => <span className="text-secondary fw-medium" style={{ fontSize: "0.875rem" }}>{(currentPage - 1) * rowsPerPage + index + 1}</span>, width: "72px" },
        { name: "Date & Time", cell: (row) => <span style={{ fontSize: "0.875rem" }}>{moment(row.createdAt).format("DD MMM YYYY, hh:mm A")}</span>, sortable: true, wrap: true },
        {
            name: "User Id",
            width: "160px",
            cell: (row) => (
                <div className="d-flex align-items-center gap-1">
                    <button type="button" onClick={() => handleUserClick(row?._id)} className="btn btn-link p-0 text-decoration-none border-0" style={{ color: "#0d9488", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>{row?.uuid || "—"}</button>
                    <button type="button" className="btn btn-sm p-1 rounded" style={{ background: "#f1f5f9", color: "#64748b" }} onClick={() => { if (row?.uuid) { navigator?.clipboard?.writeText(row.uuid); alertSuccessMessage("Copied!"); } }} title="Copy"><i className="far fa-copy" style={{ fontSize: "0.7rem" }} /></button>
                </div>
            ),
            sortable: true,
            wrap: true,
        },
        { name: "User Name", cell: (row) => <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{row?.fullName || "—"}</span>, sortable: true, wrap: true },
        { name: "Mobile", cell: (row) => <span style={{ fontSize: "0.875rem" }}>{row?.mobileNumber || "—"}</span>, sortable: true, wrap: true },
        {
            name: "KYC Status",
            width: "100px",
            cell: (row) => <span className="badge rounded-pill border-0 px-3 py-1" style={{ fontSize: "0.75rem", fontWeight: 600, background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" }}>{row?.kycVerified || "APPROVED"}</span>,
            sortable: true,
            wrap: true,
        },
    ];

    const RejectedKycList = [
        { name: "Sr. No.", cell: (row, index) => <span className="text-secondary fw-medium" style={{ fontSize: "0.875rem" }}>{(currentPage - 1) * rowsPerPage + index + 1}</span>, width: "72px" },
        { name: "Date & Time", cell: (row) => <span style={{ fontSize: "0.875rem" }}>{moment(row.createdAt).format("DD MMM YYYY, hh:mm A")}</span>, sortable: true, wrap: true },
        { name: "Updated At", cell: (row) => <span style={{ fontSize: "0.875rem" }}>{moment(row.updatedAt).format("DD MMM YYYY, hh:mm A")}</span>, sortable: true, wrap: true },
        {
            name: "User Id",
            width: "160px",
            cell: (row) => (
                <div className="d-flex align-items-center gap-1">
                    <button type="button" onClick={() => handleUserClick(row?._id)} className="btn btn-link p-0 text-decoration-none border-0" style={{ color: "#0d9488", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>{row?.uuid || "—"}</button>
                    <button type="button" className="btn btn-sm p-1 rounded" style={{ background: "#f1f5f9", color: "#64748b" }} onClick={() => { if (row?.uuid) { navigator?.clipboard?.writeText(row.uuid); alertSuccessMessage("Copied!"); } }} title="Copy"><i className="far fa-copy" style={{ fontSize: "0.7rem" }} /></button>
                </div>
            ),
            sortable: true,
            wrap: true,
        },
        { name: "User Name", cell: (row) => <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{row?.fullName || "—"}</span>, sortable: true, wrap: true },
        { name: "Mobile", cell: (row) => <span style={{ fontSize: "0.875rem" }}>{row?.mobileNumber || "—"}</span>, sortable: true, wrap: true },
        {
            name: "KYC Status",
            width: "100px",
            cell: (row) => <span className="badge rounded-pill border-0 px-3 py-1" style={{ fontSize: "0.75rem", fontWeight: 600, background: "#dc2626", color: "#fff" }}>{row?.kycVerified || "REJECTED"}</span>,
            sortable: true,
            wrap: true,
        },
    ];

    return (
        <div className="dashboard_right">
            <UserHeader />
            <div className="dashboard_outer_s">
                {/* Premium page header */}
                <div className="mb-4">
                    <div className="rounded-4 overflow-hidden border-0 p-4 p-md-5" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)", boxShadow: "0 16px 48px rgba(13,148,136,0.25)" }}>
                        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                            <div>
                                <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>KYC Verification Details</h1>
                                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>Review and approve or reject user KYC submissions</p>
                            </div>
                            <div className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white" style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}><i className="fas fa-id-card fa-lg" /></div>
                        </div>
                    </div>
                </div>

                {/* Tabs - rounded pills */}
                <div className="mb-3">
                    <ul className="nav nav-pills gap-2 flex-wrap">
                        <li className="nav-item">
                            <button type="button" className={`nav-link rounded-pill ${activeTab === "PENDING" ? "active" : ""}`} style={activeTab === "PENDING" ? { background: TEAL_BTN, color: "#fff", border: "none", fontWeight: 600 } : { background: "#f1f5f9", color: "#64748b", border: "none" }} onClick={() => setActiveTab("PENDING")}>Pending</button>
                        </li>
                        <li className="nav-item">
                            <button type="button" className={`nav-link rounded-pill ${activeTab === "APPROVED" ? "active" : ""}`} style={activeTab === "APPROVED" ? { background: TEAL_BTN, color: "#fff", border: "none", fontWeight: 600 } : { background: "#f1f5f9", color: "#64748b", border: "none" }} onClick={() => setActiveTab("APPROVED")}>Approved</button>
                        </li>
                        <li className="nav-item">
                            <button type="button" className={`nav-link rounded-pill ${activeTab === "REJECTED" ? "active" : ""}`} style={activeTab === "REJECTED" ? { background: TEAL_BTN, color: "#fff", border: "none", fontWeight: 600 } : { background: "#f1f5f9", color: "#64748b", border: "none" }} onClick={() => setActiveTab("REJECTED")}>Rejected</button>
                        </li>
                    </ul>
                </div>

                {/* Table card */}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ borderLeft: "4px solid #0d9488" }}>
                    <div className="card-header bg-white border-0 py-3 px-4">
                        <h5 className="mb-0 fw-semibold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                            <span className="rounded-3 d-inline-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff" }}><i className="fas fa-list" /></span>
                            {activeTab === "PENDING" && "Pending KYC List"}
                            {activeTab === "APPROVED" && "Approved KYC List"}
                            {activeTab === "REJECTED" && "Rejected KYC List"}
                        </h5>
                    </div>
                    <div className="card-body p-0">
                        {activeTab === "PENDING" && <DataTableBase columns={PendingKycList} data={kycPendingList || []} pagination />}
                        {activeTab === "APPROVED" && <DataTableBase columns={ApprovedKycList} data={kycApprovedList || []} pagination />}
                        {activeTab === "REJECTED" && <DataTableBase columns={RejectedKycList} data={kycRejectedList || []} pagination />}
                    </div>
                </div>
            </div>

            {/* Reject Reason Modal - premium */}
            {showModal && (
                <div className="custom-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="custom-modal rounded-4 overflow-hidden border-0 shadow-lg" style={{ maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="border-0 py-3 px-4 text-white" style={{ background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" }}>
                            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2"><i className="fas fa-times-circle" /> Reject KYC</h5>
                        </div>
                        <div className="p-4">
                            <label className="form-label fw-semibold small text-secondary">Reason for rejection (optional)</label>
                            <textarea rows="4" className="form-control rounded-3 border" placeholder="Enter reason for rejection..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn rounded-pill px-4" style={{ background: "#64748b", color: "#fff" }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="button" className="btn rounded-pill px-4 border-0 text-white fw-semibold" style={{ background: "#dc2626" }} onClick={() => handleKycStatus(selectedUserId, "REJECTED", rejectReason)}>Submit Rejection</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1050;
                }
                .custom-modal { background: #fff; width: 90%; }
            `}</style>
        </div>
    );
}

export default UserKyc;
