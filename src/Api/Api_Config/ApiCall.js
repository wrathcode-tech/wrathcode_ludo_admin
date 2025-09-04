import axios from "axios";
import { alertErrorMessage } from "../../Utils/CustomAlertMessage/index";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import { ApiConfig } from "./ApiEndpoints";

export const ApiCallPost = async (url, parameters, headers) => {
  try {
    const response = await axios.post(url, parameters, { headers: headers });
    LoaderHelper.loaderStatus(false);
    return response?.data;
  } catch (error) {
    LoaderHelper.loaderStatus(false);
    if (error?.response?.data?.message === "Token is expired with message: res is not defined") {
      tokenExpire();
      return;
    } else {
      if (url === `${ApiConfig?.baseUrl}v1/user/login` || url === `${ApiConfig?.baseUrl}v1/user/register`) {
        // alertErrorMessage(error?.response?.data?.message)
        return error?.response?.data
      }
      return error?.response?.data
      // alertErrorMessage(error?.response?.data?.message)

    }
  }
};

export const ApiCallGet = async (url, headers) => {
  try {
    const response = await axios.get(url, { headers: headers });
    LoaderHelper.loaderStatus(false);
    return response?.data;
  } catch (error) {
    LoaderHelper.loaderStatus(false);
    if (error?.response?.data?.message === "Token is expired with message: res is not defined") {
      tokenExpire();
      return;
    } else {
      return error?.response?.data
      // alertErrorMessage(error?.response?.data?.message)
      return
    }
  }
};

export const ApiCalDelete = async (url, headers) => {
  try {
    const response = await axios.delete(url, { headers: headers });
    LoaderHelper.loaderStatus(false);
    return response?.data;
  } catch (error) {
    LoaderHelper.loaderStatus(false);
    if (error?.response?.data?.message === "Token is expired with message: res is not defined") {
      tokenExpire();
      return;
    } else {
      return error?.response?.data
      // alertErrorMessage(error?.response?.data?.message)
      return
    }
  }
};

export const ApiCallPut = async (url, parameters, headers) => {
  try {
    const response = await axios.put(url, parameters, { headers: headers });
    LoaderHelper.loaderStatus(false);
    return response?.data;
  } catch (error) {
    LoaderHelper.loaderStatus(false);
    if (error?.response?.data?.message === "Token is expired with message: res is not defined") {
      tokenExpire();
      return;
    } else {
      return error?.response?.data
      // alertErrorMessage(error?.response?.data?.message)
      return
    }
  }
};

const tokenExpire = () => {
  alertErrorMessage('Token is Expired');
  sessionStorage.clear();
  window.location.reload();
}