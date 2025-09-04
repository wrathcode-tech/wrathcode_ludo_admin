import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage } from '../../Utils/CustomAlertMessage';

function ContactusList() {

    const [userList, setUserList] = useState([]);
    const [allData, setAllData] = useState([]);
    const [search, setSearch] = useState("");

    const handleUsersList = async () => {

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.contactusList();
            if (result?.success) {
                setUserList(result?.data)
                setAllData(result?.data)

            } else {
                alertErrorMessage(result?.message);
            }

        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
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

    return (
        <>
            <div class="dashboard_right">
                <UserHeader />
                <div class="dashboard_outer_s">
                    <h2>Contact Requests</h2>
                    <div class="dashboard_detail_s user_list_table user_summary_t">
                        <div class="user_list_top">
                            <div class="user_list_l">
                                <h4>All Requests</h4>
                            </div>
                            <div class="user_search">
                                <button><img src="/images/search_icon.svg" alt="search" /></button>
                                <input type="search" placeholder="Search Email" onChange={(e) => setSearch(e.target.value)} value={search} />
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Sr no.</th>
                                    <th>Email</th>
                                    <th>User Name</th>
                                    <th>Phone</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList?.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{item?.emailId}</td>
                                            <td>{item?.firstName ? item?.firstName + " " + item?.lastName : "---"}</td>
                                            <td>{item?.phoneNumber}</td>
                                            <td>{item?.description}</td>
                                         
                                        </tr>
                                    )
                                })}


                            </tbody>
                        </table>
                        {/* <div class="pagination_list">
                            <p>Showing data 1 to 8 of 256K entries</p>
                            <ul class="pagination">
                                <li class="page-item">
                                    <a class="page-link" href="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                        <span class="sr-only">Previous</span>
                                    </a>
                                </li>
                                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                <li class="page-item"><a class="page-link" href="#">2</a></li>
                                <li class="page-item"><a class="page-link" href="#">3</a></li>
                                <li class="page-item"><a class="page-link" href="#">4</a></li>
                                <li class="page-item"><a class="page-link" href="#">5</a></li>
                                <li class="page-item"><a class="page-link" href="#">...</a></li>
                                <li class="page-item">
                                    <a class="page-link" href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </div>
            </div >

        </>
    )
}

export default ContactusList