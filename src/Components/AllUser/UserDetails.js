import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { $ } from "react-jquery-plugin";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage } from "../../Utils/CustomAlertMessage";
import DataTableBase from "../../Utils/DataTable";
import { ApiConfig } from "../../Api/Api_Config/ApiEndpoints";

function UserDetails() {
  const location = useLocation();
  const [userDetails, setUserDetails] = useState([]);
  const [allTransacactions, setAllTransacactions] = useState([]);
  const [userKycDetails, setUserKycDetails] = useState([]);
  const [panCardKycDetail, setPanCardKycDetail] = useState([]);
  const [referData, setReferData] = useState([]);
  const [dataType, setDataType] = useState("upiList");
  const [data, setData] = useState([]);
  const [userIds, setUserIds] = useState("");
  const [transDetails, setTransDetails] = useState([]);
  const [walletType, setWalletType] = useState("");
  const [amount, setAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0)
  const [responsibleData, setResponsibleData] = useState([]);
  const [username, setUsername] = useState("");
  const [showImage, setShowImage] = useState("");




  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const pageCount = Math.ceil(totalData / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    if (totalData > 0) {

      handleAllTransaction(skip, itemsPerPage);
    }
  }, [currentPage, skip, itemsPerPage]);

  // Api functions start header
  useEffect(() => {
    handleUserDetails();
    handleUserUpiDetails("upiList");
  }, []);
  const handleAllTransaction = async (skip, limit) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.AllTransations(location?.state?.userId, skip, limit);
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        let fillteredData = result?.data?.userData?.map((item, index) => ({ ...item, index: index + 1 + skip }));
        setAllTransacactions(fillteredData);
        setTotalData(result?.data?.dataCount);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };
  const handleReferAndEarn = async (userIds) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getReferDetails(userIds);
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
  const handleUserBankDetails = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getUserbankList(location?.state?.userId);
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        setData(result?.data);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };
  const handleUserUpiDetails = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getUserUpiList(location?.state?.userId);
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        setData(result?.data);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };
  const handleAddAmount = async (walletType, amount,) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.addAmount(location?.state?.userId, walletType, amount);
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        setWalletType(result?.data);
        handleUserDetails();
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };
  const handleUserDetails = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getUserDetails(location?.state?.userId);
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        setUserDetails(result?.data);
        // setUserIds(result?.data?.sponsoredUsers);
        // setResponsibleData(result?.data?.selfExcluded);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };
  const handleTransDetails = async (fromOrder, type) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getTransDetails(fromOrder, type);
      if (result?.success) {
        setTransDetails([result?.data]);
        if (Object.keys(result?.data).length > 0) {
          $("#wallet_history_modal").modal("show");
        } else {
          alertErrorMessage("No more details available");
        }

      } else {
        alertErrorMessage("No more details available");
      }
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };
  const handleUserKycDetails = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getUserKycDetails(location?.state?.userId);
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        setUserKycDetails(result?.data);
        setPanCardKycDetail(result?.data);
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
        setUserKycDetails(result?.data);
        setPanCardKycDetail(result?.data);
        handleUserDetails();
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message);
    }
  };

  // table functions start here
  const handleAmount = (row) => {
    return (
      <span className={`text-${row?.paymentType === "Credit" ? "success" : "danger"} font-bold`}>{row?.paymentType === "Credit" ? "+" : "-"} ₹{row?.amount}</span>
    )
  }
  const handlePreviousBonus = (row) => {
    return (
      <span className={`text-${(row?.paymentType === "Credit" && row?.transactionType === "Bonus") && "success"} text-${(row?.paymentType === "Debit" && row?.transactionType === "Bonus") && "danger"}`}> ₹{row?.previousBonus}</span>
    )
  };
  const handlePreviousDeposited = (row) => {
    return (
      <span className={`text-${(row?.paymentType === "Credit" && row?.transactionType === "Deposit") && "success"} text-${(row?.paymentType === "Debit" && row?.transactionType === "Deposit") && "danger"} `}> ₹{row?.previousDepositedBalance}</span>
    )
  };
  const handlePreviousWinning = (row) => {
    return (
      <span className={`text-${(row?.paymentType === "Credit" && row?.transactionType === "Winning") && "success"} text-${(row?.paymentType === "Debit" && row?.transactionType === "Winning") && "danger"} `}> ₹{row?.previousWinningAmount}</span>
    )
  };
  const handleCurrentAmount = (row) => {
    const formatAmount = (amount => {
      return (+amount).toFixed(2);
    })
    return (
      <>
        {row?.transactionType === "Bonus" ? (
          <span className={`text-${row?.paymentType === "Credit" ? "success" : "danger"} font-bold`}>
            ₹{formatAmount(+row?.amount + +row?.previousBonus)}
          </span>
        ) : row?.transactionType === "Deposit" ? (
          <span className={`text-${row?.paymentType === "Credit" ? "success" : "danger"} font-bold`}>
            ₹{formatAmount(+row?.amount + +row?.previousDepositedBalance)}
          </span>
        ) : (
          <span className={`text-${row?.paymentType === "Credit" ? "success" : "danger"} font-bold`}>
            ₹{formatAmount(+row?.amount + +row?.previousWinningAmount)}
          </span>
        )}
      </>
    )
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
        // alertSuccessMessage(result.message);

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
  const deletePan = (row) => {
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
  const allTransColumns = [
    { name: "Sr. No.", width: "70px", wrap: true, selector: (row, index) => skip + 1 + index, },
    { name: <> Date & Time</>, width: "180px", sortabable: true, wrap: true, selector: (row) => moment(row?.createdAt).format(" DD MMM YYYY LT") ? moment(row?.createdAt).format(" DD MMM YYYY LT") : "------", },
    { name: "Wallet Type ", sortabable: true, wrap: true, selector: (row) => row?.transactionType, },
    { name: "Previous Bonus  ", sortabable: true, wrap: true, selector: handlePreviousBonus },
    { name: "Previous Deposited Balance  ", width: "180px", sortabable: true, wrap: true, selector: handlePreviousDeposited, },
    { name: "Previous Winning Amount  ", width: "180px", sortabable: true, wrap: true, selector: handlePreviousWinning, },
    { name: "Amount ", sortabable: true, wrap: true, selector: handleAmount, },
    { name: "Current Balance ", sortabable: true, wrap: true, selector: handleCurrentAmount, },
    { name: "Description  ", width: "250px", sortabable: true, wrap: true, selector: (row) => row?.description, },

    {
      name: "Action", wrap: true, selector: (row) => (<span style={{ color: "blue", cursor: "pointer", }}

      >
        <button className="btn btn-sm btn-primary me-2" onClick={() => handleTransDetails(row?.fromOrder, row?.fromTransaction)}><i className="far fa-eye"></i></button>
      </span>
      ),
    }
  ];
  const UserAadhharColumns = [
    { name: "Sr. No.", width: "100px", wrap: true, selector: (row, index) => skip + 1 + index, },
    { name: "Name On Aadhar", sortabable: true, wrap: true, selector: (row) => row?.aadharKyc?.nameOnAadhar || "------", },
    { name: "Aadhar Card Number", sortabable: true, wrap: true, selector: (row) => row?.aadharKyc?.aadharNumber || "------", },
    { name: "Aadhar DOB", sortabable: true, wrap: true, selector: (row) => row?.aadharKyc?.dob || "------", },
    {
      name: "Aadhar Card Photo", center: true, sortable: true, wrap: true, selector: (row) => (
        <img className="table-img w-100 cursor-pointer" src={`data:image/jpeg;base64,${row?.aadharKyc?.imageOnAadhar}`}
          data-bs-toggle="modal" data-bs-target="#ImageModal" onClick={() => handleImageDetail(`data:image/jpeg;base64,${row?.aadharKyc?.imageOnAadhar}`)} alt="aadharImage" />
      ),
    },
    { name: "Address", sortabable: true, wrap: true, selector: (row) => row?.aadharKyc?.aadharAddress || "------", },
    { name: "Status", sortabable: true, wrap: true, selector: (row) => row?.aadharKyc?.aadharStatus || "------", },
    { name: "Action", width: "180px", sortabable: true, wrap: true, selector: deleteAdhar },
  ];
  const UserPanColumns = [
    { name: "Sr. No.", width: "100px", wrap: true, selector: (row, index) => skip + 1 + index, },
    { name: "Name on Pan Card", wrap: true, selector: (row) => row?.panKyc?.nameOnPan || "------", },
    { name: "Pan Card Number ", sortabable: true, wrap: true, selector: (row) => row?.panKyc?.panNumber || "------", },
    { name: "Status", sortabable: true, wrap: true, selector: (row) => row?.panKyc?.panStatus || "------", },
    { name: "Action", width: "180px", sortabable: true, wrap: true, selector: deletePan, },


  ];
  const GameStatisticscolumns = [
    { name: "Sr. No.", selector: (row, index) => index + 1, width: "80px" },
    { name: "Game Name", selector: (row) => row?.gameName, sortable: true },
    { name: "BATTLE (One Vs One)", width: "180px", selector: (row) => row?.battle, sortable: true, wrap: true },
    { name: "CONTEST (One Vs Many)", width: "180px", selector: (row) => row?.Contest, sortable: true },
    { name: "Total Loss", selector: (row) => row?.totalLoss, sortable: true },
    { name: "Total Win", selector: (row) => row?.totalWin, sortable: true },
    { name: "Total Tie", selector: (row) => row?.totalTie, sortable: true },
    { name: "Total Played", selector: (row) => row?.totalPlayed, sortable: true },
  ];
  const GameHistorycolumns = [
    { name: "Sr. No.", selector: (row, index) => index + 1, },
    { name: "Game ID", selector: (row) => row?.gameid, sortable: true },
    { name: "Game Name", selector: (row) => row?.gameName, sortable: true },
    { name: "Game History", selector: (row) => row?.gameHistory, wrap: true },
  ];
  const BankDetailscolumns = [
    { name: "Sr. No.", selector: (row, index) => index + 1, },
    { name: "Bank Account Name", selector: (row) => row?.accountHolderName ? row?.accountHolderName : "-----", sortable: true },
    { name: "Bank Name", selector: (row) => row?.bankName ? row?.bankName : "-----", sortable: true },
    { name: "Bank IFSC Code", selector: (row) => row?.ifscCode ? row?.ifscCode : "-----", sortable: true },
    { name: "Bank Account Number", selector: (row) => row?.accountNumber ? row?.accountNumber : "-----", sortable: true },
    { name: "Bank Status", selector: (row) => row?.bankStatus ? row?.bankStatus : "-----", sortable: true },
  ];
  const UpiDetailscolumns = [
    { name: "Sr. No.", selector: (row, index) => index + 1, },
    { name: "Name", selector: (row) => row?.name ? row?.name : "-----", sortable: true },
    { name: "UPI ID", selector: (row) => row?.upiId ? row?.upiId : "-----", sortable: true },
    { name: "Status", selector: (row) => row?.bankStatus ? row?.bankStatus : "-----", sortable: true },
  ];
  const EarningReportColumns = [
    { name: "Sr. No.", selector: (row, index) => index + 1, width: "80px" },
    { name: "Game ID", selector: (row) => row?.gameid, sortable: true },
    { name: "Game Name", selector: (row) => row?.gameName, sortable: true },
    { name: "Net Credited Amount", selector: (row) => row?.notCredit, sortable: true },
  ];
  const ReferEarnColumns = [
    { name: "Sr. No.", selector: (row, index) => index + 1, width: "80px" },
    { name: "User Name", selector: (row) => row?.userName ? row?.userName : "-----", sortable: true },
    { name: "Mobile Number", selector: (row) => row?.mobileNumber ? row?.mobileNumber : "-----", sortable: true },
    { name: "Referred User Id", selector: (row) => row?.uuid ? row?.uuid : "-----", sortable: true },
    { name: "Referral Bonus", selector: (row) => row?.referralBonus ? row?.referralBonus : "-----", sortable: true },
    { name: "Referrer Bonus", selector: (row) => row?.referrerBonus ? row?.referrerBonus : "-----", sortable: true },
    { name: "Date & Time", width: "180px", selector: (row) => moment(row?.createdAt).format("DD-MM-YYYY LT"), sortable: true },
    { name: "Description", selector: (row) => row?.description ? row?.description : "-----", sortable: true },

  ];

  const handleTypeChange = (selectedType) => {
    setDataType(selectedType);
    if (selectedType === "upiList") {
      setData(UpiDetailscolumns);
    } else if (selectedType === "bankList") {
      setData(BankDetailscolumns);
    } else {
      setData([]);
    }
  };

  return (
    <div className="dashboard_right">
      <div id="layoutSidenav_content">
        <main>
          <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
            <div className="container-xl px-4">
              <div className="page-header-content pt-4">
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
              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="m-0 nav-link active text-white" id="pills-one-tab" data-bs-toggle="pill" data-bs-target="#pills-one"
                    type="button"
                    role="tab"
                    aria-controls="pills-one"
                    aria-selected="true"
                  >
                    User Profile
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="m-0 nav-link text-white"
                    id="pills-two-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-two"
                    type="button"
                    role="tab"
                    aria-controls="pills-two"
                    aria-selected="false" onClick={() => handleAllTransaction(skip, itemsPerPage)}
                  >
                    Game Transactions
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="m-0 nav-link text-white"
                    id="pills-five-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-five"
                    type="button"
                    role="tab"
                    aria-controls="pills-five"
                    aria-selected="false" onClick={handleUserKycDetails}
                  >
                    User KYC
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="m-0 nav-link text-white"
                    id="pills-six-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-six"
                    type="button"
                    role="tab"
                    aria-controls="pills-six"
                    aria-selected="false"
                  >
                    Bank / UPI
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="m-0 nav-link text-white"
                    id="pills-seven-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-seven"
                    type="button"
                    role="tab"
                    aria-controls="pills-seven"
                    aria-selected="false"
                  >
                    Earning Report
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="m-0 nav-link text-white"
                    id="pills-eight-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-eight"
                    type="button"
                    role="tab"
                    aria-controls="pills-eight"
                    aria-selected="false" onClick={() => handleReferAndEarn(userIds)}
                  >
                    Refer and Earn
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="m-0 nav-link text-white"
                    id="pills-fifty-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-fifty"
                    type="button"
                    role="tab"
                    aria-controls="pills-fifty"
                    aria-selected="false" onClick={() => handleUserDetails(skip, itemsPerPage)}>
                    Responsible Gaming
                  </button>
                </li>
              </ul>
            </div>
          </header>
          <div className="container-xl px-4 mt-n10">
            <div className="row">
              <div className="col-xl-12 mb-4">
                <div className="card mb-4 mb-xl-0">
                  <div className="card-body py-5 pb-0">
                    <div className="tab-content">
                      {/* User Profile Tab */}
                      <div className="tab-pane fade show active" id="pills-one" role="tabpanel" aria-labelledby="pills-one-tab">
                        <div className="list_profile">
                          <div>
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
                                src="/assets/img/dummy.png"
                                alt="dummy"
                              />
                            )}
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">
                                {userDetails?.fullName ? userDetails?.fullName : userDetails?.userName}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-primary btn-muted"
                            data-bs-toggle="modal"
                            data-bs-target="#add_modal"
                          >
                            <i className="far fa-edit"></i>
                          </button>
                        </div>

                        <div className="doc_img py-5 px-4 my-4">
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

                          {/* 🔹 UUID */}
                          <hr />

                        </div>
                      </div>

                      {/* Wallet History Tab */}
                      <div className="tab-pane fade" id="pills-two" role="tabpanel" aria-labelledby="pills-two-tab">
                        <div className="row mb-3">
                          <label className="col-lg-5 fw-bold text-muted">
                            Available Deposit Balance:
                          </label>
                          <div className="col-lg-7">
                            <span className="fw-bold fs-6 text-dark text-hover-primary">
                              {userDetails?.wallet?.depositBalance}{" "}
                            </span>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <label className="col-lg-5 fw-bold text-muted">
                            Available Winning:
                          </label>
                          <div className="col-lg-7">
                            <span className="fw-bold fs-6 text-dark text-hover-primary">
                              {userDetails?.wallet?.winningAmount}{" "}
                            </span>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label className="col-lg-5 fw-bold text-muted">
                            Available  Bonus:
                          </label>
                          <div className="col-lg-7">
                            <span className="fw-bold fs-6 text-dark text-hover-primary">
                              {userDetails?.wallet?.bonus}{" "}
                            </span>
                          </div>
                        </div>
                        <div className="table-responsive" width="100%">
                          <DataTableBase columns={allTransColumns} data={allTransacactions} pagination={false} />
                        </div>
                        <div className="align-items-center mt-3 d-flex justify-content-between" >
                          <div className=" pl_row d-flex justify-content-start gap-3 align-items-center">
                            <label htmlFor="rowsPerPage">Rows per page: </label>
                            <select className="form-select form-select-sm my-0" id="rowsPerPage" value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)}>
                              <option value={10}>10</option>
                              <option value={25}>25</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                            </select>
                          </div>
                          {<ReactPaginate
                            pageCount={pageCount}
                            onPageChange={handlePageChange}
                            containerClassName={'customPagination'}
                            activeClassName={'active'}
                          />}
                        </div>
                      </div>
                      {/* Game Statistics Tab */}
                      <div className="tab-pane fade" id="pills-three" role="tabpanel" aria-labelledby="pills-three-tab">
                        <DataTableBase columns={GameStatisticscolumns} data={[allTransacactions]} pagination={false} />
                      </div>
                      {/* Game History Tab */}
                      <div className="tab-pane fade" id="pills-four" role="tabpanel" aria-labelledby="pills-four-tab">
                        <DataTableBase columns={GameHistorycolumns} data={[userKycDetails]} pagination={false} />
                      </div>
                      {/* User KYC Tab */}
                      <div className="tab-pane fade" id="pills-five" role="tabpanel" aria-labelledby="pills-five-tab">
                        <h3>Aadhar Card Details</h3>
                        <DataTableBase columns={UserAadhharColumns} data={[userKycDetails]} pagination />
                        <hr />
                        <br />
                        <br />
                        <h3>Pan Card Details</h3>
                        <div className="table-responsive">
                          <DataTableBase columns={UserPanColumns} data={[userKycDetails]} pagination />
                        </div>
                      </div>
                      {/* Bank / UPI Tab */}
                      <div className="tab-pane fade" id="pills-six" role="tabpanel" aria-labelledby="pills-six-tab">
                        <div className="row mb-3 d-flex justify-content-end">
                          <select
                            className="form-control form-select form-control-solid w-auto m-0"
                            name="game"
                            id=""
                            value={dataType}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleTypeChange(value);
                              if (value === "upiList") {
                                handleUserUpiDetails();
                              } else if (value === "bankList") {
                                handleUserBankDetails();
                              }
                            }}
                          >
                            <option value="upiList">UPI List</option>
                            <option value="bankList">Bank List</option>
                          </select>
                        </div>
                        <DataTableBase columns={dataType === "upiList" ? UpiDetailscolumns : BankDetailscolumns} data={data} pagination={false} />
                      </div>
                      {/* Earning Report Tab */}
                      <div
                        className="tab-pane fade"
                        id="pills-seven"
                        role="tabpanel"
                        aria-labelledby="pills-seven-tab"
                      >
                        <DataTableBase columns={EarningReportColumns} data={[panCardKycDetail]} pagination={false} />
                      </div>
                      {/* Reffer and Earn */}
                      <div className="tab-pane fade" id="pills-eight" role="tabpanel" aria-labelledby="pills-eight-tab">
                        <DataTableBase columns={ReferEarnColumns} data={referData} pagination={true} />
                      </div>
                      {/* Resposible Game Data */}

                      <div className="tab-pane fade show" id="pills-fifty" role="tabpanel" aria-labelledby="pills-fifty-tab">
                        <div className="doc_img py-5 px-4 my-4">
                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">
                              Deposit Amount Limit :
                            </label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">
                                {responsibleData?.depositAmountLimit
                                  ? responsibleData?.depositAmountLimit
                                  : "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">
                              Deposit Break :
                            </label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">
                                {responsibleData?.depositBreak === true ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">
                              Despoit Break Time :
                            </label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">
                                {responsibleData?.depositBreakTime
                                  ? moment(responsibleData.depositBreakTime).format("DD MMM YYYY LT")
                                  : "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">
                              Deposit No Limit :
                            </label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">
                                {responsibleData?.depositNoLimit
                                  ? responsibleData?.depositNoLimit
                                  : "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">
                              Poker Break :
                            </label>
                            <div className="col-lg-7 fv-row">
                              <span className="fw-bolder fs-6 text-dark">
                                {responsibleData?.pokerBreak === true ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">
                              Poker Break Limit :
                            </label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark text-hover-primary">
                                {responsibleData?.pokerBreakLimit === true ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">
                              Screen Time Break :
                            </label>
                            <div className="col-lg-7 fv-row">
                              <span className="fw-bolder fs-6 text-dark">
                                {responsibleData?.screenTimeBreak === true ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">
                              Screen Time Limit :
                            </label>
                            <div className="col-lg-7 fv-row">
                              <span className="fw-bolder fs-6 text-dark">
                                ₹{" "}
                                {responsibleData?.screenTimeLimit
                                  ? responsibleData?.screenTimeLimit
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">
                              Self Excluded:
                            </label>
                            <div className="col-lg-7 fv-row">
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={responsibleData?.isPrimeUser || false}
                                  onChange={(e) =>
                                    setResponsibleData((prev) => ({
                                      ...prev,
                                      isPrimeUser: e.target.checked,
                                    }))
                                  }
                                />
                                <span className="slider round"></span>
                              </label>
                            </div>
                          </div>



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
              <div className="modal-body">
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
                  data-bs-dismiss="modal" onClick={() => handleAddAmount("winningAmount", amount)}
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

              <div className="modal-body">
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
                  data-bs-dismiss="modal" onClick={() => handleAddAmount("depositBalance", amount)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Add Bonus_modal  */}
        <div
          className="modal fade"
          id="Bonus_modal"
          tabindex="-1"
          ariaLabelledby="add_modalLabel"
          ariaHidden="true"
        >
          <div className="modal-dialog modal-l modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="add_modalLabel">
                  Add Bonus
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
                      Bonus<span className="text-danger">* </span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="bonus" onChange={(e) => setAmount(e.target.value)}
                    />
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
                  data-bs-dismiss="modal" onClick={() => handleAddAmount("bonus", amount)}
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
              <div className="modal-body">
                <div className="card-body">
                  <div className="table-responsive" width="100%">
                    <DataTableBase
                      columns={createDynamicColumns(transDetails)}
                      data={transDetails}
                      pagination
                      highlightOnHover
                    />
                  </div>
                </div>
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