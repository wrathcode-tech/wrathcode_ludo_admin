const appUrl = "https://backend.playfista.com/v1";
export const imageUrl = "https://backend.playfista.com/";
export const deployedUrl = `${window.origin}/`

export const ApiConfig = {
  // =========EndPoints========== //
  login: "login",
  usersList: "allUsersList",
  getOpenTickets: "get-open-tickets",
  getClosedTickets: "get-close-tickets",
  getResolvedTickets: "get-resolve-tickets",
  blogList: "blog-list",
  getUserDetails: "userProfileOverallData",
  getuserGameTransations: "userGamesTransaction",
  getuserKycDetails: "userKycDetails",
  getUserBankDetails: "userBankAndUpiDetails",
  getUserReferralDetails: "userReferBonusDetails",
  getUserCommissionDetails: "userCommissionBonusDetails",
  addUserWinningAmount: "addCashToUserWinningAmount",
  addDepositAmount: "addCashToUser",





  // notificationList: "notification-list",
  usersStatusUpdate: "users-status-update",
  addNotification: "add-notification",
  addBlog: "add-blog",
  deleteNotification: "delete-notification",
  deleteBlog: "delete-blog",
  // dashboardData: "dashboard",
  dashboardList: "activity-logs",
  contactusList: "contactus-list",
  adminViewTicket: "admin-view-ticket",
  updateTicketStatus: "update-ticket-status",
  getOtp: "send-otp",
  replyTicket: "reply-ticket",
  pendingDepositRequest: "pendingDepositRequest",
  getpendingKycList: "pendingKycUsers",
  getapprovedKycList: "approvedKycUsers",
  getrejectedKycList: "rejectedKycUsers",
  updateKycStatus: "updateKycStatus",
  getUsersRespose: "getUsersRespose",
  allCompletedLudoGameList: "allCompletedLudoGameList",
  allDisputeLudoGameList: "allDisputeLudoGameList",
  allRunningLudoGameList: "allRunningLudoGameList",
  allExpiredLudoGameList: "allExpiredLudoGameList",
  allWaitingLudoGameList: "allWaitingLudoGameList",
  allCancelLudoGameList: "allCancelLudoGameList",
  depositWithdraList: "usersDepositWithdrawalSummary",
  usersOverAllReferalBonusEarn: "usersOverAllReferalBonusEarn",
  usersOverAllCommissionBonusEarn: "usersOverAllCommissionBonusEarn",
  dashboardData: "dashboardData",
  updateDepositRequest: "updateDepositRequest",
  pendingWithdrawalRequest: "pendingWithdrawalRequest",
  approvedWithdrawalRequest: "approvedWithdrawalRequest",
  cancelWithdrawalRequest: "cancelWithdrawalRequest",
  updateWithdrawalStatus: "updateWithdrawalRequest",

  // Notifications Endpoints
  notificationList: "admin-listing",
  deleteNotify: "delete",
  singalUser: "single-user",
  sendBulkNotification: "send-bulk",
  sendToAll: "send-all",
  updateNotificationStatus: "update-status",
  announcementBanner: "add-banner",
  getBannerList: "admin-banner-listing",
  updateBannerStatus: "update-status",
  bannerDelete: "delete-banner",
  userFind: "find-user",
  msgSend: "send",
  getMsgUser: "user",
  allMsg: "all",
  msgSeen: "seen",

  // Dispute User Response
  getDisputeUsersRespose: "getUsersRespose",
  getParticularResponseView: "getParticularResponseView",
  chooseWinner: "chooseWinner",
  refundEventFund: "refundEventFund",

  // bank Details add

  addAdminBankDetails: "addAdminBankDetails",
  getAdminBankDetails: "adminBankDetailsList",
  updateStatusAdminBank: "updateStatusAdminBank",









  // ============URLs================ //
  baseUrl: `${appUrl}/admin/`,
  baseUsers: `${appUrl}/users/`,
  baseSupport: `${appUrl}/support/`,
  // baseAdminUrl: `${appUrl}/admins/`,
  baseNotification: `${appUrl}/notifications/`,
  baseBanner: `${appUrl}/banners/`,



  // ============webSocketUrl================ //
  webSocketUrl: "https://backend.playfista.com/",

};
