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
          totalProfit: result?.data?.totalProfit != null ? Number(result.data.totalProfit).toFixed(2) : 0,
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
      selector: (row) => (row?.resultAmount != null ? Number(row.resultAmount).toFixed(2) : "---"),
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
          <strong style={{ color: "green" }}>{row?.totalProfit != null ? Number(row.totalProfit).toFixed(2) : "---"}</strong>
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
      name: "Name",
      sortable: true,
      wrap: true,
      selector: (row) => row?.userId?.name || "------",
    },
    {
      name: "Fista User Name",
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

  const UpiDetailscolumns = [
    { name: "Sr. No.", selector: (row, index) => index + 1, },
    { name: "UPI ID", selector: (row) => row?.upiId ? row?.upiId : "-----", sortable: true },
    { name: "UPI Name", selector: (row) => row?.upiName ? row?.upiName : "-----", sortable: true },
    { name: "UPI Status", selector: (row) => row?.upiStatus ? row?.upiStatus : "-----", sortable: true },
  ];

  const bankUpiData = userBankData?.[0];
  const hasBankDetails = bankUpiData && (bankUpiData?.bankName || bankUpiData?.accountNumber || bankUpiData?.ifscCode);
  const hasUpiDetails = bankUpiData && (bankUpiData?.upiId || bankUpiData?.upiName);
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
        <main style={{ overflow: "visible" }}>
          <header className="page-header page-header-dark" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0f766e 100%)", boxShadow: "0 4px 24px rgba(13,148,136,0.25)", overflow: "visible", paddingBottom: "2rem" }}>
            <div className="container2 px-3 px-md-4" style={{ overflow: "visible" }}>
              <div className="page-header-content pt-4 pb-2">
                <div className="row align-items-center justify-content-between g-3">
                  <div className="col">
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <button
                        className="btn rounded-3 border-0 d-inline-flex align-items-center justify-content-center text-white flex-shrink-0"
                        style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px", background: "rgba(255,255,255,0.2)", fontSize: "1.1rem" }}
                        onClick={() => window.history.back()}
                        type="button"
                        aria-label="Go back"
                      >
                        <i className="fas fa-arrow-left" />
                      </button>
                      <div className="min-w-0">
                        <h1 className="page-header-title mb-0 text-white" style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                          User Details
                        </h1>
                        <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.8rem" }}>View and manage user profile, wallet & transactions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="nav nav-pills gap-2 py-3 mb-0 px-0" id="pills-tab" role="tablist" style={{ flexWrap: "wrap" }}>
                <li className="nav-item" role="presentation">
                  <button className="m-0 nav-link active rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2" id="pills-one-tab" data-bs-toggle="pill" data-bs-target="#pills-one" type="button" role="tab" aria-controls="pills-one" aria-selected="true" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>
                    <i className="fas fa-user-circle" /> User Profile
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="m-0 nav-link rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2" id="pills-two-tab" data-bs-toggle="pill" data-bs-target="#pills-two" type="button" role="tab" aria-controls="pills-two" aria-selected="false" onClick={() => handleUserGameTransaction(skip, itemsPerPage)} style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                    <i className="fas fa-gamepad" /> Game Transactions
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="m-0 nav-link rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2" id="pills-three-tab" data-bs-toggle="pill" data-bs-target="#pills-three" type="button" role="tab" aria-controls="pills-three" aria-selected="false" onClick={handleUserKycDetails} style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                    <i className="fas fa-id-card" /> User KYC
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="m-0 nav-link rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2" id="pills-four-tab" data-bs-toggle="pill" data-bs-target="#pills-four" type="button" role="tab" aria-controls="pills-four" aria-selected="false" onClick={handleUserBankDetails} style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                    <i className="fas fa-university" /> Bank / UPI
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="m-0 nav-link rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2" id="pills-five-tab" data-bs-toggle="pill" data-bs-target="#pills-five" type="button" role="tab" aria-controls="pills-five" aria-selected="false" onClick={handleUserReferralDetails} style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                    <i className="fas fa-users" /> Referral Details
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="m-0 nav-link rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2" id="pills-six-tab" data-bs-toggle="pill" data-bs-target="#pills-six" type="button" role="tab" aria-controls="pills-six" aria-selected="false" onClick={handleUserCommissionDetails} style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                    <i className="fas fa-percent" /> Commission Details
                  </button>
                </li>
              </ul>
            </div>
          </header>
          <div className="container2 user_detail_info px-3 px-md-4" style={{ marginTop: "-1.5rem" }}>
            <div className="row">
              <div className="col-xl-12 mb-4">
                <div className="card border-0 mb-4 mb-xl-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
                  <div className="card-body py-4 px-4 px-md-5 pb-0">
                    <div className="tab-content">

                      {/* User Profile Tab - Premium & Attractive */}
                      <div className="tab-pane fade show active" id="pills-one" role="tabpanel" aria-labelledby="pills-one-tab">
                        <div className="row g-4">
                          {/* Hero - bold gradient */}
                          <div className="col-12">
                            <div className="rounded-4 overflow-hidden border-0" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 35%, #14b8a6 70%, #0f766e 100%)", boxShadow: "0 20px 50px rgba(13,148,136,0.35)", position: "relative" }}>
                              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)", pointerEvents: "none" }} />
                              <div className="p-4 p-md-5 position-relative">
                                <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                                  <div className="flex-shrink-0">
                                    <div style={{ width: "120px", height: "120px", borderRadius: "50%", padding: "5px", background: "linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.15) 100%)", boxShadow: "0 0 0 4px rgba(255,255,255,0.3), 0 12px 40px rgba(0,0,0,0.2)" }}>
                                      {userDetails?.avatar && userDetails?.avatar !== "" ? (
                                        <img className="rounded-circle w-100 h-100" style={{ objectFit: "cover", border: "3px solid rgba(255,255,255,0.9)" }} crossOrigin="anonymous" src={`${imageUrl}${userDetails?.avatar}`} alt="avatar" />
                                      ) : (
                                        <img className="rounded-circle w-100 h-100" style={{ objectFit: "cover", border: "3px solid rgba(255,255,255,0.9)" }} src="/images/user_profile_img.png" alt="avatar" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-grow-1 text-center text-md-start">
                                    <h3 className="mb-1 text-white fw-bold" style={{ letterSpacing: "-0.03em", fontSize: "1.75rem", textShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
                                      {userDetails?.fullName || userDetails?.userName || "N/A"}
                                    </h3>
                                    <p className="text-white mb-3 opacity-75" style={{ fontSize: "0.85rem" }}>Member profile</p>
                                    <span
                                      className="badge rounded-pill px-3 py-2 border-0"
                                      style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.06em",
                                        ...(userDetails?.kycVerified === "VERIFIED" ? { background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", boxShadow: "0 4px 14px rgba(34,197,94,0.4)" } : {}),
                                        ...(userDetails?.kycVerified === "PENDING" ? { background: "linear-gradient(135deg, #eab308, #ca8a04)", color: "#fff", boxShadow: "0 4px 14px rgba(234,179,8,0.4)" } : {}),
                                        ...(!userDetails?.kycVerified || (userDetails?.kycVerified !== "VERIFIED" && userDetails?.kycVerified !== "PENDING") ? { background: "rgba(255,255,255,0.25)", color: "#fff" } : {}),
                                      }}
                                    >
                                      {userDetails?.kycVerified === "VERIFIED" ? "✓ VERIFIED" : userDetails?.kycVerified === "PENDING" ? "⏳ PENDING" : `KYC: ${userDetails?.kycVerified || "N/A"}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Top balance cards - 4 big stats */}
                          <div className="col-6 col-lg-3">
                            <div className="rounded-4 border-0 p-4 h-100 text-white" style={{ background: "linear-gradient(145deg, #0d9488 0%, #0f766e 100%)", boxShadow: "0 12px 32px rgba(13,148,136,0.3)" }}>
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="opacity-90" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>BALANCE (INR)</span>
                                <span style={{ width: "36px", height: "36px", borderRadius: "12px", background: "rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><i className="fas fa-rupee-sign fa-sm" /></span>
                              </div>
                              <div className="fw-bold mb-2" style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}>₹ {userDetails?.availableBalance ?? 0}</div>
                              <button type="button" className="btn btn-sm rounded-pill border-0 text-dark" style={{ background: "rgba(255,255,255,0.95)", fontWeight: 600, fontSize: "0.7rem" }} data-bs-toggle="modal" data-bs-target="#Deposit_modal">+ Add Cash</button>
                            </div>
                          </div>
                          <div className="col-6 col-lg-3">
                            <div className="rounded-4 border-0 p-4 h-100 text-white" style={{ background: "linear-gradient(145deg, #0891b2 0%, #0e7490 100%)", boxShadow: "0 12px 32px rgba(8,145,178,0.3)" }}>
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="opacity-90" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>WINNING</span>
                                <span style={{ width: "36px", height: "36px", borderRadius: "12px", background: "rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><i className="fas fa-trophy fa-sm" /></span>
                              </div>
                              <div className="fw-bold mb-2" style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}>₹ {userDetails?.availableWinningBalance ?? 0}</div>
                              <button type="button" className="btn btn-sm rounded-pill border-0 text-dark" style={{ background: "rgba(255,255,255,0.95)", fontWeight: 600, fontSize: "0.7rem" }} data-bs-toggle="modal" data-bs-target="#winning_modal">+ Add</button>
                            </div>
                          </div>
                          <div className="col-6 col-lg-3">
                            <div className="rounded-4 border-0 p-4 h-100 text-white" style={{ background: "linear-gradient(145deg, #6366f1 0%, #4f46e5 100%)", boxShadow: "0 12px 32px rgba(99,102,241,0.3)" }}>
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="opacity-90" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>USDT</span>
                                <span style={{ width: "36px", height: "36px", borderRadius: "12px", background: "rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><i className="fas fa-coins fa-sm" /></span>
                              </div>
                              <div className="fw-bold" style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}>$ {userDetails?.availableUsdtBalance ?? 0}</div>
                            </div>
                          </div>
                          <div className="col-6 col-lg-3">
                            <div className="rounded-4 border-0 p-4 h-100 text-white" style={{ background: "linear-gradient(145deg, #059669 0%, #047857 100%)", boxShadow: "0 12px 32px rgba(5,150,105,0.3)" }}>
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="opacity-90" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>REFERRAL BONUS</span>
                                <span style={{ width: "36px", height: "36px", borderRadius: "12px", background: "rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><i className="fas fa-gift fa-sm" /></span>
                              </div>
                              <div className="fw-bold" style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}>₹ {userDetails?.availableRefferalBonusBalance ?? 0}</div>
                            </div>
                          </div>

                          {/* Basic Info + Wallet row */}
                          <div className="col-12 col-lg-6">
                            <div className="card border-0 h-100 rounded-4 overflow-hidden" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #1eb5c0" }}>
                              <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(30,181,192,0.08) 0%, transparent 100%)" }}>
                                <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: "0.95rem" }}>
                                  <span className="rounded-3 d-inline-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #1eb5c0, #0d9488)", color: "#fff" }}><i className="fas fa-user" /></span>
                                  Basic Info
                                </h6>
                              </div>
                              <div className="card-body px-4 pb-4">
                                {[
                                  { label: "Name", value: userDetails?.name || "N/A", icon: "fa-user" },
                                  { label: "Fista User Name", value: userDetails?.fullName || "N/A", icon: "fa-at" },
                                  { label: "UUID", value: userDetails?.uuid || "N/A", mono: true, icon: "fa-fingerprint" },
                                  { label: "Mobile", value: userDetails?.mobileNumber || "N/A", icon: "fa-phone" },
                                  { label: "Referral Code", value: userDetails?.referCodeOfUser || "N/A", icon: "fa-tag" },
                                  { label: "Total Referral Bonus", value: `₹ ${userDetails?.totalRefferalBlanceByUser ?? 0}`, highlight: true, icon: "fa-gift" },
                                ].map((item, i) => (
                                  <div key={i} className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                                    <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: "0.8rem" }}><i className={`fas ${item.icon} fa-xs`} style={{ width: "14px", color: "#1eb5c0" }} />{item.label}</span>
                                    <span className={`fw-semibold text-end text-break ${item.highlight ? "text-success" : ""}`} style={{ fontSize: "0.85rem", maxWidth: "55%", ...(item.mono ? { fontFamily: "ui-monospace, monospace" } : {}) }}>{item.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-lg-6">
                            <div className="card border-0 h-100 rounded-4 overflow-hidden" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #0d9488" }}>
                              <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(13,148,136,0.08) 0%, transparent 100%)" }}>
                                <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: "0.95rem" }}>
                                  <span className="rounded-3 d-inline-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff" }}><i className="fas fa-wallet" /></span>
                                  Wallet Details
                                </h6>
                              </div>
                              <div className="card-body px-4 pb-4">
                                {[
                                  { label: "Commission Bonus", value: `₹ ${userDetails?.availableUserCommissionBonusBalance ?? 0}` },
                                  { label: "Locked Balance", value: `₹ ${userDetails?.availableLockedBalance ?? 0}` },
                                ].map((item, i) => (
                                  <div key={i} className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                                    <span className="text-muted" style={{ fontSize: "0.8rem" }}>{item.label}</span>
                                    <span className="fw-semibold" style={{ fontSize: "0.85rem" }}>{item.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Transaction Summary - premium stat cards */}
                          <div className="col-12">
                            <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #6366f1" }}>
                              <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.08) 0%, transparent 100%)" }}>
                                <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: "0.95rem" }}>
                                  <span className="rounded-3 d-inline-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff" }}><i className="fas fa-chart-line" /></span>
                                  Transaction Summary
                                </h6>
                              </div>
                              <div className="card-body px-4 pb-4">
                                <div className="row g-3">
                                  {[
                                    { label: "Total Deposits (INR)", value: `₹ ${userDetails?.totalDepositByUser ?? 0}`, color: "#0d9488", icon: "fa-arrow-down" },
                                    { label: "Total Deposits (USDT)", value: `$ ${userDetails?.totalDepositByUserUSDT ?? 0}`, color: "#6366f1", icon: "fa-coins" },
                                    { label: "Total Withdrawals (INR)", value: `₹ ${userDetails?.totalWithdrawalByUser ?? 0}`, color: "#dc2626", icon: "fa-arrow-up" },
                                    { label: "Total Withdrawals (USDT)", value: `$ ${userDetails?.totalWithdrawalByUserUSDT ?? 0}`, color: "#6366f1", icon: "fa-coins" },
                                    { label: "Total Commission", value: `₹ ${userDetails?.totalCommissionBalanceByUser ?? 0}`, color: "#16a34a", icon: "fa-percent", highlight: true },
                                  ].map((stat, i) => (
                                    <div key={i} className="col-6 col-md-4 col-lg">
                                      <div className="rounded-4 p-4 h-100 border-0 position-relative overflow-hidden" style={{ background: stat.highlight ? "linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.05) 100%)" : "#f8fafc", borderLeft: `4px solid ${stat.color}` }}>
                                        <div className="text-muted mb-1 d-flex align-items-center gap-2" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                                          <i className={`fas ${stat.icon}`} style={{ color: stat.color, fontSize: "0.65rem" }} />{stat.label}
                                        </div>
                                        <div className={`fw-bold ${stat.highlight ? "text-success" : "text-dark"}`} style={{ fontSize: "1.1rem" }}>{stat.value}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tab Contents - Premium wrappers */}
                      <div className="tab-content pt-2" id="pills-tabContent">
                        <div className="tab-pane fade" id="pills-two" role="tabpanel" aria-labelledby="pills-two-tab">
                          <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderTop: "3px solid #6366f1" }}>
                            <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.08) 0%, transparent 100%)" }}>
                              <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: "0.95rem" }}>
                                <span className="rounded-3 d-inline-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff" }}><i className="fas fa-gamepad" /></span>
                                Game Transactions
                              </h6>
                            </div>
                            <div className="card-body p-0">
                              <DataTableBase columns={UserGameDetails} data={gameData || []} pagination />
                            </div>
                          </div>
                        </div>

                        <div className="tab-pane fade" id="pills-three" role="tabpanel" aria-labelledby="pills-three-tab">
                          <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderTop: "3px solid #0d9488" }}>
                            <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(13,148,136,0.08) 0%, transparent 100%)" }}>
                              <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: "0.95rem" }}>
                                <span className="rounded-3 d-inline-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff" }}><i className="fas fa-id-card" /></span>
                                User KYC Details
                              </h6>
                            </div>
                            <div className="card-body p-0">
                              <DataTableBase columns={UserKycDetails} data={userKycDetail || []} />
                            </div>
                          </div>
                        </div>

                        <div className="tab-pane fade" id="pills-four" role="tabpanel" aria-labelledby="pills-four-tab">
                          <div className="row g-4">
                            {hasBankDetails && (
                              <div className="col-12">
                                <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderTop: "3px solid #0d9488" }}>
                                  <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(13,148,136,0.08) 0%, transparent 100%)" }}>
                                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: "0.95rem" }}>
                                      <span className="rounded-3 d-inline-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff" }}><i className="fas fa-university" /></span>
                                      Bank Details
                                    </h6>
                                  </div>
                                  <div className="card-body p-0">
                                    <DataTableBase columns={BankDetailscolumns} data={userBankData || []} pagination={false} />
                                  </div>
                                </div>
                              </div>
                            )}
                            {hasUpiDetails && (
                              <div className="col-12">
                                <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderTop: "3px solid #6366f1" }}>
                                  <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.08) 0%, transparent 100%)" }}>
                                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: "0.95rem" }}>
                                      <span className="rounded-3 d-inline-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff" }}><i className="fas fa-mobile-alt" /></span>
                                      UPI Details
                                    </h6>
                                  </div>
                                  <div className="card-body p-0">
                                    <DataTableBase columns={UpiDetailscolumns} data={userBankData || []} pagination={false} />
                                  </div>
                                </div>
                              </div>
                            )}
                            {!hasBankDetails && !hasUpiDetails && userBankData?.length > 0 && (
                              <div className="col-12">
                                <div className="text-center py-5 text-muted rounded-4" style={{ background: "#f8fafc" }}>No bank or UPI details available.</div>
                              </div>
                            )}
                            {(!userBankData || userBankData.length === 0) && (
                              <div className="col-12">
                                <div className="text-center py-5 text-muted rounded-4" style={{ background: "#f8fafc" }}>Click <strong>Bank / UPI</strong> tab above to load details.</div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="tab-pane fade" id="pills-five" role="tabpanel" aria-labelledby="pills-five-tab">
                          <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderTop: "3px solid #059669" }}>
                            <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(5,150,105,0.08) 0%, transparent 100%)" }}>
                              <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: "0.95rem" }}>
                                <span className="rounded-3 d-inline-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #059669, #047857)", color: "#fff" }}><i className="fas fa-users" /></span>
                                Referral Details
                              </h6>
                            </div>
                            <div className="card-body p-0">
                              <DataTableBase columns={UserReferralDetails} data={referData} pagination />
                            </div>
                          </div>
                        </div>

                        <div className="tab-pane fade" id="pills-six" role="tabpanel" aria-labelledby="pills-six-tab">
                          <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderTop: "3px solid #16a34a" }}>
                            <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(22,163,74,0.08) 0%, transparent 100%)" }}>
                              <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: "0.95rem" }}>
                                <span className="rounded-3 d-inline-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff" }}><i className="fas fa-percent" /></span>
                                Commission Details
                              </h6>
                            </div>
                            <div className="card-body p-0">
                              <DataTableBase columns={UserCommissionDetails} data={userCommissionData} pagination />
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
        {/* Edit User Profile modal */}
        <div className="modal fade" id="add_modal" tabIndex="-1" aria-labelledby="add_modalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <div className="modal-header border-0 py-4 px-4" style={{ background: "linear-gradient(135deg, #1eb5c0 0%, #0d9488 100%)" }}>
                <h5 className="modal-title text-white d-flex align-items-center gap-2 fw-bold" id="add_modalLabel" style={{ fontSize: "1.1rem" }}>
                  <i className="fas fa-user-edit" /> Edit User Profile
                </h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body px-4 py-4">
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>User Name <span className="text-danger">*</span></label>
                    <input value={username} onChange={(e) => setUsername(e.target.value?.toUpperCase())} type="text" className="form-control form-control-solid rounded-3 border" name="username" placeholder="Enter User Name" style={{ padding: "0.6rem 1rem" }} />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 px-4 py-3 bg-light">
                <button type="button" className="btn rounded-pill px-4" style={{ background: "#64748b", color: "#fff" }} data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn rounded-pill px-4 border-0 text-white" style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }} data-bs-dismiss="modal" onClick={() => handleUpdateProfile(username)}>Update</button>
              </div>
            </div>
          </div>
        </div>
        {/* Add Winning Cash modal */}
        <div className="modal fade" id="winning_modal" tabIndex="-1" aria-labelledby="winning_modalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <div className="modal-header border-0 py-4 px-4" style={{ background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)" }}>
                <h5 className="modal-title text-white d-flex align-items-center gap-2 fw-bold" id="winning_modalLabel" style={{ fontSize: "1.1rem" }}>
                  <i className="fas fa-trophy" /> Add Winning Cash
                </h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body depositform px-4 py-4">
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>Winning Cash <span className="text-danger">*</span></label>
                    <input type="text" className="form-control form-control-solid rounded-3 border" name="winningCash" onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" style={{ padding: "0.6rem 1rem" }} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>Wallet Type <span className="text-danger">*</span></label>
                    <select className="form-control form-select rounded-3 border" value={winingWalletType} onChange={(e) => setWiningWalletType(e.target.value)} style={{ padding: "0.6rem 1rem" }}>
                      <option value="INR">INR</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 px-4 py-3 bg-light">
                <button type="button" className="btn rounded-pill px-4" style={{ background: "#64748b", color: "#fff" }} data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn rounded-pill px-4 border-0 text-white" style={{ background: "linear-gradient(135deg, #0891b2, #0e7490)" }} data-bs-dismiss="modal" onClick={() => handleAddWinningAmount(winingWalletType, amount)}>Submit</button>
              </div>
            </div>
          </div>
        </div>
        {/* Add Deposit Cash modal */}
        <div className="modal fade" id="Deposit_modal" tabIndex="-1" aria-labelledby="Deposit_modalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <div className="modal-header border-0 py-4 px-4" style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" }}>
                <h5 className="modal-title text-white d-flex align-items-center gap-2 fw-bold" id="Deposit_modalLabel" style={{ fontSize: "1.1rem" }}>
                  <i className="fas fa-rupee-sign" /> Add Deposit Cash
                </h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body depositform px-4 py-4">
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>Deposit Cash <span className="text-danger">*</span></label>
                    <input type="text" className="form-control form-control-solid rounded-3 border" name="addDeposit" onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" style={{ padding: "0.6rem 1rem" }} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>Wallet Type <span className="text-danger">*</span></label>
                    <select className="form-control form-select rounded-3 border" value={walletType} onChange={(e) => setWalletType(e.target.value)} style={{ padding: "0.6rem 1rem" }}>
                      <option value="INR">INR</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 px-4 py-3 bg-light">
                <button type="button" className="btn rounded-pill px-4" style={{ background: "#64748b", color: "#fff" }} data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn rounded-pill px-4 border-0 text-white" style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }} data-bs-dismiss="modal" onClick={() => handleAddDepositAmount(walletType, amount)}>Submit</button>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet history modal */}
        <div className="modal fade" id="wallet_history_modal" tabIndex="-1" aria-labelledby="wallet_history_modalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <div className="modal-header border-0 py-4 px-4" style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}>
                <h5 className="modal-title text-white d-flex align-items-center gap-2 fw-bold" id="wallet_history_modalLabel" style={{ fontSize: "1.1rem" }}>
                  <i className="fas fa-history" /> All Transactions Details
                </h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" />
              </div>
            </div>
          </div>
        </div>
        {/* Responsible game modal */}
        <div className="modal fade" id="responsible_game_modal" tabIndex="-1" aria-labelledby="responsible_game_modalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <div className="modal-header border-0 py-4 px-4" style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}>
                <h5 className="modal-title text-white d-flex align-items-center gap-2 fw-bold" id="responsible_game_modalLabel" style={{ fontSize: "1.1rem" }}>
                  <i className="fas fa-shield-alt" /> Edit Responsible Game Details
                </h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body px-4 py-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>Deposit Amount Limit <span className="text-danger">*</span></label>
                    <input type="text" className="form-control form-control-solid rounded-3 border" name="wonCoin" placeholder="Enter limit" style={{ padding: "0.6rem 1rem" }} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>Deposit No Limit <span className="text-danger">*</span></label>
                    <input type="number" className="form-control form-control-solid rounded-3 border" name="totalBet" placeholder="Enter value" style={{ padding: "0.6rem 1rem" }} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>Poker Break <span className="text-danger">*</span></label>
                    <input type="number" className="form-control form-control-solid rounded-3 border" name="totalBet" placeholder="Enter value" style={{ padding: "0.6rem 1rem" }} />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 px-4 py-3 bg-light">
                <button type="button" className="btn rounded-pill px-4" style={{ background: "#64748b", color: "#fff" }} data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn rounded-pill px-4 border-0 text-white" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }} data-bs-dismiss="modal">Update</button>
              </div>
            </div>
          </div>
        </div>
        {/* Image preview modal */}
        <div className="modal image_modal" id="ImageModal" tabIndex="-1" role="dialog" aria-labelledby="ImageModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              <div className="modal-header border-0 py-2 px-3 bg-dark justify-content-end">
                <button className="btn-close btn-close-white" type="button" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="ratio ratio-16x9 bg-dark">
                <img src={showImage} loading="lazy" className="w-100 cc_modal_img" style={{ objectFit: "contain" }} alt="Preview" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserDetails;