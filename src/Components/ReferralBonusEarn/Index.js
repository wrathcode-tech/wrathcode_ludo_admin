import React, { useEffect, useState } from 'react';
import UserHeader from '../../Layout/UserHeader';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import { alertErrorMessage } from '../../Utils/CustomAlertMessage';
import AuthService from '../../Api/Api_Services/AuthService';
import DataTableBase from '../../Utils/DataTable';

function OverAllReferralEarnList() {
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        fetchDepositWithdrawList(currentPage, perPage);
    }, [currentPage, perPage]);

    const fetchDepositWithdrawList = async (page, pageSize) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.usersOverAllReferalBonusEarn({ page, pageSize });
            if (result?.success) {
                setUserList(result.data || []);
                setTotalRows(result.pagination.totalUsers || 0);
                setPerPage(result.pagination.pageSize || pageSize);
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (value) {
            const filteredData = userList.filter(item =>
                (item?.emailId || '').toLowerCase().includes(value.toLowerCase()) ||
                (item?.userId || '').includes(value)
            );
            setUserList(filteredData);
        } else {
            fetchDepositWithdrawList(currentPage, perPage);
        }
    };

    const Columns = [
        {
            name: 'S.No',
            width: '80px',
            selector: (row, index) => index + 1 + (currentPage - 1) * perPage,
            sortable: true,
            wrap: true
        },
        { name: 'User Id', selector: row => row?.userId || '—', sortable: true, wrap: true },
        { name: 'Full Name', selector: row => row?.fullName || '—', sortable: true, wrap: true },
        { name: 'Email', selector: row => row?.email || '—', sortable: true, wrap: true, width: '200px' },
        { name: 'Total Credits', selector: row => row?.totalCredit || '—', sortable: true, wrap: true },
        { name: 'Total Dabits', selector: row => row?.totalDebit || '—', sortable: true, wrap: true },
        { name: 'Net Balance', selector: row => row?.netBalance || '—', sortable: true, wrap: true },
    ];

    const handlePageChange = (page) => setCurrentPage(page);
    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    return (
        <div className="dashboard_right">
            <UserHeader />
            <div className="dashboard_outer_s">
                <h2>All Referrals Bonus List</h2>
                <div className="dashboard_detail_s user_list_table user_summary_t">
                    <div className="user_list_top">
                        <div className="user_search">
                            <button><img src="/images/search_icon.svg" alt="search" /></button>
                            <input
                                type="search"
                                placeholder="Search User"
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                        <DataTableBase columns={Columns} data={userList} pagination />
                  
                </div>
            </div>
        </div>
    );
}

export default OverAllReferralEarnList;
