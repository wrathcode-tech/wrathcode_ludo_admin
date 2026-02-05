import React, { useState, useEffect } from "react";
import UserHeader from "../../Layout/UserHeader";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../Utils/CustomAlertMessage";
import DataTableBase from "../../Utils/DataTable";
import { imageUrl } from "../../Api/Api_Config/ApiEndpoints";

const TEAL_GRADIENT = "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)";
const TEAL_BTN = "linear-gradient(135deg, #0d9488, #0f766e)";

function AddBankDetails() {
  const [activeTab, setActiveTab] = useState("add");
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    upiId: "",
    upiName: "",
    qrCode: null,
  });
  const [bankList, setBankList] = useState([]);

  useEffect(() => {
    if (activeTab === "list") fetchBankList();
  }, [activeTab]);

  const fetchBankList = async () => {
    LoaderHelper.loaderStatus(true);
    try {
      const result = await AuthService.getAdminBankDetails();
      if (result?.success) setBankList(result.data || []);
      else alertErrorMessage(result?.message);
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: name === "qrCode" ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    LoaderHelper.loaderStatus(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => formData[key] && data.append(key, formData[key]));
      const result = await AuthService.addAdminBankDetails(data);
      if (result?.success) {
        alertSuccessMessage(result.message);
        setFormData({ accountHolderName: "", accountNumber: "", ifscCode: "", bankName: "", upiId: "", upiName: "", qrCode: null });
      } else alertErrorMessage(result?.message);
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    LoaderHelper.loaderStatus(true);
    try {
      const result = await AuthService.updateStatusAdminBank(id, newStatus);
      if (result?.success) {
        alertSuccessMessage(result.message);
        fetchBankList();
      } else alertErrorMessage(result?.message);
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const inputs = [
    { label: "Account Holder Name", name: "accountHolderName", required: true },
    { label: "Account Number", name: "accountNumber", required: true },
    { label: "IFSC Code", name: "ifscCode", required: true },
    { label: "Bank Name", name: "bankName", required: true },
    { label: "UPI ID", name: "upiId" },
    { label: "UPI Name", name: "upiName" },
    { label: "QR Code", name: "qrCode", type: "file" },
  ];

  const columns = [
    { name: "Sr. No.", selector: (_, i) => i + 1, width: "80px" },
    { name: "Account Holder", selector: (r) => r.accountHolderName || "—" },
    { name: "Account Number", selector: (r) => r.accountNumber || "—" },
    { name: "IFSC", selector: (r) => r.ifscCode || "—" },
    { name: "Bank Name", selector: (r) => r.bankName || "—" },
    { name: "UPI ID", selector: (r) => r.upiId || "—" },
    { name: "UPI Name", selector: (r) => r.upiName || "—" },
    { name: "QR Code", cell: (r) => (r.qrCode ? <img src={imageUrl + r.qrCode} alt="QR" className="rounded-3" style={{ width: 48, height: 48, objectFit: "cover" }} /> : "—") },
    {
      name: "Action",
      width: "120px",
      cell: (r) => (
        <button
          type="button"
          className="btn btn-sm rounded-pill border-0 px-3"
          style={{
            background: r.status === "ACTIVE" ? "#dc2626" : TEAL_BTN,
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
          onClick={() => handleStatusUpdate(r._id, r.status)}
        >
          {r.status === "ACTIVE" ? "Inactive" : "Active"}
        </button>
      ),
    },
  ];

  return (
    <div className="dashboard_right">
      <UserHeader />
      <div className="dashboard_outer_s">
        <div className="mb-4">
          <div className="rounded-4 overflow-hidden border-0 p-4 p-md-5" style={{ background: TEAL_GRADIENT, boxShadow: "0 16px 48px rgba(13,148,136,0.25)" }}>
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div>
                <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>User Bank Details</h1>
                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>Add and manage admin bank & UPI details</p>
              </div>
              <div className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white" style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}>
                <i className="fas fa-university fa-lg" />
              </div>
            </div>
          </div>
        </div>

        <ul className="nav nav-pills gap-2 mb-4">
          <li className="nav-item">
            <button type="button" className={`nav-link rounded-pill ${activeTab === "add" ? "active" : ""}`} style={activeTab === "add" ? { background: TEAL_BTN, color: "#fff", border: "none", fontWeight: 600 } : { background: "#f1f5f9", color: "#64748b", border: "none" }} onClick={() => setActiveTab("add")}>Add Bank Details</button>
          </li>
          <li className="nav-item">
            <button type="button" className={`nav-link rounded-pill ${activeTab === "list" ? "active" : ""}`} style={activeTab === "list" ? { background: TEAL_BTN, color: "#fff", border: "none", fontWeight: 600 } : { background: "#f1f5f9", color: "#64748b", border: "none" }} onClick={() => setActiveTab("list")}>Bank List</button>
          </li>
        </ul>

        {activeTab === "add" && (
          <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #0d9488" }}>
            <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(13,148,136,0.08) 0%, transparent 100%)" }}>
              <h3 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                <span className="rounded-3 d-inline-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: TEAL_BTN, color: "#fff" }}><i className="fas fa-plus" /></span>
                Add Bank Details
              </h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {inputs.map(({ label, name, type, required }) => (
                    <div className="col-md-6" key={name}>
                      <label className="form-label fw-semibold">{label}{required && " *"}</label>
                      <input type={type || "text"} className="form-control rounded-3" name={name} value={type === "file" ? undefined : formData[name]} onChange={handleChange} required={!!required} accept={type === "file" ? "image/*" : undefined} />
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn rounded-pill border-0 px-4 mt-3" style={{ background: TEAL_BTN, color: "#fff", fontWeight: 600 }}>Save Bank Details</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #6366f1" }}>
            <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.08) 0%, transparent 100%)" }}>
              <h3 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                <span className="rounded-3 d-inline-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff" }}><i className="fas fa-list" /></span>
                Bank List
              </h3>
            </div>
            <div className="card-body p-0">
              <DataTableBase columns={columns} data={bankList} pagination />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddBankDetails;
