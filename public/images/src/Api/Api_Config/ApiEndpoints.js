// const appUrl = "http://localhost:3000/v1";
const appUrl = "https://backend.brainstormsol.ai/v1";
export const imageUrl = "https://backend.brainstormsol.ai/";
// export const imageUrl = "http://localhost:3000/";
// export const imageUrl = "http://192.168.1.15:3000";
// const appUrl = "http://192.168.1.15:3000/v1";
export const deployedUrl = `${window.origin}/`

export const ApiConfig = {
  // =========EndPoints========== //
  login: "login",
  usersList: "users-list",
  getOpenTickets: "get-open-tickets",
  getClosedTickets: "get-close-tickets",
  getResolvedTickets: "get-resolve-tickets",
  blogList: "blog-list",
  notificationList: "notification-list",
  usersStatusUpdate: "users-status-update",
  addNotification: "add-notification",
  addBlog: "add-blog",
  deleteNotification: "delete-notification",
  deleteBlog: "delete-blog",
  dashboardData: "dashboard",
  dashboardList: "activity-logs",
  contactusList: "contactus-list",
  adminViewTicket: "admin-view-ticket",
  updateTicketStatus: "update-ticket-status",

  replyTicket: "reply-ticket",




  // ============URLs================ //
  baseUrl: `${appUrl}/admin/`,
  baseSupport: `${appUrl}/support/`,
  // baseAdminUrl: `${appUrl}/admins/`,



  // ============webSocketUrl================ //
  // webSocketUrl: appUrl,

};
