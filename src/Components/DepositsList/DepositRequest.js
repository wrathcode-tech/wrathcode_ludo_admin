import React, { useEffect, useState } from "react";
import UserHeader from "../../Layout/UserHeader";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../Utils/CustomAlertMessage";
import { imageUrl } from "../../Api/Api_Config/ApiEndpoints";
import moment from "moment";
import DataTableBase from "../../Utils/DataTable";
import { useNavigate } from "react-router-dom";

const TEAL_GRADIENT = "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)";
const TEAL_ACCENT = "#0d9488";
const TEAL_BTN = "linear-gradient(135deg, #0d9488, #0f766e)";

function DepositRequest() {
  const [activeTab, setActiveTab] = useState("PENDING");
  const [pendingDepositRequest, setPendingDepositRequest] = useState([]);
  const [allData, setAllData] = useState([]);
  const [approvedDepositList, setApprovedDepositList] = useState([]);
  const [rejectedDepositList, setRejectedDepositList] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    handlePendingDepositReq();
  }, []);

  useEffect(() => {
    if (activeTab === "APPROVED" && approvedDepositList?.length === 0) handleApprovedList();
    if (activeTab === "REJECTED" && rejectedDepositList?.length === 0) handleRejectedList();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load approved/rejected only when tab switches
  }, [activeTab]);

  const handlePendingDepositReq = async (page, pageSize) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.pendingDepositRequest(page, pageSize);
      if (result?.success) {
        const data = result?.data || [];
        setAllData(data);
        setPendingDepositRequest(data);
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
      const result = await AuthService.approvedDepositRequest();
      if (result?.success) setApprovedDepositList(result?.data?.reverse?.() ?? result?.data ?? []);
      else setApprovedDepositList([]);
    } catch (error) {
      alertErrorMessage(error?.message);
      setApprovedDepositList([]);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleRejectedList = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.rejectedDepositRequest();
      if (result?.success) setRejectedDepositList(result?.data?.reverse?.() ?? result?.data ?? []);
      else setRejectedDepositList([]);
    } catch (error) {
      alertErrorMessage(error?.message);
      setRejectedDepositList([]);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleStatusUpdate = async (userId, transactionId, status, rejectReason) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.updateDepositRequest(userId, transactionId, status, rejectReason);
      if (result?.success) {
        alertSuccessMessage(`Deposit ${status} successfully`);
        setPendingDepositRequest((prev) => prev.filter((item) => item._id !== transactionId));
        setAllData((prev) => prev.filter((item) => item._id !== transactionId));
        window.dispatchEvent(new CustomEvent("refreshSidebarCounts"));
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

  const handleUserClick = (userId) => {
    navigate("/dashboard/UserDetails", { state: { userId } });
  };

  const searchObjects = (e) => {
    const userInput = e.target.value?.toLowerCase() || "";
    setSearch(e.target.value);
    if (!userInput) {
      setPendingDepositRequest(allData);
      return;
    }
    const keysToSearch = ["userId?.uuid", "userId?.fullName", "userId?.mobileNumber", "amount", "utrNumber"];
    const matching = allData?.filter((obj) =>
      keysToSearch.some((key) => {
        const value = key.split(".").reduce((acc, k) => acc?.[k], obj);
        return value?.toString()?.toLowerCase()?.includes(userInput);
      })
    ) || [];
    setPendingDepositRequest(matching);
  };

  const statusBadge = (status) => {
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

  const userIdCell = (row) => (
    <div className="d-flex align-items-center gap-2">
      <button
        type="button"
        onClick={() => handleUserClick(row?.userId?.id ?? row?.userId?._id)}
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

  const paymentProofCell = (row) =>
    row?.paymentProof ? (
      <a href={imageUrl + row.paymentProof} target="_blank" rel="noopener noreferrer">
        <img
          src={imageUrl + row.paymentProof}
          loading="lazy"
          alt="proof"
          className="rounded-3"
          style={{ width: 48, height: 48, objectFit: "cover" }}
        />
      </a>
    ) : (
      "—"
    );

  const pendingColumns = [
    { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
    { name: "User Id", width: "160px", cell: userIdCell },
    { name: "Name", selector: (row) => row?.userId?.name ?? "—", sortable: true, wrap: true },
    { name: "Fista Username", selector: (row) => row?.userId?.fullName ?? "—", sortable: true, wrap: true },
    { name: "Mobile", selector: (row) => row?.userId?.mobileNumber ?? "—", sortable: true, wrap: true },
    { name: "Amount", selector: (row) => `₹ ${row?.amount ?? 0}`, sortable: true, wrap: true },
    { name: "UTR Number", selector: (row) => row?.utrNumber ?? "—", sortable: true, wrap: true },
    { name: "Payment Proof", width: "100px", cell: paymentProofCell },
    {
      name: "Actions",
      width: "200px",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm rounded-pill border-0 px-3"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 600, fontSize: "0.75rem" }}
            onClick={() => handleStatusUpdate(row.userId?._id, row._id, "APPROVED")}
          >
            Approve
          </button>
          <button
            type="button"
            className="btn btn-sm rounded-pill border-0 px-3"
            style={{ background: "#dc2626", color: "#fff", fontWeight: 600, fontSize: "0.75rem" }}
            onClick={() => handleStatusUpdate(row.userId?._id, row._id, "REJECTED")}
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
    { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
    { name: "User Id", width: "160px", cell: userIdCell },
    { name: "Name", selector: (row) => row?.userId?.name ?? "—", sortable: true, wrap: true },
    { name: "Fista Username", selector: (row) => row?.userId?.fullName ?? "—", sortable: true, wrap: true },
    { name: "Mobile", selector: (row) => row?.userId?.mobileNumber ?? "—", sortable: true, wrap: true },
    { name: "Amount", selector: (row) => `₹ ${row?.amount ?? 0}`, sortable: true, wrap: true },
    { name: "UTR Number", selector: (row) => row?.utrNumber ?? "—", sortable: true, wrap: true },
    { name: "Payment Proof", width: "100px", cell: paymentProofCell },
    { name: "Status", width: "100px", cell: (row) => statusBadge(row?.status), sortable: true },
  ];

  const rejectedColumns = [
    { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
    { name: "User Id", width: "160px", cell: userIdCell },
    { name: "Name", selector: (row) => row?.userId?.name ?? "—", sortable: true, wrap: true },
    { name: "Fista Username", selector: (row) => row?.userId?.fullName ?? "—", sortable: true, wrap: true },
    { name: "Mobile", selector: (row) => row?.userId?.mobileNumber ?? "—", sortable: true, wrap: true },
    { name: "Amount", selector: (row) => `₹ ${row?.amount ?? 0}`, sortable: true, wrap: true },
    { name: "UTR Number", selector: (row) => row?.utrNumber ?? "—", sortable: true, wrap: true },
    { name: "Payment Proof", width: "100px", cell: paymentProofCell },
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
            style={{ background: TEAL_GRADIENT, boxShadow: "0 16px 48px rgba(13,148,136,0.25)" }}
          >
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div>
                <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
                  Deposit Requests
                </h1>
                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>
                  Manage pending, approved and rejected deposit requests
                </p>
              </div>
              <div
                className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white"
                style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}
              >
                <i className="fas fa-arrow-down fa-lg" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="card border-0 rounded-4 overflow-hidden"
          style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #059669" }}
        >
          <div
            className="card-header border-0 py-3 px-4"
            style={{ background: "linear-gradient(90deg, rgba(5,150,105,0.08) 0%, transparent 100%)" }}
          >
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 flex-wrap">
              <h3 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                <span
                  className="rounded-3 d-inline-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #059669, #047857)", color: "#fff" }}
                >
                  <i className="fas fa-list" />
                </span>
                {activeTab === "PENDING" && "Pending Deposits"}
                {activeTab === "APPROVED" && "Approved Deposits"}
                {activeTab === "REJECTED" && "Rejected Deposits"}
              </h3>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {activeTab === "PENDING" && (
                  <div className="d-flex align-items-center rounded-3 border overflow-hidden" style={{ background: "#f8fafc", maxWidth: "300px" }}>
                    <span className="px-3 py-2 text-muted">
                      <i className="fas fa-search" style={{ color: TEAL_ACCENT }} />
                    </span>
                    <input
                      type="search"
                      className="form-control border-0 bg-transparent py-2"
                      placeholder="Search by UUID, name, mobile, amount, UTR..."
                      value={search}
                      onChange={searchObjects}
                      style={{ fontSize: "0.9rem" }}
                    />
                  </div>
                )}
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
          </div>
          <div className="card-body p-0">
            <div className="p-4">
              {activeTab === "PENDING" && (
                <DataTableBase columns={pendingColumns} data={pendingDepositRequest} pagination />
              )}
              {activeTab === "APPROVED" && (
                <DataTableBase columns={approvedColumns} data={approvedDepositList} pagination />
              )}
              {activeTab === "REJECTED" && (
                <DataTableBase columns={rejectedColumns} data={rejectedDepositList} pagination />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepositRequest;
