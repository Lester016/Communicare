import * as actionTypes from "../actions/actionTypes";

const initialState = {
  token: null,
  userID: null,
  error: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        token: action.tokenId,
        userID: action.userID,
        loading: false,
        error: null,
      };
    case actionTypes.AUTH_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case actionTypes.AUTH_CLEAR_TOKENS:
      return {
        ...state,
        token: null,
        userID: null,
      };
    default:
      return state;
  }
};

export default reducer;
