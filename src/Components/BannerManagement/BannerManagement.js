import React, { useState, useEffect } from "react";
import UserHeader from "../../Layout/UserHeader";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../Utils/CustomAlertMessage";
import moment from "moment";
import { ApiConfig, imageUrl } from "../../Api/Api_Config/ApiEndpoints";
import DataTableBase from "../../Utils/DataTable";

const TEAL_BTN = "linear-gradient(135deg, #0d9488, #0f766e)";

const BannerManagement = () => {
    const [bannerLink, setBannerLink] = useState('');
    const [activeTab, setActiveTab] = useState("sendToBanner");
    const [allUsers, setAllUsers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [displayOn, setDisplayOn] = useState("Landing");

    useEffect(() => {
        handleAnnouncementBannerList();
    }, []);

    const handleAnnouncementBannerList = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.getAnnouncementBannerList();
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                setAllUsers(result?.data);
                setSuggestions(result?.data?.reverse());
            } else {
                alertErrorMessage("Something went wrong while fetching Banners.");
            }
        } catch (results) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(results?.message);
        }
    };

    const DeleteNotification = async (id) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.bannerDelete(id);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result.message);
                handleAnnouncementBannerList();
            } else {
                alertErrorMessage("Something went wrong while deleting.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error deleting Banner.");
        }
    };

    const linkFollow = (row) => (
        <div className="d-flex gap-2">
            <button type="button" className="btn btn-sm rounded-pill border-0 px-3" style={{ background: "#dc2626", color: "#fff", fontWeight: 600 }} onClick={() => DeleteNotification(row?._id)}>Delete</button>
            {row?.status === "INACTIVE" ? (
                <button type="button" className="btn btn-sm rounded-pill border-0 px-3" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 600 }} onClick={() => handleStatus(row?._id, "ACTIVE")}>Active</button>
            ) : (
                <button type="button" className="btn btn-sm rounded-pill border-0 px-3" style={{ background: "#64748b", color: "#fff", fontWeight: 600 }} onClick={() => handleStatus(row?._id, "INACTIVE")}>Inactive</button>
            )}
        </div>
    );

    const columns = [
        { name: "Sr No.", selector: (row, index) => index + 1, wrap: true, width: "80px" },
        {
            name: "Date",
            shrink: true,
            wrap: true,
            selector: row => moment(row.createdAt).format("DD-MM-YYYY LT")
        },
        {
            name: "Banner Image",
            shrink: true,
            wrap: true,
            selector: row => (
                row?.bannerImage ? (
                    <img src={`${imageUrl}${row?.bannerImage}`} alt="Banner" loading="lazy" className="rounded-3 shadow-sm" style={{ maxWidth: "100px", height: "auto", objectFit: "cover" }} />
                ) : <span className="text-muted">No image</span>
            )
        },
        {
            name: "Expiry Date",
            shrink: true,
            wrap: true,
            selector: row => row?.isPermanent === false
                ? moment(row?.activeUntil).format("DD/MM/YYYY ")
                : "No Expiration"
        },
        { name: "Action", wrap: true, selector: linkFollow, },
    ];

    const handleStatus = async (id, status) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService?.updateBannerStatus(id, status);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Notification sent successfully.");
                handleAnnouncementBannerList();
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error sending notification.");
        }
    };

    // ✅ Reset form fields helper
    const resetForm = () => {
        setBannerLink("");
        setStartDate("");
        setEndDate("");
        setBannerImage(null);
        setPreviewImage(null);
        setDisplayOn("Landing");
    };

    const handleAnnouncementBanner = async (bannerImage, startDate, endDate, bannerLink) => {
        LoaderHelper.loaderStatus(true);
        try {
            const formData = new FormData();
            formData.append("displayOn", [displayOn]);
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);

            if (bannerLink) {
                formData.append("link", bannerLink);
            }

            if (bannerImage && bannerImage instanceof File) {
                formData.append("bannerImage", bannerImage);
            } else {
                alertErrorMessage("Please upload a valid banner image.");
                LoaderHelper.loaderStatus(false);
                return;
            }

            const result = await AuthService.announcementBanner(formData);
            LoaderHelper.loaderStatus(false);

            if (result?.success) {
                alertSuccessMessage(result?.message);
                handleAnnouncementBannerList();

                // ✅ Reset inputs after successful submit
                resetForm();
            } else {
                alertErrorMessage("Something went wrong while fetching notifications.");
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message);
        }
    };

    const today = new Date().toISOString().split("T")[0];
    const [imageError, setImageError] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const width = img.width;
            const height = img.height;

            if (width > 420 || height > 210) {
                setImageError("Image size should not exceed 420px x 210px");
                setBannerImage(null);
                setPreviewImage(null);
            } else {
                setImageError(""); // clear error
                setBannerImage(file);
                setPreviewImage(URL.createObjectURL(file));
            }
        };
    };



    return (
        <div className="dashboard_right">
            <UserHeader />
            <div className="dashboard_outer_s">
                <div className="mb-4">
                    <div className="rounded-4 overflow-hidden border-0 p-4 p-md-5" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)", boxShadow: "0 16px 48px rgba(13,148,136,0.25)" }}>
                        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                            <div>
                                <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>Announcement Banner Management</h1>
                                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>Create and manage announcement banners</p>
                            </div>
                            <div className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white" style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}><i className="fas fa-image fa-lg" /></div>
                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <ul className="nav nav-pills gap-2 flex-wrap">
                        <li className="nav-item">
                            <button type="button" className={`nav-link rounded-pill ${activeTab === "sendToBanner" ? "active" : ""}`} style={activeTab === "sendToBanner" ? { background: TEAL_BTN, color: "#fff", border: "none", fontWeight: 600 } : { background: "#f1f5f9", color: "#64748b", border: "none" }} onClick={() => { setActiveTab("sendToBanner"); resetForm(); }}>Send Banner</button>
                        </li>
                        <li className="nav-item">
                            <button type="button" className={`nav-link rounded-pill ${activeTab === "AnnouncementBannerManagement" ? "active" : ""}`} style={activeTab === "AnnouncementBannerManagement" ? { background: TEAL_BTN, color: "#fff", border: "none", fontWeight: 600 } : { background: "#f1f5f9", color: "#64748b", border: "none" }} onClick={() => { setActiveTab("AnnouncementBannerManagement"); resetForm(); }}>Banner Management</button>
                        </li>
                    </ul>
                </div>
                <div className="container2 width-70">
                                <div className="row">
                                    <div className="col-xl-12">
                                        {activeTab === "sendToBanner" && (
                                            <div className="card mb-4 bg-white border shadow-sm">
                                                <div className="card-body d-flex flex-column p-4">
                                                    <h4 className="mb-4 text-dark">Send Announcement Banner</h4>

                                                    {/* Banner Upload */}
                                                    <div className="form-group mb-3">
                                                        <label className="small mb-1">
                                                            Banner Image * <span className="text-danger">(Image size must be 420px x 210px)</span>
                                                        </label>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="form-control"
                                                            required
                                                        />
                                                        {imageError && <small className="text-danger">{imageError}</small>}
                                                    </div>

                                                    {/* Expiry Date */}
                                                    <div className="form-group mb-3">
                                                        <label className="small">Expiry Time (Optional)</label>
                                                        <input
                                                            type="date"
                                                            value={endDate}
                                                            onChange={(e) => setEndDate(e.target.value)}
                                                            className="form-control"
                                                            min={startDate || today}
                                                        />
                                                    </div>

                                                    {/* Optional Link */}
                                                    <div className="form-group mb-3">
                                                        <label className="small mb-1">Link (optional)</label>
                                                        <input
                                                            type="text"
                                                            value={bannerLink}
                                                            onChange={(e) => setBannerLink(e.target.value)}
                                                            className="form-control"
                                                            placeholder="Enter Link"
                                                        />
                                                    </div>

                                                    {/* Display On */}
                                                    <div className="form-group mb-3">
                                                        <label className="small mb-1">
                                                            Display On <span className="text-danger">*</span>
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            value={displayOn}
                                                            onChange={(e) => setDisplayOn(e.target.value)}
                                                        >
                                                            <option value="Landing">Landing</option>
                                                            <option value="Dashboard">Dashboard</option>
                                                        </select>
                                                    </div>

                                                    {/* Preview Section */}
                                                    {previewImage && (
                                                        <div className="mb-4">
                                                            <label className="small mb-2 d-block">Preview:</label>
                                                            <div className="d-flex gap-4 flex-wrap">
                                                                <div>
                                                                    <p className="small mb-1 fw-semibold">📱 Desktop View (Web)</p>
                                                                    <div
                                                                        style={{
                                                                            width: "100%",
                                                                            maxWidth: "600px",
                                                                            border: "1px solid #ddd",
                                                                            borderRadius: "10px",
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={previewImage} loading="lazy"
                                                                            alt="Desktop Preview"
                                                                            className="img-fluid w-100"
                                                                            style={{ borderRadius: "8px" }}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <p className="small mb-1 fw-semibold">📲 Mobile View (Phone)</p>
                                                                    <div
                                                                        style={{
                                                                            width: "300px",
                                                                            border: "1px solid #ddd",
                                                                            borderRadius: "10px",
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={previewImage} loading="lazy"
                                                                            alt="Mobile Preview"
                                                                            className="img-fluid w-100"
                                                                            style={{ borderRadius: "8px" }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Submit Button */}
                                                    <button type="button" className="btn w-100 mt-2 rounded-pill border-0 py-2 text-white fw-semibold" style={{ background: TEAL_BTN }} onClick={() => handleAnnouncementBanner(bannerImage, startDate, endDate, bannerLink)}>Send Banner</button>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "AnnouncementBannerManagement" && (
                                            <div className="card mb-4 bg-white border shadow-sm">
                                                <div className="card-body d-flex flex-column p-4">
                                                    <h4 className="mb-4 text-dark">Banner List</h4>
                                                    <DataTableBase columns={columns} data={suggestions} pagination />
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

export default BannerManagement;
