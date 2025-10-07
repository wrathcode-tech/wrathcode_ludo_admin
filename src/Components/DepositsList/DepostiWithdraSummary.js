import React, { useEffect, useState } from 'react';
import UserHeader from '../../Layout/UserHeader';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import AuthService from '../../Api/Api_Services/AuthService';
import ReactPaginate from 'react-paginate';
import copy from "copy-to-clipboard";
import DataTableBase from '../../Utils/DataTable';

function DepostiWithdraSummary() {
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalData, setTotalData] = useState(0);


    const copyUserId = (row) => {
        copy(row.userId);
        alertSuccessMessage("User ID copied!!");
    };
    const pageCount = Math.ceil(totalData / itemsPerPage);

    useEffect(() => {
        handleUserBalData(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    // const pageCount = Math.ceil(totalData / itemsPerPage);


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
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1); // kyunki selected 0-based hota hai
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (value) {
            const filteredData = userList.filter(item =>
                (item?.email || '').toLowerCase().includes(value.toLowerCase()) ||
                (item?.userId || '').includes(value)
            );
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

    // ✅ ReactPaginate gives { selected: number }
    // const handlePageChange = ({ selected }) => {
    //     setCurrentPage(selected + 1); // because selected is 0-based
    // };

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
                        <div className="table-responsive" width="100%">
                            <DataTableBase columns={columns} data={userList} pagination={false} />
                        </div>
                        <div className="align-items-center mt-3 d-flex justify-content-between">
                            <div className="pl_row d-flex justify-content-start gap-3 align-items-center perpage_list">
                                <label htmlFor="rowsPerPage">Rows per page: </label>
                                <select
                                    className="form-select form-select-sm my-0"
                                    id="rowsPerPage"
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        const newSize = Number(e.target.value);
                                        setItemsPerPage(newSize);
                                        setCurrentPage(1);
                                        handleUserBalData(1, newSize); // 👈 force reload with new size
                                    }}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                            <ReactPaginate
                                pageCount={pageCount}
                                onPageChange={handlePageChange}
                                forcePage={currentPage - 1} // keep paginate in sync with currentPage
                                containerClassName={'customPagination'}
                                activeClassName={'active'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DepostiWithdraSummary;
