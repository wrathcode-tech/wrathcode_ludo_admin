import React, { useEffect, useState } from 'react';
import UserHeader from '../../Layout/UserHeader';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import { imageUrl } from '../../Api/Api_Config/ApiEndpoints';
import moment from 'moment';
import DataTableBase from '../../Utils/DataTable';
import { useNavigate } from 'react-router-dom';

function DisputeResponse() {
    const navigate = useNavigate();
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWinningData, setSelectedWinningData] = useState(null); // Modal data
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch winning data on view
    const handleView = async (id) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.getParticularResponseView(id); // API to get winning data
            if (result?.success) {
                setSelectedWinningData(result.data);
                setShowModal(true);
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };
    const handleEventRefund = async (eventId) => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.refundEventFund(eventId);
            if (result?.success) {
                alertSuccessMessage("Refund processed successfully");

                // Remove dispute from list
                setAllData(prev => prev.filter(d => d.eventId !== eventId));
                setFilteredData(prev => prev.filter(d => d.eventId !== eventId));

                // Close modal
                setShowModal(false);
                setSelectedWinningData(null);
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };
    // Handle Winner/Loser selection
    const handleSelectResult = async (eventId, winnerId) => {
        if (!selectedWinningData) return;
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.chooseWinner(eventId, winnerId);
            if (result?.success) {
                alertSuccessMessage('Winner selected successfully');

                // Remove dispute from list
                setAllData(prev => prev.filter(d => d.eventId !== eventId));
                setFilteredData(prev => prev.filter(d => d.eventId !== eventId));

                // Close modal
                setShowModal(false);
                setSelectedWinningData(null);
            } else {
                alertErrorMessage(result?.message || 'Something went wrong');
            }
        } catch (error) {
            alertErrorMessage(error?.message || 'API Error');
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleUserClick = (userId) => {
        navigate(`/dashboard/UserDetails`, { state: { userId } });
    };
    const commonColumns = [
        { name: "Sr No.", cell: (row, rowIndex) => rowIndex + 1 + (currentPage - 1) * rowsPerPage, wrap: true, width: "80px" },
        {
            name: 'Date & Time',
            selector: row => moment(row.createdAt).format('DD-MM-YYYY LT'),
            sortable: true,
            wrap: true
        },
        {
            name: 'Event ID',
            selector: row => row.eventId || '—',
            sortable: true,
            wrap: true
        },
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

        {
            name: 'Amount',
            selector: row => `₹ ${row?.matchAmount || 0}`,
            sortable: true,
            wrap: true
        },
        {
            name: 'Status',
            selector: row => row?.status || '—',
            cell: row => {
                let color = '#1eb5c0';
                if (row.status === 'DISPUTE') color = 'orange';
                else if (row.status === 'APPROVED') color = 'green';
                else if (row.status === 'REJECTED') color = 'red';
                return <span style={{ color }}>{row?.status || '—'}</span>;
            },
            sortable: true,
            wrap: true,
        },
        {
            name: 'Action',
            cell: row => (
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleView(row._id)}
                >
                    View
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    useEffect(() => {
        const fetchDisputeData = async () => {
            try {
                LoaderHelper.loaderStatus(true);
                const result = await AuthService.getDisputeUsersRespose();
                if (result?.success) {
                    setAllData(result?.data);
                    setFilteredData(result?.data);
                } else {
                    alertErrorMessage(result?.message);
                }
            } catch (error) {
                alertErrorMessage(error?.message);
            } finally {
                LoaderHelper.loaderStatus(false);
            }
        };
        fetchDisputeData();
    }, []);

    // Search filter
    useEffect(() => {
        if (!searchTerm) {
            setFilteredData(allData);
            return;
        }
        const tempData = allData.filter(item =>
            (item?.eventId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item?.matchAmount?.toString() || '').includes(searchTerm)
        );
        setFilteredData(tempData);
    }, [searchTerm, allData]);


    const handleContactSupport = (userId) => {
        navigate(`/support?userId=${userId}`);
    };

    return (
        <div className="dashboard_right">
            <UserHeader />
            <div className="dashboard_outer_s">
                <h2>Dispute Ludo Games List</h2>
                <div className="dashboard_detail_s user_list_table user_summary_t">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="form-control mb-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <DataTableBase
                            columns={commonColumns}
                            data={filteredData}
                            pagination
                            paginationServer={false}
                            paginationPerPage={rowsPerPage}
                            paginationDefaultPage={currentPage}
                            onChangePage={page => setCurrentPage(page)}
                            onChangeRowsPerPage={(newPerPage, page) => {
                                setRowsPerPage(newPerPage);
                                setCurrentPage(page);
                            }}
                        />

                    </div>
                </div>
            </div>

            {/* Winning Data Modal */}
            {showModal && selectedWinningData && (
                <div className="modal_overlay">
                    <div className="modal_content winning_details">
                        <h3>Winning Details</h3>
                        <div className='row'>
                            <div className='col-sm-9'>
                                <div className='event_details'>
                                    <p>
                                        <strong>Event ID:</strong> {selectedWinningData.eventId || "—"}{" "}
                                    </p>

                                    <p>
                                        <strong>Created By:</strong> {selectedWinningData?.createdBy?.fullName || selectedWinningData?.createdBy || "—"}
                                    </p>

                                    <p><strong>Joined By:</strong> {selectedWinningData?.joinedBy?.fullName || selectedWinningData?.joinedBy || "—"}</p>
                                    <p>
                                        <strong>Total Amount:</strong> ₹{selectedWinningData?.totalBetamount || (selectedWinningData?.amount ?? 0) * 2 || 0}
                                    </p>

                                </div>
                            </div>

                            <div className='col-sm-3'>
                                <div className='refundbtn'>
                                    <button
                                        className="btn btn-success btn-sm ms-2 justify-content-end"
                                        onClick={() => handleEventRefund(selectedWinningData.eventId, "Refund")}
                                    >
                                        Refund
                                    </button>
                                </div>
                            </div>

                        </div>

                        <h5 className="mt-3">User Responses:</h5>
                        <div className='table-responsive'>
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>UUID</th>
                                        <th>Mobile Number</th>
                                        <th>Amount</th>
                                        <th>Choice</th>
                                        <th>Payment Proof</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedWinningData?.allUserResponse?.length > 0 ? (
                                        selectedWinningData?.allUserResponse.map((u, index) => {
                                            // Directly use userId from allUserResponse as it contains user info
                                            const userInfo = u?.userId || {};
                                            // Calculate individual amount (totalBetamount / 2 if both users, or use amount from response)
                                            const individualAmount = u?.amount || (selectedWinningData?.totalBetamount ? selectedWinningData.totalBetamount / 2 : 0);

                                            return (
                                                <tr key={index}>
                                                    <td>{userInfo?.fullName || "—"}</td>
                                                    <td>{userInfo?.uuid || "—"}</td>
                                                    <td>{userInfo?.mobileNumber || "—"}</td>
                                                    <td>₹{individualAmount}</td>
                                                    <td>{u?.choice || "—"}</td>
                                                    <td>
                                                        {u?.proof ? (
                                                            <img
                                                                src={imageUrl + u.proof}
                                                                alt="proof"
                                                                style={{ width: 50, height: 50, borderRadius: 5, cursor: "pointer" }}
                                                                onClick={() => window.open(imageUrl + u.proof, "_blank")}
                                                            />
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-success btn-sm me-1"
                                                            onClick={() =>
                                                                handleSelectResult(
                                                                    selectedWinningData.eventId,
                                                                    userInfo?._id,
                                                                    "WINNER"
                                                                )
                                                            }
                                                        >
                                                            Winner
                                                        </button>

                                                        <button
                                                            className="btn btn-info btn-sm"
                                                            onClick={() =>
                                                                navigate("/dashboard/support", {
                                                                    state: { openChat: true, userId: userInfo?._id },
                                                                })
                                                            }
                                                        >
                                                            Contact User
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted">
                                                No user responses found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>


                        <div className="modal_actions mt-3">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <style jsx>{`
                .modal_overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal_content {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    width: 90%;
                    max-width: 800px;
                    max-height: 90%;
                    overflow-y: auto;
                }
            `}</style>
        </div>
    );
}

export default DisputeResponse;
