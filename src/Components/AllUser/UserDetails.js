import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { $ } from "react-jquery-plugin";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../Utils/CustomAlertMessage";
import DataTableBase from "../../Utils/DataTable";
import { ApiConfig, imageUrl } from "../../Api/Api_Config/ApiEndpoints";

function UserDetails() {
  const location = useLocation();
  const [userDetails, setUserDetails] = useState([]);
  const [userKycDetail, setUserKycDetail] = useState([]);
  console.log("🚀 ~ UserDetails ~ userKycDetail:", userKycDetail)
  const [referData, setReferData] = useState([]);
  const [data, setData] = useState([]);
  const [walletType, setWalletType] = useState("");
  const [amount, setAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0)
  const [username, setUsername] = useState("");
  const [showImage, setShowImage] = useState("");
  const [winingWalletType, setWiningWalletType] = useState("");
  const [userCommissionData, setUserCommissionData] = useState([]);
  const [userBankData, setUserBankData] = useState([]);
  const [gameData, setGameData] = useState([]);




  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const pageCount = Math.ceil(totalData / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    if (totalData > 0) {

      handleUserGameTransaction(skip, itemsPerPage);
    }
  }, [currentPage, skip, itemsPerPage]);

  // Api functions start header
  useEffect(() => {
    handleUserDetails();
    // handleUserGameTransaction();
    // handleUserKycDetails();
    // handleUserBankDetails();
    // handleReferAndEarn();
    // handleUserCommissionDetails()
  }, []);


  const handleUserDetails = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getUserDetails(location?.state?.userId);
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        setUserDetails(result?.data);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };
  const handleUserGameTransaction = async (skip, limit) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.userGameTransations(location?.state?.userId, skip, limit);

      if (result?.success) {
        LoaderHelper.loaderStatus(false);

        // Extract totals
        const totals = {
          totalGames: result?.data?.totalGames || 0,
          totalWin: result?.data?.totalWin || 0,
          totalLoss: result?.data?.totalLoss || 0,
          totalProfit: result?.data?.totalProfit || 0,
        };

        // Map individual game history
        const filteredData = result?.data?.history?.map((item, index) => ({
          ...item,
          index: index + 1 + skip,
          ...totals, // add totals to each row if you want to show them in the table
        })) || [];

        setGameData(filteredData);
        setTotalData(totals.totalGames);
      } else {
        alertErrorMessage(result?.message);
        LoaderHelper.loaderStatus(false);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };
  const handleUserKycDetails = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getuserKycDetails(location?.state?.userId);
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        // Wrap object in an array
        setUserKycDetail(result?.data ? [result.data] : []);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };

  const handleUserBankDetails = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getUserBankDetails(location?.state?.userId);
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        setUserBankData(result?.data ? [result.data] : []);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };
  const handleUserReferralDetails = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getUserReferralDetails(location?.state?.userId);
      LoaderHelper.loaderStatus(false);
      if (result?.success) {
        setReferData(result.data);
      } else {
        // alertErrorMessage(result.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error.message);
    }
  };
  const handleUserCommissionDetails = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getUserCommissionDetails(location?.state?.userId);
      LoaderHelper.loaderStatus(false);
      if (result?.success) {
        setUserCommissionData(result.data);
      } else {
        // alertErrorMessage(result.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error.message);
    }
  };
  const handleAddWinningAmount = async (winingWalletType, amount,) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.addUserWinningAmount(location?.state?.userId, winingWalletType, amount);
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        handleUserDetails();
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };
  const handleAddDepositAmount = async (walletType, amount,) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.addDepositAmount(location?.state?.userId, walletType, amount);
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        handleUserDetails();
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };
  const handleUpdateProfile = async (userName) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.editUser(location?.state?.userId, userName);
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        setUserKycDetail(result?.data);
        handleUserDetails();
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };
  const flattenObjectForDisplay = (obj, parentKey = '', result = {}) => {
    for (let key in obj) {
      if (key === "__v" || key === "_id") continue;
      // If nested object, add its keys directly without dot notation
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        flattenObjectForDisplay(obj[key], key.toUpperCase(), result); // Recursively process nested keys
      } else {
        // Uppercase the key and add to result
        const displayKey = parentKey ? `${parentKey} ${key}`.toUpperCase() : key.toUpperCase();
        result[displayKey] = obj[key];
      }
    }
    return result;
  };
  const createDynamicColumns = (data) => {
    if (!data.length) return [];

    // Flatten the first object in the data array to get all keys with uppercase headers
    const flatData = flattenObjectForDisplay(data[0]);
    const keys = Object.keys(flatData);

    return keys.map((key) => ({
      name: <> {key}</>, // Already uppercased in flattenObjectForDisplay
      selector: (row) => {
        // Flatten row data to access the values by the transformed keys
        const flatRow = flattenObjectForDisplay(row);
        if (key === "CREATEDAT" || key === "UPDATEDAT" || key === "PAYMENTTIME") {
          return moment(flatRow[key]).format("DD MMM YYYY LT") || "------";
        }
        return flatRow[key]?.toString() || "------";
      },
      sortable: true,
      wrap: true,
      width: key === "DESCRIPTION" ? "250px" : "180px", // Adjust width for specific fields
    }));
  };
  const handleUserDelete = async (userId) => {
    try {
      const result = await AuthService.deleteUser(userId);
      if (result.success) {
        alertSuccessMessage(result.message);

      } else {
        alertErrorMessage(result.message);
      }
    } catch (error) {
      alertErrorMessage("An error occurred while updating the Avatar status.");
    }
  };
  const deleteAdhar = (row) => {
    return (
      <>
        <button className="btn btn-danger btn-sm" type="button" onClick={() => {
          Swal.fire({
            title: "Are you sure you want to delete account?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
              handleUserDelete(row?._id);

              Swal.fire({
                title: "Deleted!",
                text: "User has been deleted.",
                icon: "success"
              });
            }
          });
        }}>
          <i className="fas fa-trash-alt"></i>
        </button>
      </>
    );
  };

  const handleImageDetail = (img) => {
    setShowImage(img);
  };
  // React Data table Start from here

  const UserGameDetails = [
    {
      name: "Sr. No.",
      selector: (row) => row.index,
      width: "80px",
    },
    {
      name: "Event ID",
      selector: (row) => row?.eventId?.substring(0, 8)?.toUpperCase(),
      wrap: true,
    },
    {
      name: "Bet Amount",
      selector: (row) => row?.betAmount,
      sortable: true,
    },
    {
      name: "Total Bet Pool",
      selector: (row) => row?.totalBetPool,
      sortable: true,
    },
    {
      name: "Admin Commission",
      selector: (row) => row?.adminCommission,
      sortable: true,
    },
    {
      name: "Result Amount",
      selector: (row) => row?.resultAmount,
      sortable: true,
    },
    {
      name: "Wallet Type",
      selector: (row) => row?.walletType,
    },
    {
      name: "Role",
      selector: (row) => row?.role,
    },
    {
      name: "Status",
      selector: (row) => row?.status,
    },
    // These totals will be same for all rows (optional to show)
    {
      name: "Total Games Played",
      selector: (row) => row?.totalGames,
    },
    {
      name: "Total Lost Game",
      selector: (row) => row?.totalLoss,
    },
    {
      name: "Total Game Profit",
      selector: (row) => row?.totalProfit,
    },
    {
      name: "Total Game Win",
      selector: (row) => row?.totalWin,
    },
  ];
  const UserKycDetails = [
    {
      name: "Sr. No.",
      width: "100px",
      wrap: true,
      selector: (row, index) => skip + 1 + index,
    },
    {
      name: "Full Name",
      sortable: true,
      wrap: true,
      selector: (row) => row?.userId?.fullName || row?.userId?.fullName || "------",
    },
    {
      name: "Document Number",
      sortable: true,
      wrap: true,
      selector: (row) => row?.documentNumber || "------",
    },
    {
      name: "Document Front Image",
      center: true,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <img
          className="table-img w-100 cursor-pointer"
          src={row?.documentFrontImage ? `${imageUrl}/${row.documentFrontImage}` : "/no-image.png"}
          data-bs-toggle="modal"
          data-bs-target="#ImageModal"
          onClick={() => handleImageDetail(`${imageUrl}/${row.documentFrontImage}`)}
          alt="DocumentFrontImage"
        />
      ),
    },
    {
      name: "Document Back Image",
      center: true,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <img
          className="table-img w-100 cursor-pointer"
          src={row?.documentBackImage ? `${imageUrl}/${row.documentBackImage}` : "/no-image.png"}
          data-bs-toggle="modal"
          data-bs-target="#ImageModal"
          onClick={() => handleImageDetail(`${imageUrl}/${row.documentBackImage}`)}
          alt="DocumentBackImage"
        />
      ),
    },
    {
      name: "Status",
      sortable: true,
      wrap: true,
      selector: (row) => row?.status || "------",
    },
    {
      name: "Action",
      width: "180px",
      wrap: true,
      cell: (row) => (
        <button className="btn btn-danger" onClick={() => deleteAdhar(row)}>
          Delete
        </button>
      ),
    },
  ];

  const BankDetailscolumns = [
    { name: "Sr. No.", selector: (row, index) => index + 1, },
    { name: "Bank Account Name", selector: (row) => row?.accountHolderName ? row?.accountHolderName : "-----", sortable: true },
    { name: "Bank Name", selector: (row) => row?.bankName ? row?.bankName : "-----", sortable: true },
    { name: "Bank IFSC Code", selector: (row) => row?.ifscCode ? row?.ifscCode : "-----", sortable: true },
    { name: "Bank Account Number", selector: (row) => row?.accountNumber ? row?.accountNumber : "-----", sortable: true },
    { name: "Bank Status", selector: (row) => row?.status ? row?.status : "-----", sortable: true },
  ];
  const UserReferralDetails = [
    { name: "Sr. No.", selector: (row, index) => index + 1, width: "80px" },
    { name: "Game ID", selector: (row) => row?.gameid, sortable: true },
    { name: "Game Name", selector: (row) => row?.gameName, sortable: true },
    { name: "Net Credited Amount", selector: (row) => row?.notCredit, sortable: true },
  ];
  const UserCommissionDetails = [
    { name: "Sr. No.", selector: (row, index) => index + 1, width: "80px" },
    { name: "User Name", selector: (row) => row?.userName ? row?.userName : "-----", sortable: true },
    { name: "Mobile Number", selector: (row) => row?.mobileNumber ? row?.mobileNumber : "-----", sortable: true },
    { name: "Referred User Id", selector: (row) => row?.uuid ? row?.uuid : "-----", sortable: true },
    { name: "Referral Bonus", selector: (row) => row?.referralBonus ? row?.referralBonus : "-----", sortable: true },
    { name: "Referrer Bonus", selector: (row) => row?.referrerBonus ? row?.referrerBonus : "-----", sortable: true },
    { name: "Date & Time", width: "180px", selector: (row) => moment(row?.createdAt).format("DD-MM-YYYY LT"), sortable: true },
    { name: "Description", selector: (row) => row?.description ? row?.description : "-----", sortable: true },

  ];


  return (
    <div className="dashboard_right">
      <div id="layoutSidenav_content">
        <main>
          <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
            <div className="container2">
              <div className="page-header-content pt-4 userdetails">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto mt-4">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn p-0 page-header-icon" style={{ fontSize: "30px", }}
                        onClick={() => window.history.back()}>
                        <i className="fas fa-arrow-alt-circle-left me-2"></i>
                      </button>
                      <h1 className="page-header-title mb-0">
                        User Details
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="nav nav-pills mb-3 tabs_top" id="pills-tab" role="tablist">
                {/* 1️⃣ User Profile */}
                <li className="nav-item" role="presentation">
                  <button
                    className="m-0 nav-link active"
                    id="pills-one-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-one"
                    type="button"
                    role="tab"
                    aria-controls="pills-one"
                    aria-selected="true"
                  >
                    User Profile
                  </button>
                </li>

                {/* 2️⃣ Game Transactions */}
                <li className="nav-item" role="presentation">
                  <button
                    className="m-0 nav-link"
                    id="pills-two-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-two"
                    type="button"
                    role="tab"
                    aria-controls="pills-two"
                    aria-selected="false"
                    onClick={() => handleUserGameTransaction(skip, itemsPerPage)}
                  >
                    Game Transactions
                  </button>
                </li>

                {/* 3️⃣ User KYC */}
                <li className="nav-item" role="presentation">
                  <button
                    className="m-0 nav-link"
                    id="pills-three-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-three"
                    type="button"
                    role="tab"
                    aria-controls="pills-three"
                    aria-selected="false"
                    onClick={handleUserKycDetails}
                  >
                    User KYC
                  </button>
                </li>

                {/* 4️⃣ Bank / UPI */}
                <li className="nav-item" role="presentation">
                  <button
                    className="m-0 nav-link"
                    id="pills-four-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-four"
                    type="button"
                    role="tab"
                    aria-controls="pills-four"
                    aria-selected="false"
                    onClick={handleUserBankDetails}
                  >
                    Bank / UPI
                  </button>
                </li>

                {/* 5️⃣ Referral Details */}
                <li className="nav-item" role="presentation">
                  <button
                    className="m-0 nav-link"
                    id="pills-five-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-five"
                    type="button"
                    role="tab"
                    aria-controls="pills-five"
                    aria-selected="false"
                    onClick={handleUserReferralDetails}
                  >
                    Referral Details
                  </button>
                </li>

                {/* 6️⃣ Commission Details */}
                <li className="nav-item" role="presentation">
                  <button
                    className="m-0 nav-link"
                    id="pills-six-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-six"
                    type="button"
                    role="tab"
                    aria-controls="pills-six"
                    aria-selected="false"
                    onClick={handleUserCommissionDetails}

                  >
                    Commission Details
                  </button>
                </li>
              </ul>
            </div>
          </header>
          <div className="container2 mt-n10 user_detail_info">
            <div className="row">
              <div className="col-xl-12 mb-4">
                <div className="card mb-4 mb-xl-0">
                  <div className="card-body py-4 pb-0">
                    <div className="tab-content">

                      {/* User Profile Tab */}
                      <div className="tab-pane fade show active" id="pills-one" role="tabpanel" aria-labelledby="pills-one-tab">
                        <div className="list_profile">
                          <div className="profile_lft">
                            {userDetails?.avatar && userDetails?.avatar !== "" ? (
                              <img
                                className="img-account-profile rounded-circle mb-2 mb-lg-0"
                                crossOrigin="anonymous"
                                src={ApiConfig + userDetails?.avatar}
                                alt="avatar"
                              />
                            ) : (
                              <img
                                className="img-account-profile rounded-circle mb-2 mb-lg-0"
                                src="/public/images/.png"
                                alt="dummy"
                              />
                            )}
                            <div className="col-lg-12">
                              <span className="fw-bolder fs-6 text-dark">
                                {userDetails?.fullName ? userDetails?.fullName : userDetails?.userName}
                              </span>
                            </div>
                          </div>
                          {/* <button
                            type="button"
                            className="btn btn-primary btn-muted"
                            data-bs-toggle="modal"
                            data-bs-target="#add_modal"
                          >
                            <i className="far fa-edit"></i>
                          </button> */}
                        </div>

                        <div className="doc_img py-3 px-2 my-2">
                          {/* 🔹 Basic Info */}
                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Full Name:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">{userDetails?.fullName || "N/A"}</span>
                            </div>
                          </div>


                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Email Id:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">{userDetails?.emailId || "N/A"}</span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">UUID:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">{userDetails?.uuid || "N/A"}</span>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Mobile Number:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">{userDetails?.mobileNumber || "N/A"}</span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">KYC Status:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">{userDetails?.kycVerified || "N/A"}</span>
                            </div>
                          </div>

                          {/* 🔹 Referral Info */}
                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Referral Code:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">{userDetails?.referCodeOfUser || "N/A"}</span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Total Referral Bonus:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">₹ {userDetails?.totalRefferalBlanceByUser || 0}</span>
                            </div>
                          </div>

                          {/* 🔹 Wallet Section */}
                          <hr />
                          <h5 className="fw-bold mb-3 text-primary">Wallet Details</h5>

                          <div className="row align-items-center mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Available Balance:</label>
                            <div className="col-lg-4">
                              <span className="fw-bolder fs-6 text-dark">₹ {userDetails?.availableBalance || 0}</span>
                            </div>
                            <div className="col-lg-3 text-end">
                              <button type="button" className="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#Deposit_modal"
                              >
                                + Add Deposit Cash
                              </button>
                            </div>
                          </div>

                          <div className="row align-items-center mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Winning Balance:</label>
                            <div className="col-lg-4">
                              <span className="fw-bolder fs-6 text-dark">₹ {userDetails?.availableWinningBalance || 0}</span>
                            </div>
                            <div className="col-lg-3 text-end">
                              <button type="button" className="btn btn-sm btn-success" data-bs-toggle="modal"
                                data-bs-target="#winning_modal" >
                                + Add Winning Cash
                              </button>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Referral Bonus Wallet:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">₹ {userDetails?.availableRefferalBonusBalance || 0}</span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Commission Bonus Wallet:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">₹ {userDetails?.availableUserCommissionBonusBalance || 0}</span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Locked Balance:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">₹ {userDetails?.availableLockedBalance || 0}</span>
                            </div>
                          </div>

                          {/* 🔹 Totals */}
                          <hr />
                          <h5 className="fw-bold mb-3 text-primary">Transaction Summary</h5>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Total Deposits:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">₹ {userDetails?.totalDepositByUser || 0}</span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Total Withdrawals:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">₹ {userDetails?.totalWithdrawalByUser || 0}</span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Total Commission Earned:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">₹ {userDetails?.totalCommissionBalanceByUser || 0}</span>
                            </div>
                          </div>
                          <hr />
                        </div>
                      </div>

                      {/* 🔹 Tab Contents */}
                      <div className="tab-content" id="pills-tabContent">
                        {/* 2️⃣ User Game Details Tab */}
                        <div className="tab-pane fade" id="pills-two" role="tabpanel" aria-labelledby="pills-two-tab">
                          <DataTableBase
                            columns={UserGameDetails}
                            data={gameData || []}
                            pagination={false}
                          />
                        </div>

                        {/* 3️⃣ User KYC Details Tab */}
                        <div className="tab-pane fade show active" id="pills-three" role="tabpanel" aria-labelledby="pills-three-tab">
                          <DataTableBase columns={UserKycDetails} data={userKycDetail || []} />
                        </div>

                        {/* 4️⃣ User Bank / UPI Details Tab */}
                        <div className="tab-pane fade" id="pills-four" role="tabpanel" aria-labelledby="pills-four-tab">
                          <DataTableBase columns={BankDetailscolumns} data={userBankData || []} pagination />
                        </div>

                        {/* 5️⃣ User Referral Details Tab */}
                        <div className="tab-pane fade" id="pills-five" role="tabpanel" aria-labelledby="pills-five-tab">
                          <DataTableBase columns={UserReferralDetails} data={referData} pagination />
                        </div>

                        {/* 6️⃣ User Commission Details Tab */}
                        <div className="tab-pane fade" id="pills-six" role="tabpanel" aria-labelledby="pills-six-tab">
                          <DataTableBase columns={UserCommissionDetails} data={userCommissionData} pagination />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* user details add_modal */}
        <div
          className="modal fade"
          id="add_modal"
          tabindex="-1"
          ariaLabelledby="add_modalLabel"
          ariaHidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="add_modalLabel">
                  Edit User Profile{" "}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-4 gx-md-5">
                  <div className="col-md-12">
                    <label>
                      User Name <span className="text-danger">*</span>
                    </label>
                    <input value={username} onChange={(e) => setUsername(e.target.value?.toUpperCase())}
                      type="text"
                      className="form-control form-control-solid"
                      name="username"
                      placeholder=" Enter User Name"
                    />
                  </div>

                  {/* <div className="col-md-6">
                  <label>
                    Phone Number <span className="text-danger">* </span>
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-solid"
                    name="totalBet"
                    placeholder="Enter Phone Number"
                  />
                </div> */}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary px-5"
                  data-bs-dismiss="modal"
                  onClick={() => handleUpdateProfile(username)}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-dark  px-5"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Add winning cash modal */}
        <div
          className="modal fade"
          id="winning_modal"
          tabindex="-1"
          ariaLabelledby="add_modalLabel"
          ariaHidden="true"
        >
          <div className="modal-dialog modal-l modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="add_modalLabel">
                  Add Winning Cash
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body depositform">
                <div className="row g-4 gx-md-5">
                  <div className="col-md-12">
                    <label>
                      Winning Cash <span className="text-danger">* </span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="winningCash" onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="col-md-12">
                    <label>
                      Select Wallet Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={winingWalletType}
                      onChange={(e) => setWiningWalletType(e.target.value)}
                    >
                      <option value="INR">INR</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>

                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-dark  px-5"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-5"
                  data-bs-dismiss="modal" onClick={() => handleAddWinningAmount(winingWalletType, amount)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Add Deposit Cash modal */}
        <div
          className="modal fade"
          id="Deposit_modal"
          tabindex="-1"
          ariaLabelledby="add_modalLabel"
          ariaHidden="true"
        >
          <div className="modal-dialog modal-l modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="add_modalLabel">
                  Add Deposit Cash
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body depositform">
                <div className="row g-4 gx-md-5">
                  <div className="col-md-12">
                    <label>
                      Deposit Cash <span className="text-danger">* </span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="addDeposit" onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="col-md-12">
                    <label>
                      Select Wallet Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={walletType}
                      onChange={(e) => setWalletType(e.target.value)}
                    >
                      <option value="INR">INR</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-dark  px-5"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-5"
                  data-bs-dismiss="modal" onClick={() => handleAddDepositAmount(walletType, amount)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/*wallet history Modal  */}
        <div
          className="modal fade"
          id="wallet_history_modal"
          tabindex="-1"
          ariaLabelledby="add_modalLabel"
          ariaHidden="true"
        >
          <div className="modal-dialog modal-l modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="add_modalLabel">
                  All Transactions Details List
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close">
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* user details responsible game modal */}
        <div
          className="modal fade"
          id="responsible_game_modal"
          tabindex="-1"
          ariaLabelledby="add_modalLabel"
          ariaHidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="add_modalLabel">
                  Edit Responsible Game Details{" "}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-4 gx-md-5">
                  <div className="col-md-6">
                    <label>
                      Deposit Amount Limit<span className="text-danger">* </span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="wonCoin"
                      placeholder=" Enter Full Name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label>
                      Deposit No Limit <span className="text-danger">* </span>
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-solid"
                      name="totalBet"
                      placeholder="Enter Phone Number"
                    />
                  </div>
                  <div className="col-md-6">
                    <label>
                      Poker Break
                      <span className="text-danger">* </span>
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-solid"
                      name="totalBet"
                      placeholder="Enter Phone Number"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary px-5"
                  data-bs-dismiss="modal"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-dark  px-5"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Image Detail */}
        <div className="modal image_modal" id="ImageModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog  alert_modal modal-lg" role="document">
            <div className="modal-content">
              <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
              <div className="ratio ratio-16x9">
                <img src={showImage} className="w-100 cc_modal_img " alt="" />
              </div>
            </div>
          </div>
        </div>
        {/* Image Detail  */}
      </div>
    </div>
  );
}
export default UserDetails;