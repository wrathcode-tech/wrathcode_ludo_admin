import React, { useState, useEffect } from "react";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../Utils/CustomAlertMessage";
import DataTableBase from "../../Utils/DataTable";
import { imageUrl } from "../../Api/Api_Config/ApiEndpoints";

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

    useEffect(() => { if (activeTab === "list") fetchBankList(); }, [activeTab]);

    const fetchBankList = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.getAdminBankDetails();
            LoaderHelper.loaderStatus(false);
            result?.success ? setBankList(result.data || []) : alertErrorMessage(result?.message);
        } catch (error) { LoaderHelper.loaderStatus(false); alertErrorMessage(error?.message); }
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
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result.message);
                setFormData({ accountHolderName: "", accountNumber: "", ifscCode: "", bankName: "", upiId: "", upiName: "", qrCode: null });
            } else alertErrorMessage(result?.message);
        } catch (error) { LoaderHelper.loaderStatus(false); alertErrorMessage(error?.message); }
    };

    const handleStatusUpdate = async (id, currentStatus) => {
        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.updateStatusAdminBank(id, newStatus);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result.message);
                fetchBankList(); // refresh the list
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message);
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
        { name: "Account Holder Name", selector: (r) => r.accountHolderName || "---" },
        { name: "Account Number", selector: (r) => r.accountNumber || "---" },
        { name: "IFSC", selector: (r) => r.ifscCode || "---" },
        { name: "Bank Name", selector: (r) => r.bankName || "---" },
        { name: "UPI ID", selector: (r) => r.upiId || "---" },
        { name: "UPI Name", selector: (r) => r.upiName || "---" },
        { name: "QR Code", cell: (r) => imageUrl + r.qrCode ? <img src={imageUrl + r.qrCode} alt="QR" style={{ width: 50, height: 50 }} /> : "---" },
        {
            name: "Action",
            cell: (r) => (
                <button
                    className={`btn ${r.status === "ACTIVE" ? "btn-danger" : "btn-success"}`}
                    onClick={() => handleStatusUpdate(r._id, r.status)}
                >
                    {r.status === "ACTIVE" ? "Inactive" : "Active"}
                </button>
            ),
        }];

    return (
        <div className="dashboard_right">
            <div className="dashboard_outer_s">
                <main>
                    <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                        <div className="container2">
                            <h1 className="page-header-title mb-0">User Bank Details</h1>

                            <ul className="nav nav-pills tabs_top mt-3 mb-3">
                                <li className="nav-item">
                                    <button className={`nav-link ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}>Add Bank Details</button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link ${activeTab === "list" ? "active" : ""}`} onClick={() => setActiveTab("list")}>Bank List</button>
                                </li>
                            </ul>

                            {activeTab === "add" && (
                                <form onSubmit={handleSubmit}>
                                    {inputs.map(({ label, name, type, required }) => (
                                        <div className="mb-3" key={name}>
                                            <label>{label}</label>
                                            <input
                                                type={type || "text"}
                                                className="form-control"
                                                name={name}
                                                value={type === "file" ? undefined : formData[name]}
                                                onChange={handleChange}
                                                required={required || false}
                                                accept={type === "file" ? "image/*" : undefined}
                                            />
                                        </div>
                                    ))}
                                    <button type="submit" className="btn btn-primary">Save Bank Details</button>
                                </form>
                            )}

                            {activeTab === "list" && <div className="table-responsive"><DataTableBase columns={columns} data={bankList} pagination /></div>}
                        </div>
                    </header>
                </main>
            </div>
        </div>
    );
}

export default AddBankDetails;
