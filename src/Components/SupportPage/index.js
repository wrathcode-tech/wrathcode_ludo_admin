import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { alertErrorMessage, alertSuccessMessage } from "../../Utils/CustomAlertMessage";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import DataTableBase from "../../Utils/DataTable";
import { imageUrl } from "../../Api/Api_Config/ApiEndpoints";
import { useLocation, useNavigate } from "react-router-dom";
import UserHeader from "../../Layout/UserHeader";

const TEAL_GRADIENT = "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)";
const TEAL_ACCENT = "#0d9488";
const TEAL_BTN = "linear-gradient(135deg, #0d9488, #0f766e)";

function SupportChat() {
  const adminId = "68a4b42c776734c76dfc7248";

  const [allMsgData, setAllMsgData] = useState([]);
  const [supportData, setSupportData] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [search, setSearch] = useState("");
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [supportData]);

  const handleAllMsg = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.allMsg();
      if (result?.success) {
        setAllMsgData(result.data || []);
      } else {
        alertErrorMessage(result?.message || "Failed to fetch messages.");
      }
    } catch (error) {
      alertErrorMessage("Server error while fetching messages.");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  useEffect(() => {
    handleAllMsg();
  }, []);

  const handleGetMsg = async (userId, { showLoader = true } = {}) => {
    if (!userId) return;
    if (showLoader) LoaderHelper.loaderStatus(true);
    try {
      const result = await AuthService.getMsgUser(userId);
      if (result?.success) {
        const messages = Array.isArray(result.data)
          ? result.data
          : result.data?.messages || [];
        setSupportData(messages);
        setIsClosed(
          result?.ticketStatus === "closed" || result?.data?.ticketStatus === "closed"
        );
        setSelectedTicket(userId);
      } else {
        alertErrorMessage(result?.message || "Failed to fetch messages.");
        setSupportData([]);
      }
    } catch (error) {
      alertErrorMessage("Server error while fetching messages.");
      setSupportData([]);
    } finally {
      if (showLoader) LoaderHelper.loaderStatus(false);
    }
  };

  const handleMsgSend = async () => {
    const trimmed = message.trim();
    if (!selectedTicket) return;
    if (!trimmed && !file) return;

    const formData = new FormData();
    formData.append("userId", selectedTicket);
    formData.append("adminId", adminId);
    formData.append("sender", "admin");
    if (trimmed) formData.append("message", trimmed);
    if (file) formData.append("imageUrl", file);

    LoaderHelper.loaderStatus(true);
    try {
      const result = await AuthService.msgSend(formData);
      if (result?.success) {
        setMessage("");
        try {
          if (filePreview) URL.revokeObjectURL(filePreview);
        } catch (_) {}
        setFile(null);
        setFilePreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";

        if (trimmed) {
          setSupportData((prev) => [
            ...(Array.isArray(prev) ? prev : []),
            {
              sender: "admin",
              message: trimmed,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
        await handleGetMsg(selectedTicket, { showLoader: false });
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
    const userId = location?.state?.userId;
    if (location?.state?.openChat && userId) {
      handleGetMsg(userId);
    }
  }, [location?.state]);

  const handleUserClick = (userId) => {
    navigate("/dashboard/UserDetails", { state: { userId } });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value?.trim()?.toLowerCase() || "");
  };

  const filteredList = allMsgData.filter((item) => {
    const text = search.toLowerCase();
    if (!text) return true;
    const uuid = item?.userId?.uuid?.toLowerCase() || "";
    const name = item?.userId?.fullName?.toLowerCase() || "";
    const mobile = item?.userId?.mobileNumber?.toString() || "";
    const email = item?.userId?.emailId?.toLowerCase() || "";
    const lastMsg = item?.lastMessage?.toLowerCase() || "";
    return (
      uuid.includes(text) ||
      name.includes(text) ||
      mobile.includes(text) ||
      email.includes(text) ||
      lastMsg.includes(text)
    );
  });

  const columns = [
    {
      name: "Sr No.",
      selector: (row, i) => i + 1 + (currentPage - 1) * itemsPerPage,
      width: "80px",
    },
    {
      name: "Date & Time",
      selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"),
      sortable: true,
    },
    {
      name: "User Id",
      wrap: true,
      width: "160px",
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            onClick={() => handleUserClick(row?.userId?.id)}
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
              if (row?.userId?.uuid) {
                navigator?.clipboard?.writeText(row?.userId?.uuid);
                alertSuccessMessage("UUID copied!");
              } else {
                alertErrorMessage("No UUID found");
              }
            }}
            title="Copy UUID"
          >
            <i className="far fa-copy" />
          </button>
        </div>
      ),
    },
    { name: "Name", selector: (row) => row?.userId?.name || "—" },
    { name: "Fista User Name", selector: (row) => row?.userId?.fullName || "—" },
    { name: "Mobile", selector: (row) => row?.userId?.mobileNumber || "—", width: "130px" },
    { name: "Last Message", selector: (row) => row?.lastMessage || "—", wrap: true },
    {
      name: "Status",
      cell: (row) => {
        const status = (row?.status || "").toUpperCase();
        const isClosed = status === "CLOSED";
        const isResolved = status === "RESOLVED";
        return (
          <span
            className="badge rounded-pill border-0"
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              ...(isClosed && { background: "#64748b", color: "#fff" }),
              ...(isResolved && { background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" }),
              ...(!isClosed && !isResolved && { background: "rgba(13,148,136,0.15)", color: "#0f766e" }),
            }}
          >
            {status || "—"}
          </span>
        );
      },
      width: "100px",
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
          onClick={() => handleGetMsg(row.userId._id)}
        >
          View
        </button>
      ),
    },
  ];

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
                  Support Chat
                </h1>
                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>
                  View tickets and chat with users
                </p>
              </div>
              <div
                className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white"
                style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}
              >
                <i className="fas fa-headset fa-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Ticket list card */}
        <div
          className="card border-0 rounded-4 overflow-hidden mb-4"
          style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #0d9488" }}
        >
          <div
            className="card-header border-0 py-3 px-4"
            style={{ background: "linear-gradient(90deg, rgba(13,148,136,0.08) 0%, transparent 100%)" }}
          >
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
              <h3 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                <span
                  className="rounded-3 d-inline-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", background: TEAL_BTN, color: "#fff" }}
                >
                  <i className="fas fa-ticket-alt" />
                </span>
                Tickets
              </h3>
              <div
                className="d-flex align-items-center rounded-3 border overflow-hidden"
                style={{ background: "#f8fafc", maxWidth: "320px" }}
              >
                <span className="px-3 py-2 text-muted">
                  <i className="fas fa-search" style={{ color: TEAL_ACCENT }} />
                </span>
                <input
                  type="search"
                  className="form-control border-0 bg-transparent py-2"
                  placeholder="Search by name, mobile, UUID..."
                  value={search}
                  onChange={handleSearch}
                  style={{ fontSize: "0.9rem" }}
                />
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <DataTableBase
              columns={columns}
              data={filteredList}
              pagination
              onChangePage={(page) => setCurrentPage(page)}
            />
          </div>
        </div>

        {/* Chat window card */}
        {selectedTicket && (
          <div
            className="card border-0 rounded-4 overflow-hidden"
            style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #6366f1" }}
          >
            <div
              className="card-header border-0 py-3 px-4"
              style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.08) 0%, transparent 100%)" }}
            >
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <h3 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                  <span
                    className="rounded-3 d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                      color: "#fff",
                    }}
                  >
                    <i className="fas fa-comments" />
                  </span>
                  Chat
                </h3>
                <button
                  type="button"
                  className="btn btn-sm rounded-pill border-0 d-inline-flex align-items-center gap-2"
                  style={{ background: "#64748b", color: "#fff", fontWeight: 600 }}
                  onClick={() => handleGetMsg(selectedTicket, { showLoader: true })}
                >
                  <i className="fas fa-sync-alt" /> Refresh
                </button>
              </div>
            </div>

            <div className="card-body p-4">
              {/* Messages area */}
              <div
                className="rounded-4 overflow-auto mb-4"
                style={{
                  maxHeight: "420px",
                  minHeight: "200px",
                  background: "#f8fafc",
                  border: "1px solid rgba(0,0,0,0.06)",
                  padding: "1rem",
                }}
              >
                {supportData.length > 0 ? (
                  supportData.map((chat, i) => (
                    <div
                      key={i}
                      className="d-flex mb-3"
                      style={{
                        justifyContent: chat.sender === "admin" ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        className="rounded-4 px-3 py-2 shadow-sm"
                        style={{
                          maxWidth: "75%",
                          background:
                            chat.sender === "admin"
                              ? TEAL_BTN
                              : "#fff",
                          color: chat.sender === "admin" ? "#fff" : "#1e293b",
                          border: chat.sender === "admin" ? "none" : "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        <div className="small fw-semibold mb-1 opacity-90">
                          {chat.sender === "admin" ? "You (Admin)" : "User"}
                        </div>
                        {chat?.image && (
                          <img
                            src={imageUrl + chat.image}
                            alt="chat"
                            loading="lazy"
                            className="rounded-3 mt-1"
                            style={{ maxWidth: "200px", display: "block" }}
                          />
                        )}
                        <div className="mb-1">{chat.message}</div>
                        <small className="opacity-75" style={{ fontSize: "0.7rem" }}>
                          {chat?.timestamp
                            ? moment(chat.timestamp).format("DD/MM/YYYY hh:mm A")
                            : ""}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-5">
                    <i className="fas fa-inbox fa-2x mb-2 opacity-50" />
                    <p className="mb-0">No messages yet</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input area or closed message */}
              {!isClosed ? (
                <>
                  {filePreview && (
                    <div
                      className="position-relative d-inline-block mb-2 rounded-3 overflow-hidden"
                      style={{ background: "#f1f5f9", padding: "8px" }}
                    >
                      <img src={filePreview} alt="Preview" style={{ maxHeight: "80px" }} />
                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-0 end-0 rounded-circle"
                        style={{ background: "#dc2626", color: "#fff" }}
                        onClick={() => {
                          try {
                            if (filePreview) URL.revokeObjectURL(filePreview);
                          } catch (_) {}
                          setFile(null);
                          setFilePreview("");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      className="form-control rounded-pill flex-grow-1"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleMsgSend()}
                      style={{ padding: "0.6rem 1rem", minWidth: "200px" }}
                    />
                    <label
                      htmlFor="supportFileInput"
                      className="btn rounded-pill mb-0 d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "44px",
                        height: "44px",
                        background: "#f1f5f9",
                        color: TEAL_ACCENT,
                        cursor: "pointer",
                      }}
                      title="Attach image"
                    >
                      <i className="fas fa-paperclip" />
                    </label>
                    <input
                      type="file"
                      id="supportFileInput"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files[0];
                        if (f) {
                          setFile(f);
                          setFilePreview(URL.createObjectURL(f));
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn rounded-pill border-0 px-4"
                      style={{
                        background: TEAL_BTN,
                        color: "#fff",
                        fontWeight: 600,
                      }}
                      onClick={handleMsgSend}
                      disabled={!message.trim() && !file}
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className="text-center rounded-4 py-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)",
                    border: "1px solid rgba(34,197,94,0.3)",
                  }}
                >
                  <span className="badge rounded-pill border-0 mb-2" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontSize: "0.8rem" }}>
                    Resolved
                  </span>
                  <p className="mb-0 text-success fw-semibold">This ticket has been closed</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupportChat;
