import React, { useEffect, useState } from 'react';
import UserHeader from '../../Layout/UserHeader';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import { alertErrorMessage } from '../../Utils/CustomAlertMessage';
import AuthService from '../../Api/Api_Services/AuthService';
import DataTableBase from '../../Utils/DataTable';

function DepostiWithdraSummary() {
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalData, setTotalData] = useState(0);



    useEffect(() => {
        handleUserBalData();
    }, []);


    const handleUserBalData = async (page, pageSize) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.depositWithdraList(page, pageSize);
            if (result?.success) {
                setUserList(result?.data || []);
                setTotalData(result?.pagination?.totalUsers || 0);
                setCurrentPage(result?.pagination?.currentPage || page);
                setItemsPerPage(result?.pagination?.pageSize || pageSize);
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
            const filteredData = userList.filter(item => {
                const email = String(item?.email || "").toLowerCase();
                const userId = String(item?.userId || "");
                const fullName = String(item?.fullName || "").toLowerCase();
                const totalDeposit = String(item?.totalDeposit || "");
                const totalWithdrawal = String(item?.totalWithdrawal || "");
                return (
                    email.includes(value.toLowerCase()) ||
                    userId.includes(value) ||
                    fullName.includes(value.toLowerCase()) ||
                    totalDeposit.includes(value) ||
                    totalWithdrawal.includes(value)
                );
            });

            setUserList(filteredData);
        } else {
            handleUserBalData(currentPage, itemsPerPage);
        }
    };

    const columns = [
        {
            name: "Sr. No.",
            selector: (row, index) => (currentPage - 1) * itemsPerPage + (index + 1),
            width: "80px"
        },
        { name: 'User Id', selector: row => row?.userId || '—', sortable: true, wrap: true },
        { name: 'Full Name', selector: row => row?.fullName || '—', sortable: true, wrap: true },
        { name: 'Email', selector: row => row?.email || '—', sortable: true, wrap: true, width: '200px' },
        { name: 'Total Deposit', selector: row => row?.totalDeposit || '—', sortable: true, wrap: true },
        { name: 'Total Withdrawal', selector: row => row?.totalWithdrawal || '—', sortable: true, wrap: true },
        { name: 'Net', selector: row => row?.net || '—', sortable: true, wrap: true },
    ];

    return (
        <div className="dashboard_right">
            <UserHeader />
            <div className="dashboard_outer_s">
                <h2>Deposit Withdrawal List</h2>
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
                    <div className="card-body">
                      
                            <DataTableBase columns={columns} data={userList} pagination />
                        </div>
                    
                </div>
            </div>
        </div>
    );
}

export default DepostiWithdraSummary;
