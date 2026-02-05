import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import { imageUrl } from '../../Api/Api_Config/ApiEndpoints';
import moment from 'moment';
import DataTableBase from '../../Utils/DataTable';
import { useNavigate } from 'react-router-dom';

function Partner() {
    const [allData, setAllData] = useState([]);
    const [partnerData, setPartnerData] = useState([]);

    useEffect(() => {
        handlepartnerData();
    }, [])
    const handlepartnerData = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.getAllPartners();
            if (result?.success) {
                const data = result?.data || [];
                setAllData(data);
                setPartnerData(data);
            } else {
                // alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };
    const navigate = useNavigate();

    const handleUserClick = (userId) => {
        navigate(`/dashboard/UserDetails`, { state: { userId } });
    };


    const columns = [
        {
            name: "Date & Time",
            selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"),
            sortable: true,
            wrap: true,
        },
        {
            name: "Full Name",
            selector: (row) => row.fullName || "---",
            sortable: true,
            wrap: true,
        },

        {
            name: "Mobile Number",
            selector: (row) => row.mobileNumber || "---",
            sortable: true,
            wrap: true,
        },
        {
            name: "User Id",
            wrap: true,
            width: "160px",
            selector: (row) => (
                <div className="d-flex align-items-center gap-1">
                    <button type="button" onClick={() => handleUserClick(row?._id)} className="btn btn-link p-0 text-decoration-none" style={{ color: "#0d9488", fontWeight: 600, cursor: "pointer" }}>{row?.uuid || "------"}</button>
                    <button type="button" className="btn btn-sm p-1 rounded" style={{ background: "#f1f5f9", color: "#64748b" }} onClick={() => { if (row?.uuid) { navigator?.clipboard?.writeText(row?.uuid); alertSuccessMessage("UUID copied!"); } else { alertErrorMessage("No UUID found"); } }}><i className="far fa-copy" /></button>
                </div>
            ),
        },
        {
            name: "Users Count",
            selector: (row) => row.noOfUserHave || "0",
            sortable: true,
            wrap: true,
        },
        {
            name: "Description",
            selector: (row) => row.description || "---",
            wrap: true,
        },
        {
            name: "Actions",
            width: "200px",
            cell: (row) => {
                const isInactiveRejected =
                    row.status === "INACTIVE" && row.approvalStatus === "REJECTED";
                const isActiveApproved =
                    row.status === "ACTIVE" && row.approvalStatus === "APPROVED";
                const isPendingInactive =
                    row.status === "INACTIVE" && row.approvalStatus === "PENDING";

                return (
                    <div className="d-flex gap-2 flex-wrap">
                        {isPendingInactive ? (
                            <>
                                <button type="button" className="btn btn-sm rounded-pill border-0 px-3" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 600 }} onClick={() => handleStatusUpdate(row._id, "APPROVED")}>Approve</button>
                                <button type="button" className="btn btn-sm rounded-pill border-0 px-3" style={{ background: "#dc2626", color: "#fff", fontWeight: 600 }} onClick={() => handleStatusUpdate(row._id, "REJECTED")}>Reject</button>
                            </>
                        ) : isInactiveRejected ? (
                            <button type="button" className="btn btn-sm rounded-pill border-0 px-3" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 600 }} onClick={() => handleStatusUpdate(row._id, "APPROVED")}>Approve</button>
                        ) : isActiveApproved ? (
                            <button type="button" className="btn btn-sm rounded-pill border-0 px-3" style={{ background: "#dc2626", color: "#fff", fontWeight: 600 }} onClick={() => handleStatusUpdate(row._id, "REJECTED")}>Reject</button>
                        ) : (
                            <span className="text-muted">--</span>
                        )}
                    </div>
                );
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },

    ];

    const handleStatusUpdate = async (id, status) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.updatePartnerStatus(id, status);
            if (result?.success) {
                alertSuccessMessage(`Partner ${status} successfully`);
                setPartnerData(prev =>
                    prev.filter(item => item?._id !== id)
                );
                setAllData(prev => prev?.filter(item => item?._id !== id));
                handlepartnerData();
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };


    function searchObjects(e) {
        const keysToSearch = ["userId.fullName", "utrNumber", "amount"];
        const userInput = e.target.value;
        const searchTerm = userInput?.toLowerCase();
        if (!searchTerm) {
            setPartnerData(allData);
            return;
        }

        const matchingObjects = allData?.filter((obj) => {
            return keysToSearch.some((key) => {
                const value = key.split(".").reduce((acc, k) => acc?.[k], obj);
                return value?.toString()?.toLowerCase()?.includes(searchTerm);
            });
        });

        setPartnerData(matchingObjects);
    }

    return (
        <div className="dashboard_right">
            <UserHeader />
            <div className="dashboard_outer_s">
                <div className="mb-4">
                    <div className="rounded-4 overflow-hidden border-0 p-4 p-md-5" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)", boxShadow: "0 16px 48px rgba(13,148,136,0.25)" }}>
                        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                            <div>
                                <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>All Partners List</h1>
                                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>Manage partner applications and status</p>
                            </div>
                            <div className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white" style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}><i className="fas fa-handshake fa-lg" /></div>
                        </div>
                    </div>
                </div>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ borderLeft: "4px solid #0d9488" }}>
                    <div className="card-header bg-white border-0 py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <h5 className="mb-0 fw-semibold text-dark">Partners List</h5>
                        <div className="d-flex align-items-center position-relative" style={{ maxWidth: "280px" }}>
                            <i className="fas fa-search position-absolute ms-3 text-secondary" style={{ fontSize: "0.9rem" }} />
                            <input type="search" className="form-control form-control-sm ps-4 rounded-pill border" placeholder="Search here..." name="search" onChange={searchObjects} />
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <DataTableBase columns={columns} data={partnerData.length ? partnerData : allData} pagination />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Partner