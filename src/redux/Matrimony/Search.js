import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import apiClient from "../../utils/apiClient";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { setAuthData } from "../../modules/auth/session";
import { setDob,setGender } from "../../modules/auth/signin";

const SET_HEIGHT = "Matrimony/Search/SET_HEIGHT";
const SET_AGE = "Matrimony/Search/SET_AGE";
const SET_WEIGHT = "Matrimony/Search/SET_WEIGHT";
const SET_INCOME = "Matrimony/Search/SET_INCOME";
const SET_COMPLEXION = "Matrimony/Search/SET_COMPLEXION";
const SET_MANGALIK = "Matrimony/Search/SET_MANGALIK";
const SET_EDUCATION = "Matrimony/Search/SET_EDUCATION";
const SET_LOADING = "Matrimony/Search/SET_LOADING";

const SET_DATA = "Matrimony/Search/SET_DATA";
const SET_LIKED_DATA = "Matrimony/Search/SET_LIKED_DATA";
const SET_LIKES_RECEIVED_DATA = "Matrimony/Search/SET_LIKES_RECEIVED_DATA";
const SET_MATCHED_DATA = "Matrimony/Search/SET_MATCHED_DATA";
const LOADING_START = "Matrimony/Search/LOADING_START";
const LOADING_STOP = "Matrimony/Search/LOADING_STOP";
const SET_FILTER = "Matrimony/Search/SET_FILTER";

const initialState = {
  height: [121.92, 213.36],
  age: [18, 40],
  weight: [30, 150],
  income: [0, 5000000],
  isManglikSelected: "",
  complexion: "",
  selectedEducation: "",
  loading: false,
  data: [],
  likedData: [],
  likesReceivedData: [],
  matchedData: [],
  filter: false,
};

export const setHeight = (height) => ({
  type: SET_HEIGHT,
  height: height,
});

export const setFilter = (filter) => ({
  type: SET_FILTER,
  filter: filter,
});
export const setAge = (age) => ({
  type: SET_AGE,
  age: age,
});

export const setWeightRange = (weight) => ({
  type: SET_WEIGHT,
  weight: weight,
});

export const setIncomeRange = (income) => ({
  type: SET_INCOME,
  income: income,
});

export const setIsManglikSelected = (isManglikSelected) => ({
  type: SET_MANGALIK,
  isManglikSelected: isManglikSelected,
});

export const setComplexion = (complexion) => ({
  type: SET_COMPLEXION,
  complexion: complexion,
});

export const setSelectedEducation = (selectedEducation) => ({
  type: SET_EDUCATION,
  selectedEducation: selectedEducation,
});

export const setData = (data) => ({
  type: SET_DATA,
  data: data,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading: loading,
});

export const getMatrimony = (id) => async (dispatch, getState) => {
  const state = getState();
  const {
    age,
    height,
    weight,
    income,
    isManglikSelected,
    complexion,
    selectedEducation,
  } = state.search;

  try {
    dispatch({
      type: LOADING_START,
    });
    const requestBody = {};

    if (age[0] !== null && age[1] !== null) {
      requestBody.minAge = age[0];
      requestBody.maxAge = age[1];
    }

    if (height[0] !== null && height[1] !== null) {
      requestBody.minHeight = height[0];
      requestBody.maxHeight = height[1];
    }

    if (weight[0] !== null && weight[1] !== null) {
      requestBody.minWeight = weight[0];
      requestBody.maxWeight = weight[1];
    }

    if (income[0] !== null && income[1] !== null) {
      requestBody.minIncome = income[0];
      requestBody.maxIncome = income[1];
    }

    if (isManglikSelected !== "") {
      requestBody.manglik = isManglikSelected;
    }

    if (complexion !== "") {
      requestBody.complexion = complexion;
    }

    if (selectedEducation !== "") {
      requestBody.education = selectedEducation;
    }
    const response = await apiClient.post(apiClient.Urls.getMatrimonyList, {
      ...requestBody,
    });

    console.warn("search api response is", response);
    if (response.message === "success") {
      const filteredData = response.result.filter((item) => {
        // Check if 'family_details' object is present
        const hasFamilyDetails = item.family_details !== undefined;

        const isNotMyID = item._id !== id; // Replace 'yourID' with your actual user ID

        return hasFamilyDetails && isNotMyID;
      });

      console.log("filtered data is----->", filteredData);
      // Store the filtered data in the state
      dispatch({
        type: SET_DATA,
        data: filteredData,
      });
      // dispatch({
      //   type: SET_FILTER,
      //   filter: true,
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
    }
  } catch (e) {
    // Toast.show({
    //   text1: e.message || e || "Something went wrong!",
    //   type: "error",
    // });
  }
};

export const getLikedMatrimony = (id) => async (dispatch, getState) => {
  const state = getState();
  const { profile } = state.session;
  console.warn("user id--->", profile);
  try {
    dispatch({
      type: LOADING_START,
    });
    const response = await apiClient.post(apiClient.Urls.getMatrimonyList, {});

    // console.warn('Liked matrimony response is', response)
    if (response.message === "success") {
      const filteredData = response.result.filter((item) => {
        // Check if 'family_details' object is present
        const hasFamilyDetails = item.family_details !== undefined;

        const isNotMyID = item._id !== id; // Replace 'yourID' with your actual user ID

        return hasFamilyDetails && isNotMyID;
      });

      const likesdata = filteredData?.filter(
        (user) =>
          user.like?.find(
            (like) => like.user === profile.matrimony_registration?._id
          ) &&
          !profile.matrimony_registration.like.some(
            (key) => key.user === user._id
          )
      );

      console.log("Liked matrimony response is----->", likesdata);
      // Store the filtered data in the state
      dispatch({
        type: SET_LIKED_DATA,
        likedData: likesdata,
      });
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
    }
  } catch (e) {
    // Toast.show({
    //   text1: e.message || e || "Something went wrong!",
    //   type: "error",
    // });
  }
};

export const getLikesReceived = () => async (dispatch, getState) => {
  const state = getState();
  const { profile } = state.session;
  console.warn("user id--->", profile);

  try {
    dispatch({
      type: LOADING_START,
    });

    const response = await apiClient.post(apiClient.Urls.getMatrimonyList, {});

    if (response.message === "success") {
      const filteredData = response.result.filter((item) => {
        const hasFamilyDetails = item.family_details !== undefined;
        return hasFamilyDetails; // You can keep this check if necessary
      });

      const likesReceivedData = filteredData.filter(
        (user) =>
          profile.matrimony_registration?.like.some(
            (key) => key.user === user._id
          )
        // user.like?.some(
        //   (like) => like.user === profile.matrimony_registration?._id
        // )
      );

      console.log("Likes received data: ", likesReceivedData);

      dispatch({
        type: SET_LIKES_RECEIVED_DATA,
        likesReceivedData: likesReceivedData,
      });

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
    }
  } catch (e) {
    // Handle error
    console.error("Error in getLikesReceived: ", e);
  }
};

export const getMatchedMatrimony = (id) => async (dispatch, getState) => {
  const state = getState();
  const { profile } = state.session;
  console.warn("user id--->", profile);
  try {
    dispatch({
      type: LOADING_START,
    });
    const response = await apiClient.post(apiClient.Urls.getMatrimonyList, {});

    // console.warn('Liked matrimony response is', response)
    if (response.message === "success") {
      const filteredData = response.result.filter((item) => {
        // Check if 'family_details' object is present
        const hasFamilyDetails = item.family_details !== undefined;

        const isNotMyID = item._id !== id; // Replace 'yourID' with your actual user ID

        return hasFamilyDetails && isNotMyID;
      });

      const matchData = filteredData?.filter(
        (user) =>
          user.like?.some(
            (key) => key.user === profile.matrimony_registration._id
          ) &&
          profile.matrimony_registration?.like.some(
            (key) => key.user === user._id
          )
      );

      console.log("Liked matrimony response is----->", matchData);
      // Store the filtered data in the state
      dispatch({
        type: SET_MATCHED_DATA,
        matchedData: matchData,
      });
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
    }
  } catch (e) {
    // Toast.show({
    //   text1: e.message || e || "Something went wrong!",
    //   type: "error",
    // });
  }
};

export const getProfile = (token) => async (dispatch, getState) => {
  try {
    const response = await apiClient.get(apiClient.Urls.getProfile, {
      authToken: token,
    });

    console.warn("Profile response is", response);
    if (response.success) {
      dispatch(setAuthData(token, response.profile));
      dispatch(setDob(response.profile.dob));
      dispatch(setGender(response.profile.gender))
    } else {
      Toast.show({
        text1: response.message || "Something went wrong!",
        type: "error",
      });
      dispatch({
        type: LOADING_STOP,
      });
    }
  } catch (e) {
    Toast.show({
      text1: e.message || e || "Something went wrong!",
      type: "error",
    });
  }
};

export default searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HEIGHT:
      return {
        ...state,
        height: action.height,
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.filter,
      };
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
    case SET_AGE:
      return {
        ...state,
        age: action.age,
      };
    case SET_WEIGHT:
      return {
        ...state,
        weight: action.weight,
      };
    case SET_INCOME:
      return {
        ...state,
        income: action.income,
      };
    case SET_COMPLEXION:
      return {
        ...state,
        complexion: action.complexion,
      };
    case SET_MANGALIK:
      return {
        ...state,
        isManglikSelected: action.isManglikSelected,
      };
    case SET_EDUCATION:
      return {
        ...state,
        selectedEducation: action.education,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case SET_DATA:
      return {
        ...state,
        data: action.data,
      };
    case SET_LIKED_DATA:
      return {
        ...state,
        likedData: action.likedData,
      };
    case SET_LIKES_RECEIVED_DATA:
      return {
        ...state,
        likesReceivedData: action.likesReceivedData,
      };
    case SET_MATCHED_DATA:
      return {
        ...state,
        matchedData: action.matchedData,
      };
    default:
      return state;
  }
};
