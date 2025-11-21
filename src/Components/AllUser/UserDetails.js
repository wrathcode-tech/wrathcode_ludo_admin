import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage } from "../../Utils/CustomAlertMessage";
import DataTableBase from "../../Utils/DataTable";
import { imageUrl } from "../../Api/Api_Config/ApiEndpoints";

function UserDetails() {
  const location = useLocation();
  const [userDetails, setUserDetails] = useState([]);
  const [userKycDetail, setUserKycDetail] = useState([]);
  const [referData, setReferData] = useState([]);
  const [walletType, setWalletType] = useState("INR");
  const [amount, setAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0)
  const [username, setUsername] = useState("");
  const [showImage, setShowImage] = useState("");
  const [winingWalletType, setWiningWalletType] = useState("INR");
  const [userCommissionData, setUserCommissionData] = useState([]);
  const [userBankData, setUserBankData] = useState([]);
  const [gameData, setGameData] = useState([]);




  // pagination control can be wired when needed

  // pagination UI is not rendered; keep values for backend pagination only
  const skip = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    if (totalData > 0) {

      handleUserGameTransaction(skip, itemsPerPage);
    }
  }, [currentPage, skip, itemsPerPage]);

  // Api functions start header
  useEffect(() => {
    handleUserDetails();
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

      if (result?.success && Array.isArray(result?.data)) {
        const tableData = result.data.map((item, index) => ({
          index: index + 1,
          sponsorName: item?.sponserId?.fullName || "-----",
          sponsorUUID: item?.sponserId?.uuid || "-----",
          userName: item?.userId?.fullName || "-----",
          userUUID: item?.userId?.uuid || "-----",
          sponserCode: item?.sponserCode || "-----",
          bonusAmount: item?.bonusAmount || 0,
          walletType: item?.walletType || "-----",
          status: item?.status || "-----",
          transactionType: item?.transactionType || "-----",
          createdAt: item?.createdAt || "",
        }));

        setReferData(tableData);
      } else {
        alertErrorMessage("No referral data found");
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error.message);
    }
  };

  const handleUserCommissionDetails = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getUserCommissionDetails(location?.state?.userId); // your API
      LoaderHelper.loaderStatus(false);

      if (result?.success && Array.isArray(result?.data)) {
        const tableData = result.data.map((item, index) => ({
          index: index + 1,
          userName: item?.userId?.fullName || "-----",
          mobileNumber: item?.userId?.mobile || "-----",
          uuid: item?.userId?.uuid || "-----",
          referralBonus: item?.commissionAmount || 0,
          referrerBonus: item?.totalBetAmmount || 0,
          createdAt: item?.createdAt || "",
          description: item?.transactionType || "-----",
        }));

        setUserCommissionData(tableData);
      } else {
        alertErrorMessage("No commission data found");
      }
    } catch (err) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage("Error fetching commission data");
      console.error(err);
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
  // helper to flatten nested objects for display (removed, unused)
  // user delete UI/flow removed (no supporting service)
  const handleImageDetail = (img) => {
    setShowImage(img);
  };
  // React Data table Start from here

  const UserGameDetails = [
    {
      name: "Sr. No.",
      selector: (row) => (row?.index ? row.index : "---"),
      width: "80px",
      cell: (row) =>
        row?.isSummaryRow ? <strong>Total</strong> : row?.index || "---",
    },
    {
      name: "Event ID",
      selector: (row) =>
        row?.eventId ? row.eventId.substring(0, 8).toUpperCase() : "---",
      cell: (row) =>
        row?.isSummaryRow ? (
          <strong style={{ color: "#007bff" }}>Summary</strong>
        ) : (
          row?.eventId?.substring(0, 8).toUpperCase() || "---"
        ),
    },
    {
      name: "Bet Amount",
      selector: (row) => row?.betAmount ?? "---",
      sortable: true,
    },
    {
      name: "Total Bet Pool", width: "150px",
      selector: (row) => row?.totalBetPool ?? "---",
      sortable: true,
    },
    {
      name: "Admin Commission", width: "170px",
      selector: (row) => row?.adminCommission ?? "---",
      sortable: true,
    },
    {
      name: "Result Amount", width: "150px",
      selector: (row) => row?.resultAmount ?? "---",
      sortable: true,
    },
    {
      name: "Wallet Type", width: "150px",
      selector: (row) => row?.walletType || "---",
    },
    {
      name: "Role", width: "150px",
      selector: (row) => row?.role || "---",
    },
    {
      name: "Status", width: "150px",
      selector: (row) => row?.status || "---",
    },
    {
      name: "Total Games Played", width: "150px",
      selector: (row) =>
        row?.isSummaryRow ? (
          <strong>{row.totalGames}</strong>
        ) : (
          row?.totalGames ?? "---"
        ),
    },
    {
      name: "Total Lost Game", width: "150px",
      selector: (row) =>
        row?.isSummaryRow ? (
          <strong>{row.totalLoss}</strong>
        ) : (
          row?.totalLoss ?? "---"
        ),
    },
    {
      name: "Total Game Profit", width: "150px",
      selector: (row) =>
        row?.isSummaryRow ? (
          <strong style={{ color: "green" }}>{row.totalProfit}</strong>
        ) : (
          row?.totalProfit ?? "---"
        ),
    },
    {
      name: "Total Game Win", width: "150px",
      selector: (row) =>
        row?.isSummaryRow ? (
          <strong style={{ color: "blue" }}>{row.totalWin}</strong>
        ) : (
          row?.totalWin ?? "---"
        ),
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
      selector: (row) => row?.userId?.fullName || "------",
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
      cell: (row) =>
        row?.documentFrontImage ? (
          <img
            className="table-img w-100 cursor-pointer"
            src={`${imageUrl}/${row.documentFrontImage}`}
            data-bs-toggle="modal"
            data-bs-target="#ImageModal"
            onClick={() => handleImageDetail(`${imageUrl}/${row.documentFrontImage}`)}
            alt="DocumentFrontImage"
          />
        ) : (
          "---"
        ),
    },
    {
      name: "Document Back Image",
      center: true,
      sortable: true,
      wrap: true,
      cell: (row) =>
        row?.documentBackImage ? (
          <img
            className="table-img w-100 cursor-pointer"
            src={`${imageUrl}/${row.documentBackImage}`}
            data-bs-toggle="modal"
            data-bs-target="#ImageModal"
            onClick={() => handleImageDetail(`${imageUrl}/${row.documentBackImage}`)}
            alt="DocumentBackImage"
          />
        ) : (
          "---"
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
      cell: (row) =>
        "---",
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
    {
      name: "Sr. No.",
      selector: (row) => row.index,
      width: "80px",
    },
    {
      name: "Sponsor Name", width: "150px",
      selector: (row) => row.sponsorName,
      sortable: true,
    },
    {
      name: "Sponsor UUID", width: "150px",
      selector: (row) => row.sponsorUUID,
      sortable: true,
    },
    {
      name: "Referred User Name", width: "180px",
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: "Referred User UUID", width: "180px",
      selector: (row) => row.userUUID,
      sortable: true,
    },
    {
      name: "Sponsor Code", width: "150px",
      selector: (row) => row.sponserCode,
      sortable: true,
    },
    {
      name: "Bonus Amount", width: "150px",
      selector: (row) => row.bonusAmount,
      sortable: true,
    },
    {
      name: "Wallet Type", width: "150px",
      selector: (row) => row.walletType,
      sortable: true,
    },
    {
      name: "Status", width: "150px",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Transaction Type", width: "150px",
      selector: (row) => row.transactionType,
      sortable: true,
    },
    {
      name: "Date & Time",
      width: "180px",
      selector: (row) =>
        row?.createdAt ? moment(row.createdAt).format("DD-MM-YYYY LT") : "-----",
      sortable: true,
    },
  ];

  const UserCommissionDetails = [
    {
      name: "Sr. No.",
      selector: (row) => row?.index,
      width: "80px",
    },
    {
      name: "User Name",
      selector: (row) => row?.userName || "-----",
      sortable: true,
    },
    {
      name: "Mobile Number",
      selector: (row) => row?.mobileNumber || "-----",
      sortable: true,
    },
    {
      name: "Referred User ID",
      selector: (row) => row?.uuid || "-----",
      sortable: true,
    },
    {
      name: "Referral Bonus",
      selector: (row) => row?.referralBonus ?? "-----",
      sortable: true,
    },
    {
      name: "Referrer Bonus",
      selector: (row) => row?.referrerBonus ?? "-----",
      sortable: true,
    },
    {
      name: "Date & Time",
      width: "180px",
      selector: (row) =>
        row?.createdAt ? moment(row.createdAt).format("DD-MM-YYYY LT") : "-----",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row?.description || "-----",
      sortable: true,
    },
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
                                src={`${imageUrl}${userDetails?.avatar}`}
                                alt="avatar"
                              />
                            ) : (
                              <img
                                className="img-account-profile rounded-circle mb-2 mb-lg-0"
                                src="/images/user_profile_img.png"
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


                          {/* <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Email Id:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">{userDetails?.emailId || "N/A"}</span>
                            </div>
                          </div> */}

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
                          <h5 className="fw-bold mb-3">Wallet Details</h5>

                          <div className="row align-items-center mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Available Balance INR:</label>
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

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Available Balance USDT:</label>
                            <div className="col-lg-4">
                              <span className="fw-bolder fs-6 text-dark">$ {userDetails?.availableUsdtBalance || 0}</span>
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
                          <h5 className="fw-bold mb-3">Transaction Summary</h5>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Total Deposits INR:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">₹ {userDetails?.totalDepositByUser || 0}</span>
                            </div>
                          </div>
                          <div className="row mb-3" style={{ marginTop: "5px" }}>
                            <label className="col-lg-5 fw-bold text-muted">Total Deposits USDT:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">$ {userDetails?.totalDepositByUserUSDT || 0}</span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Total Withdrawals:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">₹ {userDetails?.totalWithdrawalByUser || 0}</span>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-lg-5 fw-bold text-muted">Total Withdrawals USDT:</label>
                            <div className="col-lg-7">
                              <span className="fw-bolder fs-6 text-dark">$ {userDetails?.totalWithdrawalByUserUSDT || 0}</span>
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
                          <DataTableBase columns={UserGameDetails} data={gameData || []} pagination />
                        </div>

                        {/* 3️⃣ User KYC Details Tab */}
                        <div className="tab-pane fade" id="pills-three" role="tabpanel" aria-labelledby="pills-three-tab">
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
                <img src={showImage} loading="lazy" className="w-100 cc_modal_img " alt="" />
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