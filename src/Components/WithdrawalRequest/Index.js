import React, { useEffect, useState } from "react";
import UserHeader from "../../Layout/UserHeader";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../Utils/CustomAlertMessage";
import moment from "moment";
import DataTableBase from "../../Utils/DataTable";
import { useNavigate } from "react-router-dom";

const TEAL_ACCENT = "#0d9488";
const TEAL_BTN = "linear-gradient(135deg, #0d9488, #0f766e)";

function WithdrawalRequest() {
  const [activeTab, setActiveTab] = useState("PENDING");
  const [withdrawalRequestData, setWithdrawalRequestData] = useState([]);
  const [withdrawalApprovedList, setWithdrawalApprovedList] = useState([]);
  const [withdrawalRejectedList, setWithdrawalRejectedList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  const handlePendingWithdrawalList = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.pendingWithdrawalRequest();
      if (result?.success) {
        const data = result?.data || [];
        setWithdrawalRequestData(data.length ? data.reverse() : []);
      } else {
        setWithdrawalRequestData([]);
      }
    } catch (error) {
      alertErrorMessage(error?.message);
      setWithdrawalRequestData([]);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleApprovedList = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.approvedWithdrawalRequest();
      if (result?.success) setWithdrawalApprovedList(result?.data?.reverse() || []);
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
      if (result?.success) setWithdrawalRejectedList(result?.data?.reverse() || []);
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleStatus = async (userId, status, transactionId) => {
    const reason = status === "REJECTED" ? "Rejected by Admin" : "";
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.updateWithdrawalStatus(userId, status, transactionId, reason);
      if (result?.success) {
        alertSuccessMessage(`Withdrawal ${status} successfully`);
        window.dispatchEvent(new CustomEvent("refreshSidebarCounts"));
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
    handlePendingWithdrawalList();
  }, []);

  useEffect(() => {
    if (activeTab === "APPROVED" && withdrawalApprovedList?.length === 0) handleApprovedList();
    if (activeTab === "REJECTED" && withdrawalRejectedList?.length === 0) handleRejectedList();
  }, [activeTab]);

  const handleUserClick = (userId) => {
    navigate("/dashboard/UserDetails", { state: { userId } });
  };

  const handleView = (row) => {
    setSelectedUser(row);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const userIdCell = (row) => (
    <div className="d-flex align-items-center gap-2">
      <button
        type="button"
        onClick={() => handleUserClick(row?.userId?.id || row?.userId?._id)}
        className="btn btn-link p-0 text-decoration-none fw-semibold"
        style={{ color: TEAL_ACCENT, cursor: "pointer" }}
      >
        {row?.userId?.uuid || "—"}
      </button>
      <button
        type="button"
        className="btn btn-link p-0 text-secondary"
        style={{ cursor: "pointer" }}
        onClick={() => {
          const uuid = row?.userId?.uuid;
          if (uuid) {
            navigator?.clipboard?.writeText(uuid);
            alertSuccessMessage("UUID copied!");
          } else alertErrorMessage("No UUID found");
        }}
        title="Copy UUID"
      >
        <i className="far fa-copy" />
      </button>
    </div>
  );

  const statusBadge = (status, type) => {
    const isPending = status === "PENDING";
    const isApproved = status === "APPROVED";
    const isRejected = status === "REJECTED";
    return (
      <span
        className="badge rounded-pill border-0"
        style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          ...(isPending && { background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff" }),
          ...(isApproved && { background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" }),
          ...(isRejected && { background: "#dc2626", color: "#fff" }),
          ...(!isPending && !isApproved && !isRejected && { background: "#f1f5f9", color: "#64748b" }),
        }}
      >
        {status || "—"}
      </span>
    );
  };

  const withdrawalRequestColumns = [
    { name: "Sr. No.", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
    { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
    { name: "User Id", width: "160px", cell: userIdCell },
    { name: "Name", selector: (row) => row?.userId?.name ?? "—", sortable: true, wrap: true },
    { name: "Full Name", selector: (row) => row?.userId?.fullName ?? "—", sortable: true, wrap: true },
    { name: "Amount", selector: (row) => `₹ ${row?.amount ?? 0}`, sortable: true, wrap: true },
    { name: "Transaction Type", selector: (row) => row?.transactionType ?? "—", sortable: true, wrap: true },
    { name: "Status", width: "100px", cell: (row) => statusBadge(row?.status), sortable: true },
    {
      name: "Actions",
      width: "240px",
      cell: (row) => (
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-sm rounded-pill border-0 px-3"
            style={{ background: TEAL_BTN, color: "#fff", fontWeight: 600, fontSize: "0.75rem" }}
            onClick={() => handleView(row)}
          >
            View
          </button>
          <button
            type="button"
            className="btn btn-sm rounded-pill border-0 px-3"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 600, fontSize: "0.75rem" }}
            onClick={() => handleStatus(row.userId?._id, "APPROVED", row?._id)}
          >
            Approve
          </button>
          <button
            type="button"
            className="btn btn-sm rounded-pill border-0 px-3"
            style={{ background: "#dc2626", color: "#fff", fontWeight: 600, fontSize: "0.75rem" }}
            onClick={() => handleStatus(row.userId?._id, "REJECTED", row?._id)}
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

  const approvedColumns = [
    { name: "Sr. No.", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
    { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
    { name: "User Id", width: "160px", cell: userIdCell },
    { name: "Name", selector: (row) => row?.userId?.name ?? "—", sortable: true, wrap: true },
    { name: "Full Name", selector: (row) => row?.userId?.fullName ?? "—", sortable: true, wrap: true },
    { name: "Amount", selector: (row) => `₹ ${row?.amount ?? 0}`, sortable: true, wrap: true },
    { name: "Transaction Type", selector: (row) => row?.transactionType ?? "—", sortable: true, wrap: true },
    { name: "Description", selector: (row) => row?.description ?? "—", sortable: true, wrap: true },
    { name: "Status", width: "100px", cell: (row) => statusBadge(row?.status), sortable: true },
  ];

  const rejectedColumns = [
    { name: "Sr. No.", cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, width: "80px" },
    { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
    { name: "User Id", width: "160px", cell: userIdCell },
    { name: "Name", selector: (row) => row?.userId?.name ?? "—", sortable: true, wrap: true },
    { name: "Fista Username", selector: (row) => row?.userId?.fullName ?? "—", sortable: true, wrap: true },
    { name: "Amount", selector: (row) => `₹ ${row?.amount ?? 0}`, sortable: true, wrap: true },
    { name: "Transaction Type", selector: (row) => row?.transactionType ?? "—", sortable: true, wrap: true },
    { name: "Description", selector: (row) => row?.description ?? "—", sortable: true, wrap: true },
    { name: "Status", width: "100px", cell: (row) => statusBadge(row?.status), sortable: true },
  ];

  const tabs = [
    { id: "PENDING", label: "Pending", icon: "fa-clock" },
    { id: "APPROVED", label: "Approved", icon: "fa-check-circle" },
    { id: "REJECTED", label: "Rejected", icon: "fa-times-circle" },
  ];

  return (
    <div className="dashboard_right">
      <UserHeader />
      <div className="dashboard_outer_s">
        <div className="mb-4">
          <div
            className="rounded-4 overflow-hidden border-0 p-4 p-md-5"
            style={{
              background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)",
              boxShadow: "0 16px 48px rgba(13,148,136,0.25)",
            }}
          >
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div>
                <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
                  Withdrawal Requests
                </h1>
                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>
                  Manage pending, approved and rejected withdrawals
                </p>
              </div>
              <div
                className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white"
                style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}
              >
                <i className="fas fa-arrow-up fa-lg" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="card border-0 rounded-4 overflow-hidden"
          style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #0891b2" }}
        >
          <div
            className="card-header border-0 py-3 px-4"
            style={{ background: "linear-gradient(90deg, rgba(8,145,178,0.08) 0%, transparent 100%)" }}
          >
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 flex-wrap">
              <h3 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                <span
                  className="rounded-3 d-inline-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #0891b2, #0e7490)", color: "#fff" }}
                >
                  <i className="fas fa-university" />
                </span>
                {activeTab === "PENDING" && "Pending Withdrawals"}
                {activeTab === "APPROVED" && "Approved Withdrawals"}
                {activeTab === "REJECTED" && "Rejected Withdrawals"}
              </h3>
              <ul className="nav nav-pills gap-2 mb-0">
                {tabs.map((tab) => (
                  <li key={tab.id} className="nav-item">
                    <button
                      type="button"
                      className={`nav-link rounded-pill d-inline-flex align-items-center gap-2 ${activeTab === tab.id ? "active" : ""}`}
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        padding: "0.4rem 1rem",
                        ...(activeTab === tab.id
                          ? { background: TEAL_BTN, color: "#fff", border: "none" }
                          : { background: "#f1f5f9", color: "#64748b", border: "none" }),
                      }}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <i className={`fas ${tab.icon}`} /> {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="p-4">
              {activeTab === "PENDING" && (
                <DataTableBase
                  columns={withdrawalRequestColumns}
                  data={withdrawalRequestData || []}
                  pagination
                  onChangePage={(page) => setCurrentPage(page)}
                />
              )}
              {activeTab === "APPROVED" && (
                <DataTableBase
                  columns={approvedColumns}
                  data={withdrawalApprovedList || []}
                  pagination
                  onChangePage={(page) => setCurrentPage(page)}
                />
              )}
              {activeTab === "REJECTED" && (
                <DataTableBase
                  columns={rejectedColumns}
                  data={withdrawalRejectedList || []}
                  pagination
                  onChangePage={(page) => setCurrentPage(page)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View modal - premium */}
      {showModal && (
        <div
          className="d-flex align-items-center justify-content-center p-3"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={handleClose}
          role="presentation"
        >
          <div
            className="rounded-4 overflow-hidden border-0 bg-white"
            style={{ width: "95%", maxWidth: "520px", maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="border-0 py-4 px-4 text-white"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}
            >
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                <i className="fas fa-user" /> User & Withdrawal Details
              </h5>
            </div>
            <div className="p-4">
              {selectedUser ? (
                <div className="userdetails_list">
                  <p className="mb-2"><strong>Name:</strong> <span>{selectedUser?.userId?.fullName ?? "—"}</span></p>
                  <p className="mb-2"><strong>UUID:</strong> <span>{selectedUser?.userId?.uuid ?? "—"}</span></p>
                  <hr />
                  <h6 className="text-center mb-3">Withdrawal Details</h6>
                  <p className="mb-2"><strong>Amount:</strong> <span>₹ {selectedUser?.amount ?? 0}</span></p>
                  <p className="mb-2"><strong>Transaction Type:</strong> <span>{selectedUser?.transactionType ?? "—"}</span></p>
                  <p className="mb-2"><strong>Status:</strong> <span>{selectedUser?.status ?? "—"}</span></p>
                  <p className="mb-2"><strong>Withdrawal Method:</strong> <span>{selectedUser?.withdrawalMethod ?? "—"}</span></p>

                  {selectedUser?.bankAndUpi && (
                    <>
                      <hr />
                      <h6 className="text-center mb-3">Bank / UPI Details</h6>
                      {[
                        { label: "UPI ID", value: selectedUser?.bankAndUpi?.upiId },
                        { label: "UPI Name", value: selectedUser?.bankAndUpi?.upiName },
                        { label: "Account Number", value: selectedUser?.bankAndUpi?.accountNumber },
                        { label: "Bank Name", value: selectedUser?.bankAndUpi?.bankName },
                        { label: "IFSC Code", value: selectedUser?.bankAndUpi?.ifscCode },
                      ]
                        .filter((item) => item.value)
                        .map((item, index) => (
                          <p key={index} className="d-flex align-items-center justify-content-between mb-2">
                            <span><strong>{item.label}:</strong> {item.value}</span>
                            <button
                              type="button"
                              className="btn btn-link p-0"
                              style={{ color: TEAL_ACCENT }}
                              onClick={() => {
                                navigator.clipboard.writeText(item.value);
                                alertSuccessMessage(`${item.label} copied!`);
                              }}
                            >
                              <i className="fas fa-copy" />
                            </button>
                          </p>
                        ))}
                    </>
                  )}
                </div>
              ) : (
                <p className="text-muted">Loading...</p>
              )}
              <div className="mt-4 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn rounded-pill px-4"
                  style={{ background: "#64748b", color: "#fff" }}
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WithdrawalRequest;
