import React, { useEffect, useState } from 'react';
import UserHeader from '../../Layout/UserHeader';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import moment from 'moment';
import DataTableBase from '../../Utils/DataTable';
import { useNavigate } from 'react-router-dom';

function AllGameList() {
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    // Individual states to store data
    const [completeLudoData, setcompleteLudoData] = useState([]);
    const [runningGameData, setRunningGameData] = useState([]);
    const [expiredGameData, setExpiredGameData] = useState([]);
    const [openBattleData, setOpenBattleData] = useState([]);
    const [disputeGameData, setDisputeGameData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // const getUserName = (row) => {
    //     if (row?.joinedBy?.fullName) return row.joinedBy.fullName;
    //     if (row?.createdBy?.fullName) return row.createdBy.fullName;
    //     if (typeof row?.joinedBy === "string") return row.joinedBy;
    //     if (typeof row?.createdBy === "string") return row.createdBy;
    //     return '—';
    // };
    const navigate = useNavigate();
    const handleUserClick = (userId) => {
        navigate(`/dashboard/UserDetails`, { state: { userId } });
    };


    const commonColumns = [
        {
            name: 'Sr No.',
            cell: (row, rowIndex) => rowIndex + 1 + (currentPage - 1) * rowsPerPage,
            wrap: true, width: "80px"
        },
        { name: 'Date & Time', selector: row => moment(row.createdAt).format('DD-MM-YYYY LT'), sortable: true, wrap: true },

        { name: 'Battle Id', selector: row => row?.eventUniqueId || row?.eventUniqueId || '—', sortable: true, wrap: true },
        {
            name: "User Id (CreatedBy / JoinedBy)",
            wrap: true,
            width: "220px",
            cell: (row) => {
                const createdUuid = row?.createdBy?.uuid;
                const joinedUuid = row?.joinedBy?.uuid;
                return (
                    <div className="small">
                        <div className="mb-1 d-flex align-items-center gap-2">
                            <span className="text-muted">Created:</span>
                            <button type="button" onClick={() => handleUserClick(row?.createdBy?.id)} className="btn btn-link p-0 text-decoration-none fw-semibold" style={{ color: "#0d9488", cursor: "pointer", fontSize: "inherit" }}>{createdUuid || "—"}</button>
                            <button type="button" className="btn btn-link p-0 text-secondary" style={{ cursor: "pointer" }} onClick={() => { if (createdUuid) { navigator?.clipboard?.writeText(createdUuid); alertSuccessMessage("UUID copied!"); } else alertErrorMessage("No UUID found"); }}><i className="far fa-copy" /></button>
                        </div>
                        {joinedUuid && (
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-muted">Joined:</span>
                                <button type="button" onClick={() => handleUserClick(row?.joinedBy?.id)} className="btn btn-link p-0 text-decoration-none fw-semibold" style={{ color: "#0d9488", cursor: "pointer", fontSize: "inherit" }}>{joinedUuid}</button>
                                <button type="button" className="btn btn-link p-0 text-secondary" style={{ cursor: "pointer" }} onClick={() => { navigator?.clipboard?.writeText(joinedUuid); alertSuccessMessage("UUID copied!"); }}><i className="far fa-copy" /></button>
                            </div>
                        )}
                    </div>
                );
            },
        },



        { name: 'Creator Name', selector: row => row?.createdBy?.name?.trim() || row?.createdBy?.fullName?.trim() || '—', sortable: true, wrap: true },
        { name: 'Joiner Name', selector: row => row?.joinedBy?.name?.trim() || row?.joinedBy?.fullName?.trim() || '—', sortable: true, wrap: true },
        { name: 'Winner Name', selector: row => row?.winnerId?.name?.trim() || row?.winnerId?.fullName?.trim() || '—', sortable: true, wrap: true },
        { name: 'Joiner Name', selector: row => row?.loserId?.name?.trim() || row?.loserId?.fullName?.trim() || '—', sortable: true, wrap: true },
        { name: 'Cancel User One', width: '150px', selector: row => row?.cancelUserOne?.name?.trim() || row?.cancelUserOne?.fullName?.trim() || '—', sortable: true, wrap: true },
        { name: 'Cancel User Two', width: '150px', selector: row => row?.cancelUserTwo?.name?.trim() || row?.cancelUserTwo?.fullName?.trim() || '—', sortable: true, wrap: true },
        { name: 'Total Bet', selector: row => `₹ ${(row?.amount) || 0}`, sortable: true, wrap: true },
        { name: 'Wallet Type', selector: row => row?.walletType || '—', sortable: true, wrap: true },
        {
            name: 'Status',
            width: '110px',
            cell: (row) => {
                const s = row?.status || "—";
                const colors = { COMPLETED: "linear-gradient(135deg, #22c55e, #16a34a)", RUNNING: "#0d9488", EXPIRED: "#64748b", WAITING: "#f59e0b", DISPUTE: "#dc2626", CANCELLED: "#94a3b8" };
                return (<span className="badge rounded-pill border-0" style={{ fontSize: "0.7rem", fontWeight: 600, background: colors[s] || "#f1f5f9", color: "#fff" }}>{s}</span>);
            },
            sortable: true,
            wrap: true,
        },
    ];

    // Lazy fetch per filter to avoid unnecessary API calls
    useEffect(() => {
        const fetchByStatus = async () => {
            try {
                LoaderHelper.loaderStatus(true);
                if (filterStatus === 'COMPLETED' && completeLudoData.length === 0) {
                    const res = await AuthService.allCompletedLudoGameList();
                    if (res?.success) setcompleteLudoData(res.data || []);
                } else if (filterStatus === 'RUNNING' && runningGameData.length === 0) {
                    const res = await AuthService.allRunningLudoGameList();
                    if (res?.success) setRunningGameData(res.data || []);
                } else if (filterStatus === 'EXPIRED' && expiredGameData.length === 0) {
                    const res = await AuthService.allExpiredLudoGameList();
                    if (res?.success) setExpiredGameData(res.data || []);
                } else if (filterStatus === 'WAITING' && openBattleData.length === 0) {
                    const res = await AuthService.allWaitingLudoGameList();
                    if (res?.success) setOpenBattleData(res.data || []);
                } else if (filterStatus === 'DISPUTE' && disputeGameData.length === 0) {
                    const res = await AuthService.allDisputeLudoGameList();
                    if (res?.success) setDisputeGameData(res.data || []);
                } else if (filterStatus === 'ALL') {
                    // If user explicitly selects ALL, fetch only missing sets
                    if (completeLudoData.length === 0) {
                        const r = await AuthService.allCompletedLudoGameList();
                        if (r?.success) setcompleteLudoData(r.data || []);
                    }
                    if (runningGameData.length === 0) {
                        const r = await AuthService.allRunningLudoGameList();
                        if (r?.success) setRunningGameData(r.data || []);
                    }
                    if (expiredGameData.length === 0) {
                        const r = await AuthService.allExpiredLudoGameList();
                        if (r?.success) setExpiredGameData(r.data || []);
                    }
                    if (openBattleData.length === 0) {
                        const r = await AuthService.allWaitingLudoGameList();
                        if (r?.success) setOpenBattleData(r.data || []);
                    }
                    if (disputeGameData.length === 0) {
                        const r = await AuthService.allDisputeLudoGameList();
                        if (r?.success) setDisputeGameData(r.data || []);
                    }
                }
            } catch (error) {
                alertErrorMessage(error?.message);
            } finally {
                LoaderHelper.loaderStatus(false);
            }
        };
        fetchByStatus();
    }, [filterStatus]);

    // Update table when filterStatus or searchTerm changes
    useEffect(() => {
        let currentData = [];

        // Merge all data sets according to selected filter
        switch (filterStatus) {
            case "COMPLETED":
                currentData = completeLudoData;
                break;
            case "RUNNING":
                currentData = runningGameData;
                break;
            case "EXPIRED":
                currentData = expiredGameData;
                break;
            case "WAITING":
                currentData = openBattleData;
                break;
            case "DISPUTE":
                currentData = disputeGameData;
                break;
            case "CANCELLED":
                currentData = []; // Implement if needed
                break;
            case "ALL":
            default:
                currentData = [
                    ...completeLudoData,
                    ...runningGameData,
                    ...expiredGameData,
                    ...openBattleData,
                    ...disputeGameData,
                ];
        }

        // 🔍 Search logic — matches in *any relevant field*
        if (searchTerm) {
            const term = searchTerm.toLowerCase();

            currentData = currentData.filter((item) => {
                return (
                    (item?.createdBy?.fullName || "")
                        .toLowerCase()
                        .includes(term) ||
                    (item?.joinedBy?.fullName || "")
                        .toLowerCase()
                        .includes(term) ||
                    (item?.winnerId?.fullName || "")
                        .toLowerCase()
                        .includes(term) ||
                    (item?.loserId?.fullName || "")
                        .toLowerCase()
                        .includes(term) ||
                    (item?.cancelUserOne?.fullName || "")
                        .toLowerCase()
                        .includes(term) ||
                    (item?.cancelUserTwo?.fullName || "")
                        .toLowerCase()
                        .includes(term) ||
                    (item?.eventUniqueId || "")
                        .toLowerCase()
                        .includes(term) ||
                    (item?.roomCode || "")
                        .toLowerCase()
                        .includes(term) ||
                    (item?.utrNumber || "")
                        .toLowerCase()
                        .includes(term) ||
                    (item?.walletType || "")
                        .toLowerCase()
                        .includes(term) ||
                    (item?.status || "")
                        .toLowerCase()
                        .includes(term) ||
                    (item?.amount?.toString() || "")
                        .includes(term)
                );
            });
        }

        setFilteredData(currentData);
    }, [
        filterStatus,
        searchTerm,
        completeLudoData,
        runningGameData,
        expiredGameData,
        openBattleData,
        disputeGameData,
    ]);


    return (
        <div className="dashboard_right">
            <UserHeader />
            <div className="dashboard_outer_s">
                <div className="mb-4">
                    <div className="rounded-4 overflow-hidden border-0 p-4 p-md-5" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)", boxShadow: "0 16px 48px rgba(13,148,136,0.25)" }}>
                        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                            <div>
                                <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>All Ludo Games List</h1>
                                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>View and filter games by status</p>
                            </div>
                            <div className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white" style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}><i className="fas fa-gamepad fa-lg" /></div>
                        </div>
                    </div>
                </div>
                <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #6366f1" }}>
                    <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.08) 0%, transparent 100%)" }}>
                        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 flex-wrap">
                            <h3 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                                <span className="rounded-3 d-inline-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff" }}><i className="fas fa-list" /></span>
                                All Ludo Games
                            </h3>
                            <div className="d-flex gap-2 align-items-center flex-wrap">
                                <select className="form-select rounded-3 border" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ maxWidth: "160px", padding: "0.5rem 0.75rem" }}>
                                    <option value="ALL">All</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="RUNNING">Running</option>
                                    <option value="EXPIRED">Expired</option>
                                    <option value="WAITING">Waiting</option>
                                    <option value="DISPUTE">Dispute</option>
                                </select>
                                <div className="d-flex align-items-center rounded-3 border overflow-hidden" style={{ background: "#f8fafc", maxWidth: "220px" }}>
                                    <span className="px-3 py-2 text-muted"><i className="fas fa-search" style={{ color: "#0d9488" }} /></span>
                                    <input type="text" className="form-control border-0 bg-transparent py-2" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ fontSize: "0.9rem" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <DataTableBase columns={commonColumns} data={filteredData} pagination paginationServer={false} paginationPerPage={rowsPerPage} paginationDefaultPage={currentPage} onChangePage={(page) => setCurrentPage(page)} onChangeRowsPerPage={(newPerPage, page) => { setRowsPerPage(newPerPage); setCurrentPage(page); }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllGameList;
