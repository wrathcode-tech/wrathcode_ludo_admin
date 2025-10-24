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
    const [filterStatus, setFilterStatus] = useState('ALL');

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

    // Fetch all APIs once on component mount
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                LoaderHelper.loaderStatus(true);

                const [completed, running, expired, waiting, dispute] = await Promise.all([
                    AuthService.allCompletedLudoGameList(),
                    AuthService.allRunningLudoGameList(),
                    AuthService.allExpiredLudoGameList(),
                    AuthService.allWaitingLudoGameList(),
                    AuthService.allDisputeLudoGameList()
                ]);

                if (completed?.success) setcompleteLudoData(completed.data);
                if (running?.success) setRunningGameData(running.data);
                if (expired?.success) setExpiredGameData(expired.data);
                if (waiting?.success) setOpenBattleData(waiting.data);
                if (dispute?.success) setDisputeGameData(dispute.data);

                // Initially show ALL data
                setFilteredData([
                    ...(completed?.data || []),
                    ...(running?.data || []),
                    ...(expired?.data || []),
                    ...(waiting?.data || []),
                    ...(dispute?.data || [])
                ]);

            } catch (error) {
                alertErrorMessage(error?.message);
            } finally {
                LoaderHelper.loaderStatus(false);
            }
        };

        fetchAllData();
    }, []);

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
