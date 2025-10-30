import React, { useEffect, useState } from 'react';
import UserHeader from '../../Layout/UserHeader';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage } from '../../Utils/CustomAlertMessage';
import moment from 'moment';
import DataTableBase from '../../Utils/DataTable';

function AllGameList() {
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('RUNNING');

    // Individual states to store data
    const [completeLudoData, setcompleteLudoData] = useState([]);
    const [runningGameData, setRunningGameData] = useState([]);
    const [expiredGameData, setExpiredGameData] = useState([]);
    const [openBattleData, setOpenBattleData] = useState([]);
    const [disputeGameData, setDisputeGameData] = useState([]);

    const getUserName = (row) => {
        if (row?.joinedBy?.fullName) return row.joinedBy.fullName;
        if (row?.createdBy?.fullName) return row.createdBy.fullName;
        if (typeof row?.joinedBy === "string") return row.joinedBy;
        if (typeof row?.createdBy === "string") return row.createdBy;
        return '—';
    };

    const commonColumns = [
        { name: 'Date & Time', selector: row => moment(row.createdAt).format('DD-MM-YYYY LT'), sortable: true, wrap: true },
        { name: 'Battle Id', selector: row => row?.eventUniqueId || row?.eventUniqueId || '—', sortable: true, wrap: true },
        { name: 'Creator Name', selector: row => row?.createdBy?.fullName || row?.createdBy || '—', sortable: true, wrap: true },
        { name: 'Joiner Name', selector: row => row?.joinedBy?.fullName || row?.joinedBy || '—', sortable: true, wrap: true },
        { name: 'Winner Name', selector: row => row?.winnerId?.fullName || row?.winnerId || '—', sortable: true, wrap: true },
        { name: 'Joiner Name', selector: row => row?.loserId?.fullName || row?.loserId || '—', sortable: true, wrap: true },
        { name: 'Cancel User One', selector: row => row?.cancelUserOne?.fullName || row?.cancelUserOne || '—', sortable: true, wrap: true },
        { name: 'Cancel User One', selector: row => row?.cancelUserTwo?.fullName || row?.cancelUserTwo || '—', sortable: true, wrap: true },
        { name: 'Total Bet', selector: row => `₹ ${(row?.amount) || 0}/per user`, sortable: true, wrap: true },
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

        switch (filterStatus) {
            case 'COMPLETED':
                currentData = completeLudoData;
                break;
            case 'RUNNING':
                currentData = runningGameData;
                break;
            case 'EXPIRED':
                currentData = expiredGameData;
                break;
            case 'WAITING':
                currentData = openBattleData;
                break;
            case 'DISPUTE':
                currentData = disputeGameData;
                break;
            case 'CANCELLED':
                currentData = []; // implement if needed
                break;
            case 'ALL':
            default:
                currentData = [
                    ...completeLudoData,
                    ...runningGameData,
                    ...expiredGameData,
                    ...openBattleData,
                    ...disputeGameData
                ];
        }

        if (searchTerm) {
            currentData = currentData.filter(item =>
                getUserName(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item?.utrNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item?.roomCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item?.amount?.toString() || '').includes(searchTerm)
            );
        }

        setFilteredData(currentData);
    }, [filterStatus, searchTerm, completeLudoData, runningGameData, expiredGameData, openBattleData, disputeGameData]);

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
                                    placeholder="Search by user, UTR, amount..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-2 mobilep">
                        <DataTableBase columns={commonColumns} data={filteredData} pagination />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllGameList;
