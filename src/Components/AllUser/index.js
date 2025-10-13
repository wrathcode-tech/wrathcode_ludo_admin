import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import moment from 'moment';
// import ReactPaginate from 'react-paginate';
import DataTableBase from '../../Utils/DataTable';
import { useNavigate } from 'react-router-dom';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
// import copy from 'copy-to-clipboard';

function AllUserList() {

    const [userList, setUserList] = useState([]);
    const [allData, setAllData] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalData, setTotalData] = useState(0);




    const pageCount = Math.ceil(totalData / itemsPerPage);

    useEffect(() => {
        handleUsersList(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);


    const handleUsersList = async (page, pageSize) => {

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.usersList(page, pageSize);
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

    const handleStatusUpdate = async (id, status) => {

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.usersStatusUpdate(id, status);
            if (result?.success) {
                handleUsersList()

            } else {
                alertErrorMessage(result?.message);
            }

        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    useEffect(() => {
        if (search) {
            let filterdData = userList?.filter((item) => item?.emailId?.toLowerCase()?.includes(search?.toLowerCase()) || item?.uId?.includes(search));
            setUserList(filterdData)
        } else {
            setUserList(allData)
        }
    }, [search]);

    useEffect(() => {
        handleUsersList()
    }, []);

    const navigate = useNavigate();

    const handleUserClick = (userId) => {
        navigate(`/dashboard/UserDetails`, { state: { userId } });
    };
    const columns = [
        {
            name: "Sr. No.",
            selector: (row, index) => (currentPage - 1) * itemsPerPage + (index + 1),
            width: "80px"
        },
        {
            name: 'Created At',
            selector: row => moment(row.createdAt).format('DD-MM-YYYY LT'),
            sortable: true,
            wrap: true
        },
        {
            name: "User ID",
            wrap: true,
            width: "160px",
            selector: (row) => (
                <div className="d-flex align-items-center ">
                    <button
                        onClick={() => handleUserClick(row?._id)}
                        className="btn p-0 text-primary"
                        style={{ cursor: "pointer" }}
                    >
                        {row?.uuid || "------"}
                    </button>
                    <div className="mx-2 " style={{ cursor: "pointer" }}
                        onClick={() => {
                            if (row?.uuid) {
                                navigator?.clipboard?.writeText(row?.uuid);
                                alertSuccessMessage("UUID copied!");
                            } else {
                                alertErrorMessage("No UUID found");
                            }
                        }}
                    >
                        <i className="far fa-copy" aria-hidden="true"></i>
                    </div>
                </div>
            ),
        },

        {
            name: 'Full Name',
            selector: row => row?.fullName || '—',
            sortable: true,
            wrap: true
        },
        {
            name: 'Email', width: '200px',
            selector: row => row?.emailId || '—',
            sortable: true,
            wrap: true
        },
        {
            name: 'KYC Status',
            selector: row => row?.kycVerified || '—',
            cell: row => (
                <span style={{ color: row?.kycVerified === 'APPROVED' ? 'green' : 'red' }}>
                    {row?.kycVerified || '—'}
                </span>
            ),
            sortable: true,
            wrap: true
        },
        {
            name: 'Rank',
            selector: row => row?.rank || '—',
            sortable: true,
            wrap: true
        },
        {
            name: 'Total Referrals',
            selector: row => row?.totalRefer || 0,
            sortable: true,
            wrap: true
        },
        {
            name: 'Status',
            selector: row => row?.status || '—',
            cell: row => (
                <span style={{ color: row?.status === 'ACTIVE' ? 'green' : 'red' }}>
                    {row?.status || '—'}
                </span>
            ),
            sortable: true,
            wrap: true
        },
    ];

    return (
        <>
            <div class="dashboard_right">
                <UserHeader />
                <div class="dashboard_outer_s">
                    <h2>All User List</h2>
                    <div class="dashboard_detail_s user_list_table user_summary_t">
                        <div class="user_list_top">
                            <div class="user_list_l">
                                <h4>User List</h4>
                            </div>
                            <div class="user_search">
                                <button><img src="/images/search_icon.svg" alt="search" /></button>
                                <input type="search" placeholder="Search User" onChange={(e) => setSearch(e.target.value)} value={search} />
                            </div>
                        </div>
                        <div className="card-body userlisttable">
                            <div className="table-responsive" width="100%">
                                <DataTableBase columns={columns} data={userList} pagination />
                            </div>
                            {/* <div className="align-items-center mt-3 d-flex justify-content-between">
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
                                            handleUsersList(1, newSize); // 👈 force reload with new size
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
                            </div> */}
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}

export default AllUserList