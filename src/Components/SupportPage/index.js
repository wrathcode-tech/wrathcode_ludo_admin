import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { alertErrorMessage } from "../../Utils/CustomAlertMessage";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import DataTableBase from "../../Utils/DataTable";

function SupportChat() {
  const adminId = "68a4b42c776734c76dfc7248";
  const [supportData, setSupportData] = useState([]);
  const [message, setMessage] = useState("");
  const [isClosed, setIsClosed] = useState(false);
  const [allMsgData, setAllMsgData] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const chatEndRef = useRef(null);

  /** 🔹 Send message */
  const handleMsgSend = async () => {
    if (!message.trim() || !selectedTicket) return;
    LoaderHelper.loaderStatus(true);
    try {
      const result = await AuthService.msgSend(
        selectedTicket,
        adminId,
        "admin",
        message.trim()
      );

      if (result?.success) {
        setSupportData((prev = []) => [
          ...(Array.isArray(prev) ? prev : []),
          { sender: "admin", message: message.trim(), timestamp: new Date().toISOString() },
        ]);
        setMessage("");
      } else {
        alertErrorMessage(result?.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      alertErrorMessage("Server error while sending message.");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  /** 🔹 Get messages of selected user */
  const handleGetMsg = async (userId, { showLoader = true } = {}) => {
    if (!userId) return;
    if (showLoader) {
      LoaderHelper.loaderStatus(true);
    }
    try {
      const result = await AuthService.getMsgUser(userId);
      if (result?.success) {
        const messages = Array.isArray(result.data) ? result.data : result.data?.messages || [];
        setSupportData(messages);
        if (
          result?.ticketStatus === "closed" ||
          result.data?.ticketStatus === "closed"
        ) {
          setIsClosed(true);
        } else {
          setIsClosed(false);
        }
      } else {
        alertErrorMessage(result?.message || "Failed to fetch messages.");
        setSupportData([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
      alertErrorMessage("Server error while fetching messages.");
      setSupportData([]);
    } finally {
      if (showLoader) {
        LoaderHelper.loaderStatus(false);
      }
    }
  };

  /** 🔹 Get all tickets */
  const handleAllMsg = async () => {
    LoaderHelper.loaderStatus(true);
    try {
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
  const handleMsgSeen = async (userId, viewer) => {
    LoaderHelper.loaderStatus(true);
    try {
      const result = await AuthService.msgSeen(userId, viewer);
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

  /** 🔹 Auto scroll */
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [supportData]);

  useEffect(() => {
    handleAllMsg();
  }, []);

  /** 🔹 Poll chat messages every 3 seconds when a ticket is selected */
  useEffect(() => {
    if (!selectedTicket) return;
    const intervalId = setInterval(() => {
      handleGetMsg(selectedTicket, { showLoader: false });
    }, 3000);
    return () => clearInterval(intervalId);
  }, [selectedTicket]);

  const columns = [
    { name: "User ID", selector: (row) => row?.userId?._id || "—", sortable: true },
    { name: "User Name", selector: (row) => row?.userId?.fullName || "—", sortable: true },
    { name: "Email", selector: (row) => row?.userId?.emailId || "—", sortable: true },
    { name: "Last Message", selector: (row) => row?.lastMessage || "—", sortable: true },
    { name: "Status", selector: (row) => row?.status || "—", sortable: true },
    {
      name: "Created At",
      selector: (row) => new Date(row?.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            setSelectedTicket(row.userId._id);
            handleGetMsg(row.userId._id);
          }}
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="dashboard_right">
      <div className="dashboard_outer_s">
        <h2>Support Chat</h2>
        <DataTableBase columns={columns} data={allMsgData} pagination />

        {/* Show chat only if a ticket is selected */}
        {selectedTicket && (
          <div style={{ marginTop: "20px" }}>
            <h4>Chat Window</h4>
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
                      justifyContent:
                        chat.sender === "admin" ? "flex-end" : "flex-start",
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

            {/* Input Box */}
            {!isClosed ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMsgSend()}
                />
                <button
                  className="btn"
                  style={{
                    backgroundColor: "#03C2C7",
                    color: "#fff",
                    padding: "8px 16px",
                  }}
                  onClick={handleMsgSend}
                  disabled={!message.trim()}
                >
                  Send
                </button>
              </div>
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
