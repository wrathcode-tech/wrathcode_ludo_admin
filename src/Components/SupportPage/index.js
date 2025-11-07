import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { alertErrorMessage } from "../../Utils/CustomAlertMessage";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import DataTableBase from "../../Utils/DataTable";
import { imageUrl } from "../../Api/Api_Config/ApiEndpoints";
import { useLocation } from "react-router-dom";

function SupportChat() {
  const adminId = "68a4b42c776734c76dfc7248";

  const [allMsgData, setAllMsgData] = useState([]); // 🔹 Ticket list
  const [supportData, setSupportData] = useState([]); // 🔹 Chat messages
  const [selectedTicket, setSelectedTicket] = useState(null); // 🔹 Selected userId

  const [isClosed, setIsClosed] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [search, setSearch] = useState("");

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);


  // 🔹 Scroll to bottom on chat update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [supportData]);

  // 🔹 Fetch all tickets (runs only once)
  const handleAllMsg = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.allMsg();
      if (result?.success) {
        setAllMsgData(result.data);
      } else {
        alertErrorMessage(result?.message || "Failed to fetch all messages.");
      }
    } catch (error) {
      console.error("❌ Failed to fetch all messages:", error);
      alertErrorMessage("Server error while fetching messages.");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  useEffect(() => {
    handleAllMsg(); // ✅ Only once on mount
  }, []);

  // 🔹 Fetch single user's chat
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
          result?.ticketStatus === "closed" ||
          result?.data?.ticketStatus === "closed"
        );
        setSelectedTicket(userId); // ✅ ensure selectedTicket set
      } else {
        alertErrorMessage(result?.message || "Failed to fetch messages.");
        setSupportData([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
      alertErrorMessage("Server error while fetching messages.");
      setSupportData([]);
    } finally {
      if (showLoader) LoaderHelper.loaderStatus(false);
    }
  };

  // 🔹 Handle send message
  const handleMsgSend = async () => {
    const trimmed = message.trim();
    if (!selectedTicket) return;
    if (!trimmed && !file) return; // nothing to send

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
        } catch (_) { }
        setFile(null);
        setFilePreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";

        // Optimistic message update
        if (trimmed) {
          setSupportData((prev) => [
            ...(Array.isArray(prev) ? prev : []),
            { sender: "admin", message: trimmed, timestamp: new Date().toISOString() },
          ]);
        }

        // 🔹 Fetch latest chat (no loader)
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

  // 🔹 Auto-open chat from "Contact User"
  useEffect(() => {
    const userId = location?.state?.userId;
    if (location?.state?.openChat && userId) {
      handleGetMsg(userId);
    }
  }, [location?.state]);

  // 🔹 DataTable columns

  const itemsPerPage = 10;
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
    { name: "User ID", selector: (row) => row?.userId?.uuid || "—" },
    { name: "User Name", selector: (row) => row?.userId?.fullName || "—" },
    { name: "Mobile", selector: (row) => row?.userId?.mobileNumber || "—" },
    { name: "Last Message", selector: (row) => row?.lastMessage || "—" },
    { name: "Status", selector: (row) => row?.status?.toUpperCase() || "—" },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleGetMsg(row.userId._id)}
        >
          View
        </button>
      ),
    },
  ];

  const handleSearch = (e) => {
    const value = e.target.value?.trim()?.toLowerCase() || "";
    setSearch(value);
  };

  // Filter list
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


  return (
    <div className="dashboard_right">
      <div className="dashboard_outer_s">
        <h2>Support Chat</h2>

        {/* 🔍 Search Box */}
        <div className="col-3 mb-3">
          <input
            className="form-control"
            type="search"
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* 🔹 Ticket List */}
        <DataTableBase columns={columns} data={filteredList} pagination onChangePage={(page) => setCurrentPage(page)}
        />

        <h4 className="mt-0">Chat Window</h4>

        {/* 🔹 Chat Window */}
        {selectedTicket && (
          <div className="chatbox_div_massages">
            {/* 🔁 Refresh Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleGetMsg(selectedTicket, { showLoader: true })}
              >
                <i className="fa fa-refresh" style={{ marginRight: "5px" }}></i>
                Refresh
              </button>
            </div>

            {/* 🔹 Chat Messages */}
            <div
              className="chat_messages_block"
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginBottom: "15px",
                background: "#fafafa",
              }}
            >
              {supportData.length > 0 ? (
                supportData.map((chat, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: chat.sender === "admin" ? "flex-end" : "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        background: chat.sender === "admin" ? "#03C2C7" : "#e5e5e5",
                        color: chat.sender === "admin" ? "#fff" : "#000",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        maxWidth: "70%",
                      }}
                    >
                      <strong style={{ display: "block", marginBottom: "4px" }}>
                        {chat.sender === "admin" ? "You (Admin)" : "User"}
                      </strong>

                      {chat?.image && (
                        <img
                          src={imageUrl + chat.image}
                          alt="chat-media"
                          style={{
                            maxWidth: "200px",
                            borderRadius: "8px",
                            marginTop: "5px",
                          }}
                        />
                      )}
                      <p style={{ margin: "4px 0" }}>{chat.message}</p>
                      <small style={{ fontSize: "11px", opacity: 0.7 }}>
                        {chat?.timestamp
                          ? moment(chat.timestamp).format("DD/MM/YYYY hh:mm A")
                          : ""}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#777" }}>No messages yet</p>
              )}
              <div ref={chatEndRef}></div>
            </div>

            {/* 🔹 Message Input */}
            {!isClosed ? (
              <>
                {filePreview && (
                  <div className="preview-inside">
                    <img src={filePreview} alt="preview" />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => {
                        try {
                          if (filePreview) URL.revokeObjectURL(filePreview);
                        } catch (_) { }
                        setFile(null);
                        setFilePreview("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="chatbox_bottom">
                  <div className="messages_file_in">
                    <div className="input-with-preview">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleMsgSend()}
                      />

                      <label htmlFor="fileInput" className="upload-icon">
                        <i className="fa fa-paperclip"></i>
                      </label>
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFile(file);
                            setFilePreview(URL.createObjectURL(file));
                          }
                        }}
                      />

                      <button
                        className="btn send-btn"
                        onClick={handleMsgSend}
                        disabled={!message.trim() && !file}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", marginTop: "20px", color: "green" }}>
                <p>This ticket has been resolved ✅</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SupportChat;
