import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';

function Notification() {
    const [notificationList, setNotificationList] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const handleNotificationList = async () => {

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.notificationList();
            if (result?.success) {
                setNotificationList(result?.data?.reverse())
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleAddNotification = async () => {

        if (!message || !title) {
            alertErrorMessage("Please add notitfication title and messgae");
            return;
        }

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.addNotification(title, message);
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handleNotificationList();
                setMessage("");
                setTitle("")
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.deleteNotification(id);
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handleNotificationList();
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
        handleNotificationList()

    }, []);

    return (
        <>
            <div class="dashboard_right">
                <UserHeader />
                <div class="dashboard_outer_s">
                    <h2>Notifications</h2>
                    <div class="dashboard_detail_s user_list_table">
                        <div class="form_notification">
                            <h4>Send Notification</h4>
                            <form>

                                <div class="fill_input">
                                    <label>Notification Title</label>
                                    <textarea class="input_inb" type="text" placeholder="Enter Title" onChange={(e) => setTitle(e.target.value)} value={title} />
                                </div>
                                <div class="fill_input">
                                    <label>Notification</label>
                                    <textarea placeholder="Enter Message" class="input_inb" onChange={(e) => setMessage(e.target.value)} value={message}></textarea>
                                </div>
                                <div class="fill_input">
                                    <input type="button" value="Send Notification" onClick={handleAddNotification} disabled={!title || !message}/>
                                </div>
                            </form>
                        </div>
                        <div class="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th class="first_coloum">Notification Title</th>
                                        <th>Notification</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {notificationList?.map((item) => {
                                        return (
                                            <tr key={item?._id}>
                                                <td>{item?.title}</td>
                                                <td class="content_tb">
                                                    <p>{item?.message}</p>
                                                </td>
                                                <td class="Inactive"><button onClick={()=>{handleDeleteNotification(item?._id)}}>Delete</button></td>
                                            </tr>
                                        )
                                    })}



                                </tbody>
                            </table>
                        </div>
                        {/* <!-- <div class="pagination_list">

                                <p>Showing data 1 to 8 of  256K entries</p>

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


                            </div>           --> */}
                    </div>
                </div>
            </div>

        </>
    )
}

export default Notification