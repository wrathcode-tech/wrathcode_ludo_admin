import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import { imageUrl } from '../../Api/Api_Config/ApiEndpoints';
import moment from 'moment';
import DataTableBase from '../../Utils/DataTable';

function DepositRequest() {
    const [pendingDepositRequest, setPendingDepositRequest] = useState([]);
    const [allData, setAllData] = useState([]);

    useEffect(() => {
        handlePendingDepositReq();
    }, [])
    const handlePendingDepositReq = async (page, pageSize) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.pendingDepositRequest(page, pageSize);
            if (result?.success) {
                setAllData(result?.data);
                setPendingDepositRequest(result?.data);
                if (!sessionStorage.getItem("kycReloaded")) {
                    sessionStorage.setItem("kycReloaded", "true");
                    window.location.reload();
                }
            } else {
                // alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };



    const handleStatusUpdate = async (userId, transactionId, status, rejectReason) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.updateDepositRequest(userId, transactionId, status, rejectReason);
            if (result?.success) {
                alertSuccessMessage(`Deposit ${status} successfully`);

                // Remove the updated row from the current state immediately
                setPendingDepositRequest(prev =>
                    prev.filter(item => item._id !== transactionId)
                );

                // Optionally also update allData to keep search consistent
                setAllData(prev => prev.filter(item => item._id !== transactionId));

            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const columns = [
        { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        { name: "User Id", selector: (row) => row?.userId?.uuid, sortable: true, wrap: true },
        { name: "Name", selector: (row) => row?.userId?.fullName, sortable: true, wrap: true },
        { name: "Mobile Number", selector: (row) => row?.userId?.mobileNumber, sortable: true, wrap: true },
        { name: "Deposit Amount", selector: (row) => `₹ ${row?.amount}`, sortable: true, wrap: true },
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
                    <button className="btn btn-success btn-sm" onClick={() => handleStatusUpdate(row.userId?._id, row._id, "APPROVED")}>
                        Approve
                    </button>

                    <button className="btn btn-danger btn-sm" onClick={() => handleStatusUpdate(row.userId?._id, row._id, "REJECTED")}>
                        Reject
                    </button>
                </div>);
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];
    function searchObjects(e) {
        const keysToSearch = ["userId?.uuid", "userId?.fullName", "userId?.mobileNumber", "amount", "utrNumber"];
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
                    <h2>All Pending Deposits List</h2>
                    <div class="dashboard_detail_s user_list_table user_summary_t">
                        <div class="user_list_top">
                            <div class="user_list_l">
                                <h4>All Pending Deposits Requests</h4>
                            </div>
                            <div class="user_search">
                                <button><img src="/images/search_icon.svg" alt="search" /></button>
                                <input type="search" placeholder="Search here..." name="search" onChange={searchObjects} />

                            </div>
                        </div>
                        <div className="card-body">

                            <DataTableBase columns={columns} data={pendingDepositRequest} pagination />
                        </div>

                    </div>
                </div>
            </div >
        </>
    )
}

export default DepositRequest