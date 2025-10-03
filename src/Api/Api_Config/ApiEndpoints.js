const appUrl = "http://3.110.173.10:3009/v1";
export const imageUrl = "http://3.110.173.10:3009/";
export const deployedUrl = `${window.origin}/`

export const ApiConfig = {
  // =========EndPoints========== //
  login: "login",
  usersList: "allUsersList",
  getOpenTickets: "get-open-tickets",
  getClosedTickets: "get-close-tickets",
  getResolvedTickets: "get-resolve-tickets",
  blogList: "blog-list",
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







  // ============URLs================ //
  baseUrl: `${appUrl}/admin/`,
  baseUsers: `${appUrl}/users/`,
  baseSupport: `${appUrl}/support/`,
  // baseAdminUrl: `${appUrl}/admins/`,
  baseNotification: `${appUrl}/notifications/`,
  baseBanner: `${appUrl}/banners/`,



  // ============webSocketUrl================ //
  webSocketUrl: "http://3.110.173.10:3009",

};
