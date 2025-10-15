import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import { imageUrl } from '../../Api/Api_Config/ApiEndpoints';
import moment from 'moment';
import DataTableBase from '../../Utils/DataTable';

function Partner() {
    const [allData, setAllData] = useState([]);
    const [partnerData, setPartnerData] = useState([]);

    useEffect(() => {
        handlepartnerData();
    }, [])
    const handlepartnerData = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.getAllPartners();
            if (result?.success) {
                setAllData(result?.data);
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
        { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        { name: "Name", selector: (row) => row?.userId?.fullName, sortable: true, wrap: true },
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
                    <button className="btn btn-success btn-sm" onClick={() => handleStatusUpdate(row._id, "APPROVED")}>
                        Approve
                    </button>

                    <button className="btn btn-danger btn-sm" onClick={() => handleStatusUpdate(row._id, "REJECTED")}>
                        Reject
                    </button>
                </div>);
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handleStatusUpdate = async (id, status) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.updatePartnerStatus(id, status);
            if (result?.success) {
                alertSuccessMessage(`Partner ${status} successfully`);
                setPartnerData(prev =>
                    prev.filter(item => item?._id !== id)
                );
                setAllData(prev => prev?.filter(item => item?._id !== id));

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
            setPartnerData(allData);
            return;
        }

        const matchingObjects = allData?.filter((obj) => {
            return keysToSearch.some((key) => {
                const value = key.split(".").reduce((acc, k) => acc?.[k], obj);
                return value?.toString()?.toLowerCase()?.includes(searchTerm);
            });
        });

        setPartnerData(matchingObjects);
    }

    return (
        <>
            <div class="dashboard_right">
                <UserHeader />
                <div class="dashboard_outer_s">
                    <h2>All Partners List</h2>
                    <div class="dashboard_detail_s user_list_table user_summary_t">
                        <div class="user_list_top">
                            <div class="user_list_l">
                                <h4> Partners List</h4>
                            </div>
                            <div class="user_search">
                                <button><img src="/images/search_icon.svg" alt="search" /></button>
                                <input type="search" placeholder="Search here..." name="search" onChange={searchObjects} />

                            </div>
                        </div>
                        <div className="card-body">

                            <DataTableBase columns={columns} data={partnerData} pagination />
                        </div>

                    </div>
                </div>
            </div >
        </>
    )
}

export default Partner