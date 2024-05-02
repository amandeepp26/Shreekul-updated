import apiClient from "../../utils/apiClient";
import { setAuthData } from "./session";
import Toast from "react-native-toast-message";
import { validateEmail, validatePhoneNumber } from "../../utils/validate";

const ERROR = "auth/signin/ERROR";
const CLEAR_STATE = "auth/signin/CLEAR_STATE";
const SET_PHONE_NUMBER = "auth/signin/SET_PHONE_NUMBER";
const SET_EMAIL = "auth/signin/SET_EMAIL";
const SET_DOB = "auth/signin/SET_DOB";
const SET_GENDER = "auth/signin/SET_GENDER";
const SET_IMAGE = "auth/signin/SET_IMAGE";

const SET_NAME = "auth/signin/SET_NAME";
const SET_PASSWORD = "auth/signin/SET_PASSWORD";
const ENTER_OTP = "auth/signin/ENTER_OTP";
const SKIP = "auth/signin/SKIP";

const LOGIN_START = "auth/signin/LOGIN_START";
const LOGIN_SUCCESS = "auth/signin/LOGIN_SUCCESS";
const LOGIN_FAIL = "auth/signin/LOGIN_FAIL";
const LOADING_START = "auth/signin/LOADING_START";
const LOADING_STOP = "auth/signin/LOADING_STOP";

const SET_FCM_TOKEN = "auth/signin/SET_FCM_TOKEN";

const SET_REFERAL_ID = "auth/signin/SET_REFERAL_ID";

const initialState = {
  loggingIn: false,
  skip: true,
  error: {},
  errorMessage: "",
  phone_number: "",
  name: "",
  email: "",
  dob: "",
  gender: "",
  password: "",
  otp: "",
  profile_pic: null,
  loading: false,
  fcmToken: null,
  referalId: null,
};

export const clearState = () => ({
  type: CLEAR_STATE,
});

export const startLogin = () => ({
  type: LOGIN_START,
});

export const displayError = (title, message) => ({
  type: ERROR,
  title,
  message,
});

export const skipNow = (skip) => ({
  type: SKIP,
  skip,
});

export const setPhoneNumber = (phone_number) => {
  return {
    type: SET_PHONE_NUMBER,
    phone_number,
  };
};

export const setName = (name) => {
  return {
    type: SET_NAME,
    name,
  };
};

export const setFcmToken = (fcmToken) => {
  return {
    type: SET_FCM_TOKEN,
    fcmToken,
  };
};

export const setReferalId = (referalId) => {
  return {
    type: SET_REFERAL_ID,
    referalId,
  };
};

export const setImage = (profile_pic) => {
  return {
    type: SET_IMAGE,
    profile_pic,
  };
};

export const setEmail = (email) => {
  return {
    type: SET_EMAIL,
    email,
  };
};

export const setDob = (dob) => {
  return {
    type: SET_DOB,
    dob,
  };
};

export const setGender = (gender) => {
  return {
    type: SET_GENDER,
    gender,
  };
};

export const setPassword = (password) => {
  return {
    type: SET_PASSWORD,
    password,
  };
};

export const setOTP = (otp) => {
  return {
    type: ENTER_OTP,
    otp,
  };
};

export const logout = () => ({
  type: "LOGOUT",
});

export const requestOtp = (callback) => async (dispatch, getState) => {
  const state = getState();
  const { phone_number, email,fcmToken } = state.signin;
  console.warn("cll", callback, phone_number);
  try {
    dispatch({
      type: LOADING_START,
    });

    const requestBody = {
    };
    if (email !== "") {
      requestBody.email = email;
    }
    if (phone_number !== "") {
      requestBody.phone = phone_number;
    }
    if(fcmToken !== null){
      requestBody.fcm = fcmToken;
    }
    const response = await apiClient.post(apiClient.Urls.login, {
      ...requestBody,
    });

    console.log("Request OTP---------->", response);

    if (response.success) {
      if (callback) {
        callback();
      }
      Toast.show({
        text1: response.message || "OTP Sent",
        type: "success",
      });
      // dispatch({
      //   type: ENTER_OTP,
      //   otp: response.otp,
      // });
      dispatch({
        type: LOADING_STOP,
      });
    } else {
      Toast.show({
        text1: response.message || "Something went wrong!",
        type: "error",
      });
      dispatch({
        type: LOADING_STOP,
      });
      dispatch({
        type: ERROR,
        errorMessage: response.message,
      });
    }
  } catch (e) {
    Toast.show({
      text1: e.message || e || "Something went wrong!",
      type: "error",
    });
    dispatch({
      type: ERROR,
      errorMessage: e.message,
    });
  }
};

export const resendOtp = (callback) => async (dispatch, getState) => {
  const state = getState();
  const { phone_number } = state.signin;
  console.warn("cll", callback);
  try {
    const response = await apiClient.post(apiClient.Urls.login, {
      mobile: phone_number,
    });

    console.log("Request OTP---------->", response);

    if (response.success) {
      if (callback) {
        callback();
      }
      Toast.show({
        text1: response.message || "OTP Sent",
        type: "success",
      });
      dispatch({
        type: LOADING_STOP,
      });
    } else {
      if (response.error_object.mobile) {
        Toast.show({
          text1:
            response.error_object.mobile || response || "Something went wrong!",
          type: "error",
        });
      }
      dispatch({
        type: LOADING_STOP,
      });
      dispatch({
        type: ERROR,
        errorMessage: response.message,
      });
    }
  } catch (e) {
    Toast.show({
      text1: e.message || e || "Something went wrong!",
      type: "error",
    });
    dispatch({
      type: ERROR,
      errorMessage: e.message,
    });
  }
};

export const validateOtp = () => async (dispatch, getState) => {
  const state = getState();
  const { otp, phone_number, email } = state.signin;
  if (otp == "") {
    Toast.show({ text1: `Please enter verification code`, type: "error" });
    return;
  }
  const requestBody = {};
  if (email !== "") {
    requestBody.email = email;
  }
  if (phone_number !== "") {
    requestBody.phone = phone_number;
  }
  try {
    dispatch({
      type: LOGIN_START,
    });
    const response = await apiClient.post(apiClient.Urls.verifyOtp, {
      ...requestBody,
      otp: otp,
    });

    console.log("Log in---------->", response);

    if (response.success) {
      dispatch(setAuthData(response.token, response.user));
      Toast.show({
        text1: response.message || "Login Success",
        type: "success",
      });
      dispatch(skipNow(false));
      dispatch({
        type: LOGIN_SUCCESS,
      });
    } else {
      Toast.show({
        text1: response.message || "Something went wrong!",
        type: "error",
      });
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch(displayError("", response.message || "Something went wrong!"));
    }
  } catch (e) {
    Toast.show({
      text1: e.message || e || "Something went wrong!",
      type: "error",
    });
    dispatch({
      type: LOGIN_FAIL,
    });
    dispatch(displayError("", e.message || e || "Something went wrong!"));
  }
};

export const requestSignupOtp = (callback) => async (dispatch, getState) => {
  const state = getState();
  const {
    phone_number,
    name,
    email,
    dob,
    gender,
    profile_pic,
    fcmToken,
    referalId,
  } = state.signin;
  console.warn("cll", callback);
  try {
    dispatch({
      type: LOADING_START,
    });
    const requestData = {
      phone: phone_number,
      fullname: name,
      email: email,
      dob: dob,
      gender: gender,
      fcm: fcmToken,
    };

    // Conditionally add profile image if it exists
    if (profile_pic) {
      requestData.profile_image = {
        uri: profile_pic,
        type: "image/jpeg", // Set the appropriate MIME type
        name: "profile.jpg", // Set the desired filename
      };
    }
    const response = await apiClient.post(
      `${apiClient.Urls.signup}?ref=${referalId}`,
      requestData,
      true
    );

    console.log("Request Sign up OTP---------->", response);

    if (response.success) {
      if (callback) {
        callback();
      }
      Toast.show({
        text1: response.message || "OTP Sent",
        type: "success",
      });
      // dispatch({
      //   type: ENTER_OTP,
      //   otp: response.otp,
      // });
      dispatch({
        type: LOADING_STOP,
      });
    } else {
      Toast.show({
        text1: response.message || "Something went wrong!",
        type: "error",
      });
      // if (response.error_object.phone) {
      //   Toast.show({
      //     text1: response.errors || response || 'Something went wrong!',
      //     type: 'error',
      //   });
      // }
      // if (response.error_object.email) {
      //   Toast.show({
      //     text1: response.errors || response || 'Something went wrong!',
      //     type: 'error',
      //   });
      // }
      // if (response.error_object.name) {
      //   Toast.show({
      //     text1: response.errors || response || 'Something went wrong!',
      //     type: 'error',
      //   });
      // }
      dispatch({
        type: LOADING_STOP,
      });
      dispatch({
        type: ERROR,
        errorMessage: response.message,
      });
    }
  } catch (e) {
    Toast.show({
      text1: e.message || e || "Something went wrong!",
      type: "error",
    });
    dispatch({
      type: ERROR,
      errorMessage: e.message,
    });
  }
};

export const resendSignupOtp = (callback) => async (dispatch, getState) => {
  const state = getState();
  const { phone_number, name, email } = state.signin;
  console.warn("cll", callback);
  try {
    const response = await apiClient.post(apiClient.Urls.signup, {
      phone: phone_number,
      name: name,
      email: email,
    });

    console.log("Request OTP---------->", response);

    if (response.success) {
      if (callback) {
        callback();
      }
      Toast.show({
        text1: response.message || "OTP Sent",
        type: "success",
      });
      dispatch({
        type: LOADING_STOP,
      });
    } else {
      if (response.error_object.phone) {
        Toast.show({
          text1: response.errors || response || "Something went wrong!",
          type: "error",
        });
      }
      if (response.error_object.email) {
        Toast.show({
          text1: response.errors || response || "Something went wrong!",
          type: "error",
        });
      }
      if (response.error_object.name) {
        Toast.show({
          text1: response.errors || response || "Something went wrong!",
          type: "error",
        });
      }
      dispatch({
        type: LOADING_STOP,
      });
      dispatch({
        type: ERROR,
        errorMessage: response.message,
      });
    }
  } catch (e) {
    Toast.show({
      text1: e.message || e || "Something went wrong!",
      type: "error",
    });
    dispatch({
      type: ERROR,
      errorMessage: e.message,
    });
  }
};

export const validateSignupOtp = (callback) => async (dispatch, getState) => {
  const state = getState();
  const { otp, phone_number, email, name } = state.signin;
  if (otp == "") {
    Toast.show({ text1: `Please enter verification code`, type: "error" });
    return;
  }
  try {
    console.log('url is=---->',apiClient.Urls.verifySignupMobile);
    dispatch({
      type: LOGIN_START,
    });
    const response = await apiClient.post(apiClient.Urls.verifySignupMobile, {
      phone: phone_number,
      otp: otp,
    });

    console.log("OTP Verification---------->", response);

    if (response.success) {
      if (callback) {
        callback();
      }
      Toast.show({
        text1: response.message || "Login Success",
        type: "success",
      });
      dispatch({
        type: LOADING_STOP,
      });
      dispatch({
        type: ENTER_OTP,
        otp:'',
      });
    } else {
      Toast.show({
        text1: response.message || "Something went wrong!",
        type: "error",
      });
      dispatch({
        type: LOADING_STOP,
      });
      dispatch(displayError("", response.message || "Something went wrong!"));
    }
  } catch (e) {
    Toast.show({
      text1: e.message || e || "Something went wrong!",
      type: "error",
    });
    dispatch(displayError("", e.message || e || "Something went wrong!"));
  }
};

export const validateMailOtp = () => async (dispatch, getState) => {
  const state = getState();
  const { otp, phone_number, email, name } = state.signin;
  if (otp == "") {
    Toast.show({ text1: `Please enter verification code`, type: "error" });
    return;
  }
  try {
    console.log("url is=---->", apiClient.Urls.verifySignupOtp);
    dispatch({
      type: LOGIN_START,
    });
    const response = await apiClient.post(apiClient.Urls.verifySignupOtp, {
      email: email,
      otp: otp,
    });

    console.log("Mail OTP Verification---------->", response);

    if (response.success) {
      dispatch(setAuthData(response.token, response.user));
      Toast.show({
        text1: response.message || "Login Success",
        type: "success",
      });
      dispatch(skipNow(false));
      dispatch({
        type: LOGIN_SUCCESS,
      });
    } else {
      Toast.show({
        text1: response.message || "Something went wrong!",
        type: "error",
      });
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch(displayError("", response.message || "Something went wrong!"));
    }
  } catch (e) {
    Toast.show({
      text1: e.message || e || "Something went wrong!",
      type: "error",
    });
    dispatch({
      type: LOGIN_FAIL,
    });
    dispatch(displayError("", e.message || e || "Something went wrong!"));
  }
};

export default signinReducer = (state = initialState, action) => {
  switch (action.type) {
    case ERROR: {
      return {
        ...state,
        errorMessage: action.errorMessage,
        error: {
          title: action.title,
          message: action.message,
        },
        loggingIn: false,
        loading: false,
      };
    }
    case CLEAR_STATE: {
      return {
        ...initialState,
      };
    }
    case LOADING_START: {
      return {
        ...state,
        loading: true,
      };
    }
    case LOADING_STOP: {
      return {
        ...state,
        loading: false,
      };
    }
    case LOGIN_START: {
      return {
        ...state,
        loggingIn: true,
        loading: true,
        errorMessage: "",
        error: {},
      };
    }
    case ENTER_OTP: {
      return {
        ...state,
        otp: action.otp,
      };
    }
    case SET_REFERAL_ID: {
      return {
        ...state,
        referalId: action.referalId,
      };
    }
    case SET_PHONE_NUMBER: {
      return {
        ...state,
        phone_number: action.phone_number,
      };
    }
    case SET_EMAIL: {
      return {
        ...state,
        email: action.email,
      };
    }
    case SET_DOB: {
      return {
        ...state,
        dob: action.dob,
      };
    }
    case SET_GENDER: {
      return {
        ...state,
        gender: action.gender,
      };
    }
    case SET_NAME: {
      return {
        ...state,
        name: action.name,
      };
    }
    case SET_FCM_TOKEN: {
      return {
        ...state,
        fcmToken: action.fcmToken,
      };
    }
    case SET_PASSWORD: {
      return {
        ...state,
        password: action.password,
      };
    }
    case SET_IMAGE: {
      return {
        ...state,
        profile_pic: action.profile_pic,
      };
    }
    case SKIP: {
      return {
        ...state,
        skip: action.skip,
      };
    }
    case LOGIN_START: {
      return {
        ...state,
        errorMessage: "",
        loading: true,
      };
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        loggingIn: true,
        loading: false,
      };
    }
    case LOGIN_FAIL: {
      return {
        ...state,
        errorMessage: action.errorMessage,
        loggingIn: false,
        loading: false,
      };
    }
    case "LOGOUT": {
      return initialState;
    }
    default:
      return state;
  }
};
