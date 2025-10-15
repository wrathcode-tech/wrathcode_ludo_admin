import { ApiConfig } from "../Api_Config/ApiEndpoints";
import { ApiCallDelete, ApiCallGet, ApiCallPost, ApiCallPut } from "../Api_Config/ApiCall";

const AuthService = {
  /*** Calling Api's **/
  register: async (signId, otp, password, cPassword) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, register } = ApiConfig;
    const url = baseUrl + register;
    const params = {
      emailId: signId,
      otp: otp,
      password: password,
      confirmPassword: cPassword,
      token: token,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  login: async (emailId, password, otp, token) => {
    const { baseUrl, login } = ApiConfig;
    const url = baseUrl + login;
    const params = {
      email_or_phone: emailId,
      password: password,
      verification_code: otp,
      token
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return ApiCallPost(url, params, headers);
  },

  getOtp: async (emailId) => {
    const { baseUrl, getOtp } = ApiConfig;
    const url = baseUrl + getOtp;
    const params = {
      email_or_phone: emailId,
      resent: true,
      type: "register",
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return ApiCallPost(url, params, headers);
  },

  usersStatusUpdate: async (userId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, usersStatusUpdate } = ApiConfig;
    const url = baseUrl + usersStatusUpdate;
    const params = {
      userId, status
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token
    };
    return ApiCallPost(url, params, headers);
  },
  updateAdminSettings: async (adminCommission, referralBonusAmount, userCommissionBonusAmount, referralBonusSignUpAmount,
    minimumDeposit, maximumDeposit, minimumWithdrawal, maximumWithdrawal, bonusAmountUse, minimumGameAmount, maximumGameAmount,
    bonusUsedPercent, minimumDepositUsdt, minimumWithdrawalUsdt, maximumDepositUsdt, maximumWithdrawalUsdt) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, updateAdminSettings } = ApiConfig;
    const url = baseUrl + updateAdminSettings;
    const params = {
      adminCommission,
      referralBonusAmount,
      userCommissionBonusAmount,
      referralBonusSignUpAmount,
      minimumDeposit,
      minimumWithdrawal,
      maximumDeposit,
      maximumWithdrawal,
      bonusAmountUse,
      minimumGameAmount,
      maximumGameAmount,
      bonusUsedPercent,
      minimumDepositUsdt,
      minimumWithdrawalUsdt,
      maximumDepositUsdt,
      maximumWithdrawalUsdt

    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token
    };
    return ApiCallPost(url, params, headers);
  },


  addNotification: async (title, message) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, addNotification } = ApiConfig;
    const url = baseUrl + addNotification;
    const params = {
      title, message
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token
    };
    return ApiCallPost(url, params, headers);
  },

  updateTicketStatus: async (ticketId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, updateTicketStatus } = ApiConfig;
    const url = baseSupport + updateTicketStatus;
    const params = {
      ticketId, status
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token
    };
    return ApiCallPost(url, params, headers);
  },

  addBlog: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, addBlog } = ApiConfig;
    const url = baseUrl + addBlog;

    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token
    };
    return ApiCallPost(url, formData, headers);
  },
  msgSend: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, msgSend } = ApiConfig;
    const url = baseSupport + msgSend;

    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token
    };
    return ApiCallPost(url, formData, headers);
  },
  updateKycStatus: async (userId, status, reason) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, updateKycStatus } = ApiConfig;
    const url = baseUrl + updateKycStatus;
    const params = {
      userId: userId,
      status,
      kycRejectReason: reason
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token
    };
    return ApiCallPost(url, params, headers);
  },


  getProfile: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getProfile } = ApiConfig;
    const url = baseUrl + getProfile;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  pendingWithdrawalRequest: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, pendingWithdrawalRequest } = ApiConfig;
    const url = baseUrl + pendingWithdrawalRequest;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  approvedWithdrawalRequest: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, approvedWithdrawalRequest } = ApiConfig;
    const url = baseUrl + approvedWithdrawalRequest;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  cancelWithdrawalRequest: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, cancelWithdrawalRequest } = ApiConfig;
    const url = baseUrl + cancelWithdrawalRequest;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  pendingDepositRequest: async (page, pageSize) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, pendingDepositRequest } = ApiConfig;
    const url = `${baseUrl}${pendingDepositRequest}?page=${page}&pageSize=${pageSize}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  getUsersRespose: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getUsersRespose } = ApiConfig;
    const url = baseUrl + getUsersRespose;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  getDisputeUsersRespose: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getDisputeUsersRespose } = ApiConfig;
    const url = baseUrl + getDisputeUsersRespose;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  getParticularResponseView: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getParticularResponseView } = ApiConfig;
    const url = baseUrl + getParticularResponseView;
    const params = {
      id: id,
    }
    const headers = {
      "Content-Type": "application/json",
      'Authorization': token
    };

    return ApiCallPost(url, params, headers);
  },
  refundEventFund: async (eventId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, refundEventFund } = ApiConfig;
    const url = `${baseUrl}${refundEventFund}?eventId=${eventId}`;

    const headers = {
      "Content-Type": "application/json",
      'Authorization': token
    };

    return ApiCallGet(url, headers);
  },
  chooseWinner: async (eventId, winnerId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, chooseWinner } = ApiConfig;
    const url = baseUrl + chooseWinner;
    const params = {
      eventId: eventId,
      winnerId: winnerId
    }
    const headers = {
      "Content-Type": "application/json",
      'Authorization': token
    };

    return ApiCallPost(url, params, headers);
  },
  addUserWinningAmount: async (userId, walletType, amount) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, addUserWinningAmount } = ApiConfig;
    const url = baseUrl + addUserWinningAmount;
    const params = {
      userId: userId,
      walletType: walletType,
      amount
    }
    const headers = {
      "Content-Type": "application/json",
      'Authorization': token
    };

    return ApiCallPost(url, params, headers);
  },
  addDepositAmount: async (userId, walletType, amount) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, addDepositAmount } = ApiConfig;
    const url = baseUrl + addDepositAmount;
    const params = {
      userId: userId,
      walletType: walletType,
      amount
    }
    const headers = {
      "Content-Type": "application/json",
      'Authorization': token
    };

    return ApiCallPost(url, params, headers);
  },
  allCompletedLudoGameList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, allCompletedLudoGameList } = ApiConfig;
    const url = baseUrl + allCompletedLudoGameList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  allDisputedLudoGameList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, allDisputedLudoGameList } = ApiConfig;
    const url = baseUrl + allDisputedLudoGameList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  getUserDetails: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getUserDetails } = ApiConfig;
    const url = `${baseUrl}${getUserDetails}?userId=${userId}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  userGameTransations: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getuserGameTransations } = ApiConfig;
    const url = `${baseUrl}${getuserGameTransations}?userId=${userId}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  getuserKycDetails: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getuserKycDetails } = ApiConfig;
    const url = `${baseUrl}${getuserKycDetails}?userId=${userId}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  getUserBankDetails: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getUserBankDetails } = ApiConfig;
    const url = `${baseUrl}${getUserBankDetails}?userId=${userId}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  getUserReferralDetails: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getUserReferralDetails } = ApiConfig;
    const url = `${baseUrl}${getUserReferralDetails}?userId=${userId}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  getUserCommissionDetails: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getUserCommissionDetails } = ApiConfig;
    const url = `${baseUrl}${getUserCommissionDetails}?userId=${userId}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  allRunningLudoGameList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, allRunningLudoGameList } = ApiConfig;
    const url = baseUrl + allRunningLudoGameList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  allExpiredLudoGameList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, allExpiredLudoGameList } = ApiConfig;
    const url = baseUrl + allExpiredLudoGameList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  allWaitingLudoGameList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, allWaitingLudoGameList } = ApiConfig;
    const url = baseUrl + allWaitingLudoGameList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  allCancelLudoGameList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, allCancelLudoGameList } = ApiConfig;
    const url = baseUrl + allCancelLudoGameList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  allDisputeLudoGameList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, allDisputeLudoGameList } = ApiConfig;
    const url = baseUrl + allDisputeLudoGameList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  getpendingKycList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getpendingKycList } = ApiConfig;
    const url = baseUrl + getpendingKycList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  getapprovedKycList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getapprovedKycList } = ApiConfig;
    const url = baseUrl + getapprovedKycList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  getrejectedKycList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getrejectedKycList } = ApiConfig;
    const url = baseUrl + getrejectedKycList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },

  dashboardList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, dashboardList } = ApiConfig;
    const url = baseUrl + dashboardList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  contactusList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, contactusList } = ApiConfig;
    const url = baseUrl + contactusList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  deleteNotification: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, deleteNotification } = ApiConfig;
    const url = baseUrl + deleteNotification + `/${id}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallDelete(url, headers);
  },


  deleteBlog: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, deleteBlog } = ApiConfig;
    const url = baseUrl + deleteBlog + `/${id}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallDelete(url, headers);
  },

  adminViewTicket: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, adminViewTicket } = ApiConfig;
    const url = baseSupport + adminViewTicket + `/${id}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },

  replyTicket: async (messagerply, id) => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, replyTicket } = ApiConfig;
    const url = baseSupport + replyTicket;
    const params = {
      replyBy: 0,
      query: messagerply,
      ticketId: id,

    }
    const headers = {
      "Content-Type": "application/json",
      'Authorization': token
    };

    return ApiCallPost(url, params, headers);
  },

  usersList: async (page, pageSize) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, usersList } = ApiConfig;
    const url = `${baseUrl}${usersList}?page=${page}&pageSize=${pageSize}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  depositWithdraList: async (page, pageSize) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, depositWithdraList } = ApiConfig;
    const url = `${baseUrl}${depositWithdraList}?page=${page}&pageSize=${pageSize}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  usersOverAllReferalBonusEarn: async (page, pageSize) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, usersOverAllReferalBonusEarn } = ApiConfig;
    const url = `${baseUrl}${usersOverAllReferalBonusEarn}?page=${page}&pageSize=${pageSize}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  usersOverAllCommissionBonusEarn: async (page, pageSize) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, usersOverAllCommissionBonusEarn } = ApiConfig;
    const url = `${baseUrl}${usersOverAllCommissionBonusEarn}?page=${page}&pageSize=${pageSize}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },

  getOpenTickets: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, getOpenTickets } = ApiConfig;
    const url = baseSupport + getOpenTickets;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
  dashboardData: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, dashboardData } = ApiConfig;
    const url = baseUrl + dashboardData;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },

  getClosedTickets: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, getClosedTickets } = ApiConfig;
    const url = baseSupport + getClosedTickets;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },

  getResolvedTickets: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, getResolvedTickets } = ApiConfig;
    const url = baseSupport + getResolvedTickets;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },

  blogList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, blogList } = ApiConfig;
    const url = baseUrl + blogList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },


  // notificationList: async () => {
  //   const token = sessionStorage.getItem("token");
  //   const { baseUrl, notificationList } = ApiConfig;
  //   const url = baseUrl + notificationList;
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     Authorization: token
  //   };
  //   return ApiCallGet(url, headers);
  // },

  getActivityData: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getActivityData } = ApiConfig;
    const url = baseUrl + getActivityData;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },

  supportData: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, supportData } = ApiConfig;
    const url = baseSupport + supportData;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },

  getChatbox: async (_id) => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, Chatbox } = ApiConfig;
    const url = `${baseSupport}${Chatbox}?id=${_id}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },

  // getNotificationList: async () => {
  //   const token = sessionStorage.getItem("token");
  //   const { baseUrl, notificationList } = ApiConfig;
  //   const url = baseUrl + notificationList;
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     Authorization: token
  //   };
  //   return ApiCallGet(url, headers);
  // },
  editProfile: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, profileEdit } = ApiConfig;
    const url = baseUrl + profileEdit;
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };

    return ApiCallPost(url, formData, headers);
  },
  addAdminBankDetails: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, addAdminBankDetails } = ApiConfig;
    const url = baseUrl + addAdminBankDetails;
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };

    return ApiCallPost(url, formData, headers);
  },

  ticketSubmit: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, ticketSubmit } = ApiConfig;
    const url = baseSupport + ticketSubmit;
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };

    return ApiCallPost(url, formData, headers);
  },

  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, changePassword } = ApiConfig;
    const url = baseUrl + changePassword;
    const params = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  updateWithdrawalStatus: async (userId, status, transactionId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, updateWithdrawalStatus } = ApiConfig;
    const url = baseUrl + updateWithdrawalStatus;
    const params = {
      userId: userId,
      status: status,
      transactionId: transactionId,

    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  updateDepositRequest: async (userId, transactionId, status, rejectReason) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, updateDepositRequest } = ApiConfig;
    const url = baseUrl + updateDepositRequest;
    const params = {
      userId: userId,
      transactionId: transactionId,
      status: status,
      rejectReason
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

  getMsgUser: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, getMsgUser } = ApiConfig;
    const url = `${baseSupport}${getMsgUser}/${userId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  getAdminBankDetails: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getAdminBankDetails } = ApiConfig;
    const url = `${baseUrl}${getAdminBankDetails}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  allMsg: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, allMsg } = ApiConfig;
    const url = `${baseSupport}${allMsg}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },


  msgSeen: async (userId, viewer) => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, msgSeen } = ApiConfig;
    const url = baseSupport + msgSeen;
    const params = {
      userId,
      viewer
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  updateStatusAdminBank: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, updateStatusAdminBank } = ApiConfig;
    const url = baseUrl + updateStatusAdminBank;
    const params = {
      id: id,
      status
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getNotificationList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, notificationList } = ApiConfig;
    const url = baseNotification + notificationList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  deleteNotify: async (notificationId) => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, deleteNotify } = ApiConfig;
    const url = `${baseNotification + deleteNotify}/${notificationId}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  sendNotificationToUser: async (userId, title, message, link) => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, singalUser } = ApiConfig;
    const url = baseNotification + singalUser;
    const params = {
      userId: userId,
      title: title,
      message: message,
      link: link
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },


  sendBulkNotification: async (userId, title, message, link) => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, sendBulkNotification } = ApiConfig;
    const url = baseNotification + sendBulkNotification;
    const params = {
      "userIds": userId,
      title: title,
      message: message,
      link: link
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  sendAllNotification: async (title, message, link) => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, sendToAll } = ApiConfig;
    const url = baseNotification + sendToAll;
    const params = {
      title: title,
      message: message,
      link: link
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },


  updateNotificationStatus: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, updateNotificationStatus } = ApiConfig;
    const url = baseNotification + updateNotificationStatus;
    const params = {
      id: id,
      isActive: status,
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  userFind: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, userFind } = ApiConfig;
    const url = baseNotification + userFind;
    const params = {
      emailId: userId,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  announcementBanner: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseBanner, announcementBanner } = ApiConfig;
    const url = baseBanner + announcementBanner;
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };
    return ApiCallPost(url, formData, headers);
  },
  getAnnouncementBannerList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseBanner, getBannerList } = ApiConfig;
    const url = baseBanner + getBannerList;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  updateBannerStatus: async (bannerId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseBanner, updateBannerStatus } = ApiConfig;
    const url = baseBanner + updateBannerStatus;
    const params = {
      bannerId: bannerId,
      status: status,
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  bannerDelete: async (bannerId) => {
    const token = sessionStorage.getItem("token");
    const { baseBanner, bannerDelete } = ApiConfig;
    const url = `${baseBanner + bannerDelete}/${bannerId}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

};

export default AuthService;
