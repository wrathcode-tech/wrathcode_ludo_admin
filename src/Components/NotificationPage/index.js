import React, { useState, useEffect } from "react";
import moment from "moment";
import UserHeader from "../../Layout/UserHeader";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../Utils/CustomAlertMessage";
import DataTableBase from "../../Utils/DataTable";

const TEAL_BTN = "linear-gradient(135deg, #0d9488, #0f766e)";

const Notification = () => {
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notification, setNotification] = useState("");
    const [notificationLink, setNotificationLink] = useState('');
    const [notificationList, setNotificationList] = useState([]);
    console.log("🚀 ~ Notification ~ notificationList:", notificationList)
    const [activeTab, setActiveTab] = useState("sendToUser");
    const [allUsers, setAllUsers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        handleNotification();
    }, []);

    const handleNotification = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.getNotificationList();
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                setAllUsers(result?.data);
                setSuggestions(result?.data);
                setNotificationList(result?.data?.reverse());
            } else {
                alertErrorMessage("Something went wrong while fetching notifications.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error loading notifications.");
        }
    };

    const DeleteNotification = async (id) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.deleteNotify(id);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result.message);
                handleNotification();
            } else {
                alertErrorMessage("Something went wrong while deleting.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error deleting notification.");
        }
    };

    const handleStatus = async (id, status) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService?.updateNotificationStatus(id, status);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Status updated successfully.");
                handleNotification();
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error updating status.");
        }
    };

    const linkFollow = (row) => (
        <div className="d-flex gap-2">
            <button type="button" className="btn btn-sm rounded-pill border-0 px-3" style={{ background: "#dc2626", color: "#fff", fontWeight: 600 }} onClick={() => DeleteNotification(row?._id)}>Delete</button>
            {row?.isActive === true ? (
                <button type="button" className="btn btn-sm rounded-pill border-0 px-3" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 600 }} onClick={() => handleStatus(row?._id, false)}>Active</button>
            ) : (
                <button type="button" className="btn btn-sm rounded-pill border-0 px-3" style={{ background: "#64748b", color: "#fff", fontWeight: 600 }} onClick={() => handleStatus(row?._id, true)}>Inactive</button>
            )}
        </div>
    );
    
    const columns = [
        { name: "Sr No.", selector: (row, index) => index + 1, wrap: true, width: "80px" },
        { name: "Date & Time", shrink: true, wrap: true, selector: row => moment(row.createdAt).format("DD-MM-YYYY LT") },
        { name: "Title", shrink: true, wrap: true, selector: row => row?.title },
        { name: "Message", shrink: true, wrap: true, selector: row => row?.message },
        { name: "Action", wrap: true, selector: linkFollow },
    ];

    const sendSingleUserNotification = async (userIds, title, message, link) => {
        if (!userIds?.length) return alertErrorMessage("Please select at least one user.");
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.sendNotificationToUser(userIds, title, message, link);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Notification sent successfully.");
                handleNotification();
                resetInput();
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error sending notification.");
        }
    };

    const sendBulkNotification = async (userIds, title, message, link) => {
        if (!userIds?.length) return alertErrorMessage("Please select at least one user.");
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.sendBulkNotification(userIds, title, message, link);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Notification sent successfully.");
                handleNotification();
                resetInput();
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error sending bulk notification.");
        }
    };

    const sendNotificationToAll = async (title, message, link) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.sendAllNotification(title, message, link);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Notification sent successfully.");
                handleNotification();
                resetInput();
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error sending notification.");
        }
    };

    const handleFindUser = async (input) => {
        if (!input) {
            setSuggestions([]);
            return;
        }
        try {
            const result = await AuthService.userFind(input);
            if (result?.success && Array.isArray(result.data)) {
                setSuggestions(result.data);
            } else {
                setSuggestions([]);
            }
        } catch {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (user) => {
        setSelectedUsers([user]);
        setUserInput('');
        setSuggestions([]);
    };

    const handleSelectSuggestion2 = (user) => {
        const exists = selectedUsers.some(u => u._id === user._id);
        if (!exists) setSelectedUsers([...selectedUsers, user]);
        setUserInput('');
        setSuggestions([]);
    };

    const resetInput = () => {
        setSuggestions([]);
        setUserInput("");
        setNotificationTitle("");
        setNotification("");
        setNotificationLink("");
        setSelectedUsers([]);
    };

    const tabs = [
        { id: "sendToUser", label: "Send to User" },
        { id: "bulkNotification", label: "Bulk Notification" },
        { id: "announceToAll", label: "Announce To All" },
        { id: "managementNotification", label: "Management Notification" },
    ];

    return (
        <div className="dashboard_right notification_s">
            <UserHeader />
            <div className="dashboard_outer_s">
                <div className="mb-4">
                    <div className="rounded-4 overflow-hidden border-0 p-4 p-md-5" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)", boxShadow: "0 16px 48px rgba(13,148,136,0.25)" }}>
                        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                            <div>
                                <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>Notification Management</h1>
                                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>Send and manage notifications</p>
                            </div>
                            <div className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white" style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}><i className="fas fa-bell fa-lg" /></div>
                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <ul className="nav nav-pills gap-2 flex-wrap">
                        {tabs.map((tab) => (
                            <li key={tab.id} className="nav-item">
                                <button type="button" className={`nav-link rounded-pill ${activeTab === tab.id ? "active" : ""}`} style={activeTab === tab.id ? { background: TEAL_BTN, color: "#fff", border: "none", fontWeight: 600 } : { background: "#f1f5f9", color: "#64748b", border: "none" }} onClick={() => { setActiveTab(tab.id); resetInput(); }}>{tab.label}</button>
                            </li>
                        ))}
                    </ul>
                </div>

                        <div className="container2 width-70">
                            <div className="row">
                                <div className="col-xl-12">
                                    {activeTab === "sendToUser" && (
                                        <div className="card mb-4 bg-white border shadow-sm">
                                            <div className="card-body d-flex flex-column p-4">
                                                <h4 className="mb-4 text-dark">Send Notification to User</h4>

                                                {/* User Search */}
                                                <div className="form-group mb-3 position-relative">
                                                    <input
                                                        type="search"
                                                        value={userInput}
                                                        onChange={(e) => { setUserInput(e.target.value); handleFindUser(e.target.value); }}
                                                        className="form-control"
                                                        placeholder="Select user by name, email, or ID"
                                                        autoComplete="off"
                                                        disabled={selectedUsers?.length > 0}
                                                    />
                                                    {userInput && suggestions.length > 0 && (
                                                        <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}>
                                                            {suggestions.map((user, idx) => (
                                                                <li key={user._id || idx} className="list-group-item list-group-item-action" onClick={() => handleSelectSuggestion(user)} style={{ cursor: "pointer" }}>
                                                                    <div className="fw-bold">{user.firstName || ''} {user.lastName || ''}</div>
                                                                    <div className="text-muted small">{user.emailId}</div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>

                                                {/* Selected Users */}
                                                {selectedUsers.length > 0 && selectedUsers.map((user, index) => (
                                                    <div key={index} className="rounded-2 p-3 mb-3 shadow-sm bg-white d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <div className="fw-semibold fs-6">{user.firstName} {user.lastName}</div>
                                                            <div className="text-muted small">{user.emailId}</div>
                                                        </div>
                                                        <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: "25px" }}
                                                            onClick={() => setSelectedUsers(prev => prev.filter((_, idx) => idx !== index))}>
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Title */}
                                                <div className="form-group mb-3">
                                                    <label className="small mb-1">Title<span className="text-danger"> *</span></label>
                                                    <input type="text" value={notificationTitle} onChange={e => setNotificationTitle(e.target.value)} className="form-control" placeholder="Enter Title" />
                                                </div>

                                                {/* Message */}
                                                <div className="form-group mb-3">
                                                    <label className="small mb-1">Message<span className="text-danger"> *</span></label>
                                                    <textarea value={notification} onChange={e => setNotification(e.target.value)} className="form-control" rows="5" placeholder="Enter Message"></textarea>
                                                </div>

                                                {/* Link */}
                                                <div className="form-group mb-3">
                                                    <label className="small mb-1">Link (optional)</label>
                                                    <input type="text" value={notificationLink} onChange={e => setNotificationLink(e.target.value)} className="form-control" placeholder="Enter Link" />
                                                </div>

                                                <button type="button" className="btn w-100 mt-2 rounded-pill border-0 py-2 text-white fw-semibold" style={{ background: TEAL_BTN }} onClick={() => sendSingleUserNotification(selectedUsers?.map(u => u._id), notificationTitle, notification, notificationLink)}>Send Notifications</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bulk Notification */}
                                    {activeTab === "bulkNotification" && (
                                        <div className="card mb-4 bg-white border shadow-sm">
                                            <div className="card-body d-flex flex-column p-4">
                                                <h4 className="mb-4 text-dark">Send Bulk Notifications</h4>

                                                {/* User Search */}
                                                <div className="form-group mb-3 position-relative">
                                                    <input
                                                        type="search"
                                                        value={userInput}
                                                        onChange={(e) => { setUserInput(e.target.value); handleFindUser(e.target.value); }}
                                                        className="form-control"
                                                        placeholder="Select user by name, email, or ID"
                                                        autoComplete="off"
                                                    />
                                                    {userInput && suggestions.length > 0 && (
                                                        <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}>
                                                            {suggestions.map((user, idx) => (
                                                                <li key={user._id || idx} className="list-group-item list-group-item-action" onClick={() => handleSelectSuggestion2(user)} style={{ cursor: "pointer" }}>
                                                                    <div className="fw-bold">{user.firstName || ''} {user.lastName || ''}</div>
                                                                    <div className="text-muted small">{user.emailId}</div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>

                                                {/* Selected Users */}
                                                {selectedUsers.length > 0 && selectedUsers.map((user, index) => (
                                                    <div key={index} className="rounded-2 p-3 mb-3 shadow-sm bg-white d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <div className="fw-semibold fs-6">{user.firstName} {user.lastName}</div>
                                                            <div className="text-muted small">{user.emailId}</div>
                                                        </div>
                                                        <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: "25px" }}
                                                            onClick={() => setSelectedUsers(prev => prev.filter((_, idx) => idx !== index))}>
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Title */}
                                                <div className="form-group mb-3">
                                                    <label className="small mb-1">Title<span className="text-danger"> *</span></label>
                                                    <input type="text" value={notificationTitle} onChange={e => setNotificationTitle(e.target.value)} className="form-control" placeholder="Enter Title" />
                                                </div>

                                                {/* Message */}
                                                <div className="form-group mb-3">
                                                    <label className="small mb-1">Message<span className="text-danger"> *</span></label>
                                                    <textarea value={notification} onChange={e => setNotification(e.target.value)} className="form-control" rows="5" placeholder="Enter Message"></textarea>
                                                </div>

                                                {/* Link */}
                                                <div className="form-group mb-3">
                                                    <label className="small mb-1">Link (optional)</label>
                                                    <input type="text" value={notificationLink} onChange={e => setNotificationLink(e.target.value)} className="form-control" placeholder="Enter Link" />
                                                </div>

                                                <button type="button" className="btn w-100 mt-2 rounded-pill border-0 py-2 text-white fw-semibold" style={{ background: TEAL_BTN }} onClick={() => sendBulkNotification(selectedUsers?.map(u => u._id), notificationTitle, notification, notificationLink)}>Send Bulk Notifications</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Announce To All */}
                                    {activeTab === "announceToAll" && (
                                        <div className="card mb-4 bg-white border shadow-sm">
                                            <div className="card-body d-flex flex-column p-4">
                                                <h4 className="mb-4 text-dark">Send Notifications to All</h4>
                                                <div className="form-group mb-3">
                                                    <label className="small mb-1">Title<span className="text-danger"> *</span></label>
                                                    <input type="text" value={notificationTitle} onChange={e => setNotificationTitle(e.target.value)} className="form-control" placeholder="Enter Title" />
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label className="small mb-1">Message<span className="text-danger"> *</span></label>
                                                    <textarea value={notification} onChange={e => setNotification(e.target.value)} className="form-control" rows="5" placeholder="Enter Message"></textarea>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label className="small mb-1">Link (optional)</label>
                                                    <input type="text" value={notificationLink} onChange={e => setNotificationLink(e.target.value)} className="form-control" placeholder="Enter Link" />
                                                </div>
                                                <button type="button" className="btn w-100 mt-2 rounded-pill border-0 py-2 text-white fw-semibold" style={{ background: TEAL_BTN }} onClick={() => sendNotificationToAll(notificationTitle, notification, notificationLink)}>Send Notifications to All</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Management Notification */}
                                    {activeTab === "managementNotification" && (
                                        <div className="card mb-4 bg-white border shadow-sm">
                                            <div className="card-body d-flex flex-column p-4">
                                                <h4 className="mb-4 text-dark">Notifications List</h4>
                                                <DataTableBase columns={columns} data={allUsers} pagination />
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                </div>
            </div>
    );
};

export default Notification;
