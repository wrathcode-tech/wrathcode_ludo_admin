import React, { useEffect, useState } from 'react';
import UserHeader from '../../Layout/UserHeader';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage } from '../../Utils/CustomAlertMessage';
import { imageUrl } from '../../Api/Api_Config/ApiEndpoints';
import moment from 'moment';
import DataTableBase from '../../Utils/DataTable';

function AllGameList() {
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const getUserName = (row) => row?.userId?.fullName || row?.joinedBy || row?.createdBy || '—';

    const commonColumns = [
        { name: 'Created At', selector: row => moment(row.createdAt).format('DD-MM-YYYY LT'), sortable: true, wrap: true },
        { name: 'User Name', selector: getUserName, sortable: true, wrap: true },
        { name: 'Amount', selector: row => `₹ ${row?.amount || 0}`, sortable: true, wrap: true },
        { name: 'UTR Number', selector: row => row?.utrNumber || '—', sortable: true, wrap: true },
        {
            name: 'Payment Proof',
            cell: row => row?.paymentProof ? (
                <a href={imageUrl + row.paymentProof} target="_blank" rel="noopener noreferrer">
                    <img src={imageUrl + row.paymentProof} alt="proof" style={{ width: 50, height: 50 }} />
                </a>
            ) : '—',
        },
        {
            name: 'Status',
            selector: row => row?.status || '—',
            cell: row => <span style={{ color: '#1eb5c0' }}>{row?.status || '—'}</span>,
            sortable: true,
            wrap: true,
        },
    ];

    // Function to fetch API based on status
    const fetchByStatus = async (status) => {
        try {
            LoaderHelper.loaderStatus(true);
            let result;
            switch (status) {
                case 'COMPLETED':
                    result = await AuthService?.allCompletedLudoGameList();
                    break;
                case 'CANCELLED':
                    result = await AuthService?.allCancelLudoGameList();
                    break;
                case 'RUNNING':
                    result = await AuthService?.allRunningLudoGameList();
                    break;
                case 'EXPIRED':
                    result = await AuthService?.allExpiredLudoGameList();
                    break;
                case 'WAITING':
                    result = await AuthService?.allWaitingLudoGameList();
                    break;
                case 'DISPUTE':
                    result = await AuthService?.allDisputeLudoGameList();
                    break;
                case 'ALL':
                    // If ALL, combine all lists
                    const [
                        completed,
                        cancelled,
                        running,
                        expired,
                        waiting,
                        dispute
                    ] = await Promise.all([
                        AuthService.allCompletedLudoGameList(),
                        AuthService.allCancelLudoGameList(),
                        AuthService.allRunningLudoGameList(),
                        AuthService.allExpiredLudoGameList(),
                        AuthService.allWaitingLudoGameList(),
                        AuthService.allDisputeLudoGameList()
                    ]);
                    result = {
                        success: true, data: [
                            ...completed.data,
                            ...cancelled.data,
                            ...running.data,
                            ...expired.data,
                            ...waiting.data,
                            ...dispute.data
                        ]
                    };
                    break;
                default:
                    result = { success: true, data: [] };
            }

            if (result?.success) {
                setAllData(result.data);
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    // Call API whenever filterStatus changes
    useEffect(() => {
        fetchByStatus(filterStatus);
    }, [filterStatus]);

    // Filter & Search
    useEffect(() => {
        if (!searchTerm) {
            setFilteredData(allData);
            return;
        }
        const tempData = allData.filter(item =>
            getUserName(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item?.utrNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item?.roomCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item?.amount?.toString() || '').includes(searchTerm)
        );
        setFilteredData(tempData);
    }, [searchTerm, allData]);

    return (
        <div className="dashboard_right">
            <UserHeader />
            <div className="dashboard_outer_s">
                <h2>All Ludo Games List</h2>
                <div className="dashboard_detail_s user_list_table user_summary_t">
                    <div className="user_list_top d-flex justify-content-between align-items-center">
                        <h4>All Ludo Games</h4>
                        <div className="user_search d-flex gap-2">
                            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                <option value="ALL">All</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="RUNNING">Running</option>
                                <option value="EXPIRED">Expired</option>
                                <option value="WAITING">Waiting</option>
                                <option value="DISPUTE">Dispute</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search by user, UTR, amount..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
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
