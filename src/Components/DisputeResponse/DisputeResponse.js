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

function DisputeResponse() {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWinningData, setSelectedWinningData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleView = async (id) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getParticularResponseView(id);
      if (result?.success) {
        setSelectedWinningData(result.data);
        setShowModal(true);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleEventRefund = async (eventId) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.refundEventFund(eventId);
      if (result?.success) {
        alertSuccessMessage("Refund processed successfully");
        setAllData((prev) => prev.filter((d) => d.eventId !== eventId));
        setFilteredData((prev) => prev.filter((d) => d.eventId !== eventId));
        setShowModal(false);
        setSelectedWinningData(null);
        window.dispatchEvent(new CustomEvent("refreshSidebarCounts"));
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleSelectResult = async (eventId, winnerId) => {
    if (!selectedWinningData) return;
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.chooseWinner(eventId, winnerId);
      if (result?.success) {
        alertSuccessMessage("Winner selected successfully");
        setAllData((prev) => prev.filter((d) => d.eventId !== eventId));
        setFilteredData((prev) => prev.filter((d) => d.eventId !== eventId));
        setShowModal(false);
        setSelectedWinningData(null);
        window.dispatchEvent(new CustomEvent("refreshSidebarCounts"));
      } else {
        alertErrorMessage(result?.message || "Something went wrong");
      }
    } catch (error) {
      alertErrorMessage(error?.message || "API Error");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate("/dashboard/UserDetails", { state: { userId } });
  };

  const commonColumns = [
    {
      name: "Sr No.",
      cell: (row, rowIndex) => rowIndex + 1 + (currentPage - 1) * rowsPerPage,
      width: "80px",
    },
    {
      name: "Date & Time",
      selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"),
      sortable: true,
      wrap: true,
    },
    {
      name: "Event ID",
      selector: (row) => row.eventId || "—",
      sortable: true,
      wrap: true,
    },
    {
      name: "User Id",
      width: "220px",
      cell: (row) => (
        <div className="d-flex flex-column gap-2">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="small text-muted">Creator:</span>
            <button
              type="button"
              onClick={() => handleUserClick(row?.createdBy?._id)}
              className="btn btn-link p-0 text-decoration-none fw-semibold"
              style={{ color: TEAL_ACCENT, cursor: "pointer", fontSize: "0.85rem" }}
            >
              {row?.createdBy?.uuid || "—"}
            </button>
            <button
              type="button"
              className="btn btn-link p-0 text-secondary"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (row?.createdBy?.uuid) {
                  navigator.clipboard.writeText(row.createdBy.uuid);
                  alertSuccessMessage("Creator UUID Copied!");
                } else alertErrorMessage("No Creator UUID found");
              }}
              title="Copy"
            >
              <i className="far fa-copy small" />
            </button>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="small text-muted">Joiner:</span>
            <button
              type="button"
              onClick={() => handleUserClick(row?.joinedBy?._id)}
              className="btn btn-link p-0 text-decoration-none fw-semibold"
              style={{ color: TEAL_ACCENT, cursor: "pointer", fontSize: "0.85rem" }}
            >
              {row?.joinedBy?.uuid || "—"}
            </button>
            <button
              type="button"
              className="btn btn-link p-0 text-secondary"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (row?.joinedBy?.uuid) {
                  navigator.clipboard.writeText(row.joinedBy.uuid);
                  alertSuccessMessage("Joiner UUID Copied!");
                } else alertErrorMessage("No Joiner UUID found");
              }}
              title="Copy"
            >
              <i className="far fa-copy small" />
            </button>
          </div>
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row) => `₹ ${row?.matchAmount ?? 0}`,
      sortable: true,
      width: "100px",
    },
    {
      name: "Status",
      width: "120px",
      cell: (row) => {
        const status = row?.status || "—";
        const isDispute = status === "DISPUTE";
        const isApproved = status === "APPROVED";
        const isRejected = status === "REJECTED";
        return (
          <span
            className="badge rounded-pill border-0"
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              ...(isDispute && { background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff" }),
              ...(isApproved && { background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" }),
              ...(isRejected && { background: "#dc2626", color: "#fff" }),
              ...(!isDispute && !isApproved && !isRejected && { background: "#f1f5f9", color: "#64748b" }),
            }}
          >
            {status}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Action",
      width: "100px",
      cell: (row) => (
        <button
          type="button"
          className="btn btn-sm rounded-pill border-0 px-3"
          style={{
            background: TEAL_BTN,
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
          onClick={() => handleView(row._id)}
        >
          View
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  useEffect(() => {
    const fetchDisputeData = async () => {
      try {
        LoaderHelper.loaderStatus(true);
        const result = await AuthService.getDisputeUsersRespose();
        if (result?.success) {
          const data = result?.data || [];
          setAllData(data);
          setFilteredData(data);
        } else {
          alertErrorMessage(result?.message);
        }
      } catch (error) {
        alertErrorMessage(error?.message);
      } finally {
        LoaderHelper.loaderStatus(false);
      }
    };
    fetchDisputeData();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(allData);
      return;
    }
    const term = searchTerm.toLowerCase();
    const tempData = allData.filter(
      (item) =>
        (item?.eventId || "").toLowerCase().includes(term) ||
        (item?.matchAmount?.toString() || "").includes(searchTerm)
    );
    setFilteredData(tempData);
  }, [searchTerm, allData]);

  return (
    <div className="dashboard_right">
      <UserHeader />
      <div className="dashboard_outer_s">
        {/* Page header - same theme */}
        <div className="mb-4">
          <div
            className="rounded-4 overflow-hidden border-0 p-4 p-md-5"
            style={{
              background: TEAL_GRADIENT,
              boxShadow: "0 16px 48px rgba(13,148,136,0.25)",
            }}
          >
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div>
                <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
                  Dispute Ludo Games List
                </h1>
                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>
                  Resolve disputes, select winner or refund
                </p>
              </div>
              <div
                className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white"
                style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}
              >
                <i className="fas fa-gavel fa-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div
          className="card border-0 rounded-4 overflow-hidden"
          style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #dc2626" }}
        >
          <div
            className="card-header border-0 py-3 px-4"
            style={{ background: "linear-gradient(90deg, rgba(220,38,38,0.08) 0%, transparent 100%)" }}
          >
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
              <h3 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                <span
                  className="rounded-3 d-inline-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #dc2626, #b91c1c)", color: "#fff" }}
                >
                  <i className="fas fa-exclamation-triangle" />
                </span>
                Disputes
              </h3>
              <div
                className="d-flex align-items-center rounded-3 border overflow-hidden"
                style={{ background: "#f8fafc", maxWidth: "280px" }}
              >
                <span className="px-3 py-2 text-muted">
                  <i className="fas fa-search" style={{ color: TEAL_ACCENT }} />
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent py-2"
                  placeholder="Search by Event ID or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ fontSize: "0.9rem" }}
                />
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <DataTableBase
              columns={commonColumns}
              data={filteredData}
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
          </div>
        </div>
      </div>

      {/* Winning Details Modal - premium */}
      {showModal && selectedWinningData && (
        <div
          className="d-flex align-items-center justify-content-center p-3"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
          onClick={() => setShowModal(false)}
          role="presentation"
        >
          <div
            className="rounded-4 overflow-hidden border-0 bg-white"
            style={{ width: "95%", maxWidth: "900px", maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="border-0 py-4 px-4 text-white"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}
            >
              <h3 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ fontSize: "1.2rem" }}>
                <i className="fas fa-trophy" /> Winning Details
              </h3>
            </div>
            <div className="p-4">
              <div className="row g-3 mb-4">
                <div className="col-md-9">
                  <div className="rounded-4 p-3" style={{ background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)" }}>
                    <p className="mb-2"><strong>Event ID:</strong> {selectedWinningData.eventId || "—"}</p>
                    <p className="mb-2"><strong>Created By:</strong> {selectedWinningData?.createdBy?.name?.trim() || selectedWinningData?.createdBy?.fullName?.trim() || "—"}</p>
                    <p className="mb-2"><strong>Joined By:</strong> {selectedWinningData?.joinedBy?.name?.trim() || selectedWinningData?.joinedBy?.fullName?.trim() || "—"}</p>
                    <p className="mb-0"><strong>Total Amount:</strong> ₹{selectedWinningData?.totalBetamount || (selectedWinningData?.amount ?? 0) * 2 || 0}</p>
                  </div>
                </div>
                <div className="col-md-3 d-flex align-items-center justify-content-md-end">
                  <button
                    type="button"
                    className="btn rounded-pill border-0 px-4"
                    style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 600 }}
                    onClick={() => handleEventRefund(selectedWinningData.eventId)}
                  >
                    Refund
                  </button>
                </div>
              </div>

              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: "1rem" }}>
                <i className="fas fa-users" style={{ color: TEAL_ACCENT }} /> User Responses
              </h5>
              <div className="table-responsive rounded-4 overflow-hidden border">
                <table className="table table-hover mb-0">
                  <thead style={{ background: "linear-gradient(90deg, rgba(13,148,136,0.1) 0%, transparent 100%)" }}>
                    <tr>
                      <th className="border-0 py-2">Name</th>
                      <th className="border-0 py-2">Fista Username</th>
                      <th className="border-0 py-2">UUID</th>
                      <th className="border-0 py-2">Mobile</th>
                      <th className="border-0 py-2">Amount</th>
                      <th className="border-0 py-2">Choice</th>
                      <th className="border-0 py-2">Proof</th>
                      <th className="border-0 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedWinningData?.allUserResponse?.length > 0 ? (
                      selectedWinningData.allUserResponse.map((u, index) => {
                        const userInfo = u?.userId || {};
                        const individualAmount = u?.amount || (selectedWinningData?.totalBetamount ? selectedWinningData.totalBetamount / 2 : 0);
                        return (
                          <tr key={index}>
                            <td>{userInfo?.name || "—"}</td>
                            <td>{userInfo?.fullName || "—"}</td>
                            <td className="text-break">{userInfo?.uuid || "—"}</td>
                            <td>{userInfo?.mobileNumber || "—"}</td>
                            <td>₹{individualAmount}</td>
                            <td>{u?.choice || "—"}</td>
                            <td>
                              {u?.proof ? (
                                <img
                                  src={imageUrl + u.proof}
                                  alt="proof"
                                  loading="lazy"
                                  className="rounded-3"
                                  style={{ width: 48, height: 48, cursor: "pointer", objectFit: "cover" }}
                                  onClick={() => window.open(imageUrl + u.proof, "_blank")}
                                />
                              ) : (
                                "—"
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-1 flex-wrap">
                                <button
                                  type="button"
                                  className="btn btn-sm rounded-pill border-0 px-3"
                                  style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 600, fontSize: "0.75rem" }}
                                  onClick={() => handleSelectResult(selectedWinningData.eventId, userInfo?._id)}
                                >
                                  Winner
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm rounded-pill border-0 px-3"
                                  style={{ background: TEAL_BTN, color: "#fff", fontWeight: 600, fontSize: "0.75rem" }}
                                  onClick={() => navigate("/dashboard/support", { state: { openChat: true, userId: userInfo?._id } })}
                                >
                                  Contact
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center text-muted py-4">
                          No user responses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn rounded-pill px-4"
                  style={{ background: "#64748b", color: "#fff" }}
                  onClick={() => setShowModal(false)}
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

export default DisputeResponse;
