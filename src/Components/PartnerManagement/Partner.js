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
        {
            name: "Date & Time",
            selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"),
            sortable: true,
            wrap: true,
        },
        {
            name: "Full Name",
            selector: (row) => row.fullName || "---",
            sortable: true,
            wrap: true,
        },
        {
            name: "Email ID",
            selector: (row) => row.emailId || "---",
            sortable: true,
            wrap: true,
        },
        {
            name: "Mobile Number",
            selector: (row) => row.mobileNumber || "---",
            sortable: true,
            wrap: true,
        },
        {
            name: "Users Count",
            selector: (row) => row.noOfUserHave || "0",
            sortable: true,
            wrap: true,
        },
        {
            name: "Description",
            selector: (row) => row.description || "---",
            wrap: true,
        },
        {
            name: "Actions",
            width: "200px",
            cell: (row) => {
                const isInactiveRejected =
                    row.status === "INACTIVE" && row.approvalStatus === "REJECTED";
                const isActiveApproved =
                    row.status === "ACTIVE" && row.approvalStatus === "APPROVED";
                const isPendingInactive =
                    row.status === "INACTIVE" && row.approvalStatus === "PENDING";

                return (
                    <div style={{ display: "flex", gap: "8px" }}>
                        {/* Case 1: When status is INACTIVE & approvalStatus is PENDING → show both buttons */}
                        {isPendingInactive ? (
                            <>
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleStatusUpdate(row._id, "APPROVED")}
                                >
                                    Approve
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleStatusUpdate(row._id, "REJECTED")}
                                >
                                    Reject
                                </button>
                            </>
                        ) : isInactiveRejected ? (
                            /* Case 2: Show only Approve button if Rejected */
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleStatusUpdate(row._id, "APPROVED")}
                            >
                                Approve
                            </button>
                        ) : isActiveApproved ? (
                            /* Case 3: Show only Reject button if Approved */
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleStatusUpdate(row._id, "REJECTED")}
                            >
                                Reject
                            </button>
                        ) : (
                            <span>--</span>
                        )}
                    </div>
                );
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
                handlepartnerData();
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

                            <DataTableBase columns={columns} data={allData} pagination />
                        </div>

                    </div>
                </div>
            </div >
        </>
    )
}

export default Partner