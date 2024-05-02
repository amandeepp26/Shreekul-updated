import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import apiClient from '../../utils/apiClient';
import { skipNow } from './signin';

const SET_AUTH_DATA = 'auth/session/SET_AUTH_DATA';
const LOGOUT_SUCCESS = 'auth/session/LOGOUT_SUCCESS';
const ERROR = 'auth/session/ERROR';


const initialState = {
  authToken: null,
  profile: null,
};

export const setAuthData = (authToken, profile) => ({
  type: SET_AUTH_DATA,
  authToken:authToken,
  profile:profile,
});

export const logout = () => (dispatch, getState) => {
  const { authToken } = getState().session;
  const deviceId = DeviceInfo.getUniqueId();
  dispatch(skipNow(true));
  apiClient.post(apiClient.Urls.logout, {
    authToken,
    device_id: deviceId,
  }).then((res) => {
    console.warn(res)
    dispatch({
      type: LOGOUT_SUCCESS,
    });
  }).catch(e => {
    dispatch({
      type: LOGOUT_SUCCESS,
    });
  });
};

export const setFCMToken = async (token, deviceId, userId) => {
  return await apiClient.post(`${apiClient.Urls.init}`, {
    token: token,
    device_id: deviceId,
    user_id: userId,
    device_type: 'phone',
    access_type: 'app',
    os: Platform.OS,
  });
};

export default sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH_DATA:
      return {
        ...state,
        authToken: action.authToken,
        profile: action.profile,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        authToken: null,
        profile: null,
      };
    case ERROR: {
      return {
        ...state,
        message: action.message,
      }
    }
    default:
      return state;
  }
};
