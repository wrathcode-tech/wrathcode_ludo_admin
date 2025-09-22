import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage } from '../../Utils/CustomAlertMessage';
import DataTable from "react-data-table-component";
import { imageUrl } from '../../Api/Api_Config/ApiEndpoints';
import moment from 'moment';

function PendingDepositRequest() {

    const [allData, setAllData] = useState([]);
    const [pendingDepositRequest, setPendingDepositRequest] = useState([]);

    useEffect(() => {
        const handlePendingDepositReq = async () => {
            try {
                LoaderHelper.loaderStatus(true);
                const result = await AuthService.pendingDepositRequest();

                if (result?.success) {
                    setAllData(result?.data);
                    setPendingDepositRequest(result?.data);
                } else {
                    alertErrorMessage(result?.message);
                }
            } catch (error) {
                alertErrorMessage(error?.message);
            } finally {
                LoaderHelper.loaderStatus(false);
            }
        };
        handlePendingDepositReq();
    }, []);

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
            name: "Status", selector: (row) => row.status, cell: (row) => (<span style={{ color: "#1eb5c0" }}>{row?.status}</span>), sortable: true, wrap: true
        },
    ];
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
    // const handleStatusUpdate = async (id, status) => {

    //     try {
    //         LoaderHelper.loaderStatus(true);
    //         const result = await AuthService.usersStatusUpdate(id, status);
    //         if (result?.success) {
    //             handlePendingDepositReq()

    //         } else {
    //             alertErrorMessage(result?.message);
    //         }

    //     } catch (error) {
    //         alertErrorMessage(error?.message);
    //     } finally {
    //         LoaderHelper.loaderStatus(false);
    //     }
    // };

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
                        <div className="p-2">
                            <DataTable columns={columns} data={pendingDepositRequest} pagination highlightOnHover striped responsive />
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default PendingDepositRequest