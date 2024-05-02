// export const baseUrl = "http://10.0.2.2:8000/";
export const baseUrl = "https://api.welkinhawk.in/";

// export const baseUrl = "https://api.amhibhandari.com/";
export const imgUrl = "http://localhost:8000/api/";

const apiClient = {
  Urls: {
    imgUrl,
    init: "api/device/add",
    // Community app API
    login: "api/users/send-otp",
    verifyOtp: "api/users/verify-otp",
    matrimonyRegister: "api/matrimony/register",
    signup: "api/users/register",
    verifySignupOtp: "api/users/signup-verify-otp",
    verifySignupMobile: "api/users/signup-verify-mobile-otp",
    getMatrimonyList: "api/matrimony",
    matrimonyLike: "api/matrimony/like",
    editProfile: "api/users/",
    editMatrimonyProfile: "api/matrimony/",
    getProfile: "api/users/get-profile",
    addMember: "api/users/add-family-tree",
    getFamilyTree: "api/users/get-family-tree",
    editMember: "api/users/edit-family-tree",
    deleteMember: "api/users/delete-family-tree",
    initiatePayment: "api/payment/orders",
    verifyPayment: "api/payment/verify",
    getNadi: "api/religion/nadi",
    getNakshatra: "api/religion/nakshatra",
    getGana: "api/religion/gana",
    getCasts: "api/religion/get-caste",
    sendMessage: "api/message/send",
    googleSignin: "api/google/signin",
    chatNotification: "api/notification/send-push",
    aboutUs: "api/aboutus",
    privacyPolicy: "api/privacypolicy",
    getCountries: "api/matrimony/countries",
    getAds: "api/ads/get-ads",
    changePhoneEmailAPi: "api/users/update-phone-email",
    changeEmailPhoneVerifyOtp: "api/users/update-otp",
  },

  post: function (url, params, isFormData = false) {
    let headers = {
      Accept: "/",
    };
    console.log("apiclient params--->", params);
    if (params.authToken) {
      headers["Authorization"] = `Bearer ${params.authToken}`;
    }

    let fetchOptions = {
      method: "POST",
      headers,
    };

    if (isFormData) {
      // Create a FormData object to send the data as multipart/form-data
      let formData = new FormData();

      for (let key in params) {
        formData.append(key, params[key]);
      }

      // Set the content type for multipart/form-data
      headers["Content-Type"] = "multipart/form-data";

      fetchOptions.body = formData; // Send the formData object
    } else {
      // For JSON requests, stringify the params
      headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(params);
    }

    return fetch(baseUrl + url, fetchOptions).then((response) =>
      response.json()
    );
  },

  get: function (url, params) {
    console.log("apiclient", baseUrl + url, params);
    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (params.authToken) {
      headers["Authorization"] = `Bearer ${params.authToken}`;
    }
    return fetch(baseUrl + url, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log("api client-------->", error);
        return {
          success: false,
          message: error?.message || error || "Something went wrong!",
        };
      });
  },

  put: function (url, params) {
    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (params.authToken) {
      headers["Authorization"] = `Bearer ${params.authToken}`;
    }

    return fetch(baseUrl + url, {
      method: "PUT",
      headers,
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log("api client-------->", error);
        return {
          success: false,
          message: error?.message || error || "Something went wrong!",
        };
      });
  },

  delete: function (url, params) {
    let headers = {
      "Content-Type": "application/json",
      Accept: "/",
    };

    if (params.authToken) {
      headers["Authorization"] = `Bearer ${params.authToken}`;
    }

    return fetch(baseUrl + url, {
      method: "DELETE",
      headers,
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log("api client-------->", error);
        return {
          success: false,
          message: error?.message || error || "Something went wrong!",
        };
      });
  },
};

export default apiClient;
