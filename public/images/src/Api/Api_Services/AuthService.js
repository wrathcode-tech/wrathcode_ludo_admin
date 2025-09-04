import { ApiConfig } from "../Api_Config/ApiEndpoints";
import { ApiCalDelete, ApiCallGet, ApiCallPost, ApiCallPut } from "../Api_Config/ApiCall";

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

  login: async (emailId, password, token) => {
    const { baseUrl, login } = ApiConfig;
    const url = baseUrl + login;
    const params = {
      emailId: emailId,
      password: password,
      token
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return ApiCallPost(url, params, headers);
  },

  getCode: async (signId) => {
    const { baseUrl, getcode } = ApiConfig;
    const url = baseUrl + getcode;
    const params = {
      emailId: signId,
      resent: true,
      type: "registration",
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

  updateTicketStatus: async (ticketId, status ) => {
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
    return ApiCalDelete(url, headers);
  },


  deleteBlog: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, deleteBlog } = ApiConfig;
    const url = baseUrl + deleteBlog + `/${id}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCalDelete(url, headers);
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


  usersList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, usersList } = ApiConfig;
    const url = baseUrl + usersList;
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


  notificationList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, notificationList } = ApiConfig;
    const url = baseUrl + notificationList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },

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

  notificationList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, notificationList } = ApiConfig;
    const url = baseUrl + notificationList;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    return ApiCallGet(url, headers);
  },
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

  update2fa: async (authType, code, verifyType) => {
    const token = sessionStorage.getItem("GATSBIT_AUTH_TOKEN");
    const { baseAuth, update2fa } = ApiConfig;
    const url = baseAuth + update2fa;
    const params = {
      type: authType,
      verification_code: +code,
      email_or_phone: verifyType
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

};

export default AuthService;
