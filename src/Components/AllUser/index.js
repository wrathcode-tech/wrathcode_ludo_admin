import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage } from '../../Utils/CustomAlertMessage';
import DataTable from 'react-data-table-component';
import moment from 'moment';

function AllUserList() {

    const [userList, setUserList] = useState([]);
    const [allData, setAllData] = useState([]);
    const [search, setSearch] = useState("");

    const handleUsersList = async () => {

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.usersList();
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

    const Columns = [
        {
            name: 'Created At',
            selector: row => moment(row.createdAt).format('DD-MM-YYYY LT'),
            sortable: true,
            wrap: true
        },
        {
            name: 'User Id',
            selector: row => row?.uuid || '—',
            sortable: true,
            wrap: true
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
        // {
        //     name: 'Mobile Number',
        //     selector: row => row?.mobileNumber || '—',
        //     sortable: true,
        //     wrap: true
        // },
        // {
        //     name: 'Country Code',
        //     selector: row => row?.countryCode || '—',
        //     sortable: true,
        //     wrap: true
        // },
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
                    <h2>User List</h2>
                    <div class="dashboard_detail_s user_list_table user_summary_t">
                        <div class="user_list_top">
                            <div class="user_list_l">
                                <h4>All User</h4>
                            </div>
                            <div class="user_search">
                                <button><img src="/images/search_icon.svg" alt="search" /></button>
                                <input type="search" placeholder="Search User" onChange={(e) => setSearch(e.target.value)} value={search} />
                            </div>
                        </div>
                        <DataTable
                            columns={Columns}
                            data={userList}
                            pagination
                            highlightOnHover
                            striped
                            responsive
                        />
                    </div>
                </div>
            </div >

        </>
    )
}

export default AllUserList