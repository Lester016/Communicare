import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, userID) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    tokenId: token,
    userID: userID,
  };
};

export const authFailed = (error) => {
  return {
    type: actionTypes.AUTH_FAILED,
    error: error,
  };
};

export const login = (email, password) => {
  let url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCqLt1akVbJI8TOxP3HMTCXgsV9DHBoXww";

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(url, { email, password }, config)
      .then((res) => {
        // localStorage.setItem("token", res.data.token);
        // localStorage.setItem("userID", res.data._id);
        console.log(res.data);
        dispatch(authSuccess(res.data.idToken, res.data.localId));
      })
      .catch((error) => {
        dispatch(authFailed(error.response.data.error.message));
      });
  };
};

export const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userID");
  return {
    type: actionTypes.AUTH_CLEAR_TOKENS,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(clearTokens()); // or just return
    } else {
      const userID = localStorage.getItem("userID");

      dispatch(authSuccess(token, userID));
    }
  };
};
