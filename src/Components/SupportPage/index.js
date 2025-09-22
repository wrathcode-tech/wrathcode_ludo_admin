import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import moment from "moment";
import { ApiConfig } from "../../Api/Api_Config/ApiEndpoints";

function SupportChat() {
  const userId = sessionStorage.getItem("userId"); // ya admin id
  const [chatData, setChatData] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const messagesEndRef = useRef(null);

  // Connect socket
  useEffect(() => {
    const newSocket = io(`${ApiConfig?.webSocketUrl}`, {
      transports: ["websocket"],
      upgrade: false,
      rejectUnauthorized: false,
      reconnection: false,
    });

    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on("supportResponse", (data) => {
      if (Array.isArray(data)) {
        setChatData(data);
      } else if (data?.message) {
        setChatData((prev) => [...prev, data]);
      }
      if (data?.isClosed) setIsClosed(true);
    });

    return () => newSocket.disconnect();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatData]);

  // Send message
  const handleSend = () => {
    if (socket && message.trim() !== "" && !isClosed) {
      const payload = {
        userId: userId,
        sender: "admin", // ya "user"
        message: message,
        timestamp: new Date().toISOString(),
      };

      // Optimistic UI update
      setChatData((prev) => [...prev, payload]);

      // Emit to socket
      socket.emit("supportMessage", payload);

      setMessage("");
    }
  };

  return (
    <div className="dashboard_right">
      <div className="dashboard_outer_s">
        <h2>Support Chat</h2>

        {/* Chat Messages */}
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
          {chatData.length > 0 ? (
            chatData.map((chat, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    chat.sender === "admin" ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    background: chat.sender === "admin" ? "#03C2C7" : "#e5e5e5",
                    color: chat.sender === "admin" ? "#fff" : "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    marginRight: chat.sender === "admin" ? "0" : "8px",
                    marginLeft: chat.sender === "admin" ? "8px" : "0",
                    flexShrink: 0,
                  }}
                >
                  {chat.sender === "admin" ? "A" : "U"}
                </div>

                {/* Message bubble */}
                <div
                  style={{
                    background: chat.sender === "admin" ? "#03C2C7" : "#e5e5e5",
                    color: chat.sender === "admin" ? "#fff" : "#000",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    maxWidth: "70%",
                    position: "relative",
                  }}
                >
                  <strong style={{ display: "block", marginBottom: "4px" }}>
                    {chat.sender === "admin" ? "You (Admin)" : "User"}
                  </strong>
                  <p style={{ margin: "4px 0" }}>{chat.message}</p>
                  <small
                    style={{
                      fontSize: "11px",
                      opacity: 0.7,
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {chat?.timestamp
                      ? moment(chat.timestamp).format("DD/MM/YYYY hh:mm A")
                      : ""}
                  </small>
                  {/* Read indicator for admin */}
                  {chat.sender === "admin" && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "2px",
                        right: "4px",
                        fontSize: "10px",
                        opacity: 0.6,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#777" }}>No messages yet</p>
          )}
          <div ref={messagesEndRef} />
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
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="btn"
              style={{
                backgroundColor: "#03C2C7",
                color: "#fff",
                padding: "8px 16px",
              }}
              onClick={handleSend}
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
    </div>
  );
}

export default SupportChat;
