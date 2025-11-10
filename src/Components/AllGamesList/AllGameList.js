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
            selector: (row) => {
                const createdUuid = row?.createdBy?.uuid;
                const joinedUuid = row?.joinedBy?.uuid;

                return (
                    <div>
                        {/* Created By */}
                        <div className="mb-1">
                            <strong>Created By:</strong>
                            <div className="d-flex align-items-center mt-1">
                                <button
                                    onClick={() => handleUserClick(createdUuid)}
                                    className="btn p-0 text-primary"
                                    style={{ cursor: "pointer" }}
                                >
                                    {createdUuid || "—"}
                                </button>
                                <div
                                    className="mx-2"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        if (createdUuid) {
                                            navigator?.clipboard?.writeText(createdUuid);
                                            alertSuccessMessage("UUID copied!");
                                        } else {
                                            alertErrorMessage("No UUID found");
                                        }
                                    }}
                                >
                                    <i className="far fa-copy" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>

                        {/* Joined By */}
                        {joinedUuid && (
                            <div>
                                <strong>Joined By:</strong>
                                <div className="d-flex align-items-center mt-1">
                                    <button
                                        onClick={() => handleUserClick(joinedUuid)}
                                        className="btn p-0 text-primary"
                                        style={{ cursor: "pointer" }}
                                    >
                                        {joinedUuid}
                                    </button>
                                    <div
                                        className="mx-2"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            navigator?.clipboard?.writeText(joinedUuid);
                                            alertSuccessMessage("UUID copied!");
                                        }}
                                    >
                                        <i className="far fa-copy" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            },
        },



        { name: 'Creator Name', selector: row => row?.createdBy?.fullName || row?.createdBy || '—', sortable: true, wrap: true },
        { name: 'Joiner Name', selector: row => row?.joinedBy?.fullName || row?.joinedBy || '—', sortable: true, wrap: true },
        { name: 'Winner Name', selector: row => row?.winnerId?.fullName || row?.winnerId || '—', sortable: true, wrap: true },
        { name: 'Joiner Name', selector: row => row?.loserId?.fullName || row?.loserId || '—', sortable: true, wrap: true },
        { name: 'Cancel User One', width: '150px', selector: row => row?.cancelUserOne?.fullName || row?.cancelUserOne || '—', sortable: true, wrap: true },
        { name: 'Cancel User Two', width: '150px', selector: row => row?.cancelUserTwo?.fullName || row?.cancelUserTwo || '—', sortable: true, wrap: true },
        { name: 'Total Bet', selector: row => `₹ ${(row?.amount) || 0}`, sortable: true, wrap: true },
        { name: 'Wallet Type', selector: row => row?.walletType || '—', sortable: true, wrap: true },
        {
            name: 'Status',
            selector: row => row?.status || '—',
            cell: row => <span style={{ color: '#1eb5c0' }}>{row?.status || '—'}</span>,
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
                <h2>All Ludo Games List</h2>
                <div className="dashboard_detail_s user_list_table user_summary_t">
                    <div className="user_list_top d-flex justify-content-between align-items-center">
                        <h4>All Ludo Games</h4>

                        <div className='d-flex gap-2 align-center'>
                            <div className='select_option'>
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                    <option value="ALL">All</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="RUNNING">Running</option>
                                    <option value="EXPIRED">Expired</option>
                                    <option value="WAITING">Waiting</option>
                                    <option value="DISPUTE">Dispute</option>
                                </select>
                            </div>

                            <div className="user_search">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-2 mobilep">
                        <DataTableBase
                            columns={commonColumns}
                            data={filteredData}
                            pagination
                            paginationServer={false}
                            paginationPerPage={rowsPerPage}
                            paginationDefaultPage={currentPage}
                            onChangePage={page => setCurrentPage(page)}
                            onChangeRowsPerPage={(newPerPage, page) => {
                                setRowsPerPage(newPerPage);
                                setCurrentPage(page);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllGameList;
