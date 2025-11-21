import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import { imageUrl } from '../../Api/Api_Config/ApiEndpoints';
import moment from 'moment';
import DataTableBase from '../../Utils/DataTable';
import { useNavigate } from 'react-router-dom';

function MatchDetails() {

    const [allData, setAllData] = useState([]);
    const [responseData, setResponseData] = useState([]);

    useEffect(() => {
        const handlePendingDepositReq = async () => {
            try {
                LoaderHelper.loaderStatus(true);
                const result = await AuthService.getUsersRespose();
                if (result?.success) {
                    setAllData(result?.data);
                    setResponseData(result?.data);
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

    const navigate = useNavigate();

    const handleUserClick = (userId) => {
        navigate(`/dashboard/UserDetails`, { state: { userId } });
    };


    const columns = [

        { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
        {
            name: "User Id",
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
        { name: "Event ID", selector: (row) => row?.eventId, sortable: true, wrap: true },
        { name: "Match Amount", selector: (row) => `₹ ${row?.matchAmount}`, sortable: true, wrap: true },
        { name: "Status", selector: (row) => row.status, cell: (row) => (<span style={{ color: "#1eb5c0" }}>{row?.status}</span>), sortable: true, wrap: true },
    ];
    function searchObjects(e) {
        const keysToSearch = ["userId.fullName", "utrNumber", "amount"];
        const userInput = e.target.value;
        const searchTerm = userInput?.toLowerCase();
        if (!searchTerm) {
            setResponseData(allData);
            return;
        }

        const matchingObjects = allData?.filter((obj) => {
            return keysToSearch.some((key) => {
                const value = key.split(".").reduce((acc, k) => acc?.[k], obj);
                return value?.toString()?.toLowerCase()?.includes(searchTerm);
            });
        });

        setResponseData(matchingObjects);
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
                    <h2>After Match User Response List</h2>
                    <div class="dashboard_detail_s user_list_table user_summary_t">
                        <div class="user_list_top">
                            <div class="user_list_l">
                                <h4>After Match User Responses</h4>
                                {/* <p>Active Members</p> */}
                            </div>
                            <div class="user_search">
                                <button><img src="/images/search_icon.svg" loading="lazy" alt="search" /></button>
                                <input type="search" placeholder="Search here..." name="search" onChange={searchObjects} />

                            </div>
                        </div>
                        <div className="p-2 mobilep">
                            <DataTableBase columns={columns} data={responseData} pagination />
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default MatchDetails;