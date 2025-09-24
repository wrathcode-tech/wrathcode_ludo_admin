import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import { imageUrl } from '../../Api/Api_Config/ApiEndpoints';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import DataTableBase from '../../Utils/DataTable';

function PendingDepositRequest() {

    const [pendingDepositRequest, setPendingDepositRequest] = useState([]);
    const [allData, setAllData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalData, setTotalData] = useState(0);

    const userId = sessionStorage.getItem("userId");


    const pageCount = Math.ceil(totalData / itemsPerPage);

    useEffect(() => {
        handlePendingDepositReq(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1); // kyunki selected 0-based hota hai
    };

    const handlePendingDepositReq = async (page, pageSize) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.pendingDepositRequest(page, pageSize);

            if (result?.success) {
                setAllData(result?.data);
                setPendingDepositRequest(result?.data);
            } else {
                // alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };


    const columns = [
        { name: "Created At", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        { name: "User Name", selector: (row) => row?.userId?.fullName, sortable: true, wrap: true },
        { name: "Amount", selector: (row) => `₹ ${row?.amount}`, sortable: true, wrap: true },
        { name: "UTR Number", selector: (row) => row?.utrNumber, sortable: true, wrap: true },
        {
            name: "Payment Proof", cell: (row) => (<a href={imageUrl + row?.paymentProof} target="_blank" rel="noopener noreferrer" style={{
                width: "50px", height: "50px"
            }}>
                <img src={imageUrl + row?.paymentProof} alt="proof" /></a>),
        },
        {
            name: "Actions", width: "200px",
            cell: (row) => {
                return (<div style={{ display: "flex", gap: "8px" }}>
                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusUpdate(row.userId?._id, row._id, "APPROVED")}
                    >
                        Approve
                    </button>

                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(row.userId?._id, row._id, "REJECTED")}
                    >
                        Reject
                    </button>

                </div>);
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handleStatusUpdate = async (userId, transactionId, status, rejectReason) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.updateDepositRequest(userId, transactionId, status, rejectReason);
            if (result?.success) {
                alertSuccessMessage(`Deposit ${status} successfully`);
                handlePendingDepositReq();
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
            setPendingDepositRequest(allData);
            return;
        }

        const matchingObjects = allData?.filter((obj) => {
            return keysToSearch.some((key) => {
                const value = key.split(".").reduce((acc, k) => acc?.[k], obj);
                return value?.toString()?.toLowerCase()?.includes(searchTerm);
            });
        });

        setPendingDepositRequest(matchingObjects);
    }

    return (
        <>
            <div class="dashboard_right">
                <UserHeader />
                <div class="dashboard_outer_s">
                    <h2>Pending Deposits Request List</h2>
                    <div class="dashboard_detail_s user_list_table user_summary_t">
                        <div class="user_list_top">
                            <div class="user_list_l">
                                <h4>All Deposits Pending Requests</h4>
                                {/* <p>Active Members</p> */}
                            </div>
                            <div class="user_search">
                                <button><img src="/images/search_icon.svg" alt="search" /></button>
                                <input type="search" placeholder="Search here..." name="search" onChange={searchObjects} />

                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive" width="100%">
                                <DataTableBase columns={columns} data={pendingDepositRequest} pagination={false} />
                            </div>
                            <div className="align-items-center mt-3 d-flex justify-content-between">
                                <div className="pl_row d-flex justify-content-start gap-3 align-items-center">
                                    <label htmlFor="rowsPerPage">Rows per page: </label>
                                    <select
                                        className="form-select form-select-sm my-0"
                                        id="rowsPerPage"
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            const newSize = Number(e.target.value);
                                            setItemsPerPage(newSize);
                                            setCurrentPage(1);
                                            handlePendingDepositReq(1, newSize); // 👈 force reload with new size
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
            </div >
        </>
    )
}

export default PendingDepositRequest