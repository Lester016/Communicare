import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, userID, email) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    tokenId: token,
    userID: userID,
    email: email,
  };
};

export const authFailed = (error) => {
  return {
    type: actionTypes.AUTH_FAILED,
    error: error,
  };
};

export const register = (email, password) => {
  let url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCqLt1akVbJI8TOxP3HMTCXgsV9DHBoXww";

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
        localStorage.setItem("token", res.data.idToken);
        localStorage.setItem("userID", res.data.localId);
        localStorage.setItem("email", res.data.email);
        console.log(res.data);
        dispatch(
          authSuccess(res.data.idToken, res.data.localId, res.data.email)
        );
      })
      .catch((error) => {
        dispatch(authFailed(error.response.data.error.message));
      });
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
        localStorage.setItem("token", res.data.idToken);
        localStorage.setItem("userID", res.data.localId);
        localStorage.setItem("email", res.data.email);
        console.log(res.data);
        dispatch(
          authSuccess(res.data.idToken, res.data.localId, res.data.email)
        );
      })
      .catch((error) => {
        dispatch(authFailed(error.response.data.error.message));
      });
  };
};

export const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userID");
  localStorage.removeItem("email");
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
      const email = localStorage.getItem("email");

      dispatch(authSuccess(token, userID, email));
    }
  };
};
