import React, { useState, useEffect } from "react";
import moment from "moment";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../Utils/CustomAlertMessage";
import DataTableBase from "../../Utils/DataTable";

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

    const linkFollow = (row) => {
        return (
            <div className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => DeleteNotification(row?._id)}>Delete</button>
                {row?.isActive === true ?
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleStatus(row?._id, false)}>Active</button>
                    :
                    <button className="btn btn-danger btn-sm me-2" onClick={() => handleStatus(row?._id, true)}>Inactive</button>}
            </div>
        );
    };

    const columns = [
        { name: "Created At", shrink: true, wrap: true, selector: row => moment(row?.createdAt).format("DD/MM/YYYY LT") },
        { name: "Notification Title", shrink: true, wrap: true, selector: row => row?.title },
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

    return (
        <div className="dashboard_right notification_s">
            <div className="dashboard_outer_s">
                <div id="layoutSidenav_content">
                    <main>
                        <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                            <div className="container2">
                                <div className="page-header-content pt-4">
                                    <h1 className="page-header-title mb-0">Notification Management</h1>
                                </div>
                                <ul className="nav nav-pills mb-3">
                                    {["sendToUser", "bulkNotification", "announceToAll", "managementNotification"].map(tab => (
                                        <li key={tab} className="nav-item" onClick={resetInput}>
                                            <button
                                                className={`m-0 nav-link ${activeTab === tab ? "active" : ""}`}
                                                type="button"
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                {tab === "sendToUser" ? "Send to User" :
                                                    tab === "bulkNotification" ? "Bulk Notification" :
                                                        tab === "announceToAll" ? "Announce To All" :
                                                            "Management Notification"}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </header>

                        <div className="container2 mt-n10 width-70">
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

                                                <button className="btn btn-primary w-100 mt-2"
                                                    onClick={() => sendSingleUserNotification(selectedUsers?.map(u => u._id), notificationTitle, notification, notificationLink)}>
                                                    Send Notifications
                                                </button>
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

                                                <button className="btn btn-primary w-100 mt-2"
                                                    onClick={() => sendBulkNotification(selectedUsers?.map(u => u._id), notificationTitle, notification, notificationLink)}>
                                                    Send Bulk Notifications
                                                </button>
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
                                                <button className="btn btn-primary w-100 mt-2"
                                                    onClick={() => sendNotificationToAll(notificationTitle, notification, notificationLink)}>
                                                    Send Notifications to All
                                                </button>
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
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Notification;
