import { 
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
    FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILURE,
    RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE,
    GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE,
    ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, ADD_TO_FAVORITE_FAILURE,
    LOGOUT
  } from "./ActionType.js";
  import { isPrsesetInFavorites } from "../../config/logic.js";
  
  const initialState = {
    user: null,
    isLoading: false,
    error: null,
    jwt: null,
    favorites: [],
    success: null,
    resetStatus: null
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case REGISTER_REQUEST:
      case LOGIN_REQUEST:
      case GET_USER_REQUEST:
      case ADD_TO_FAVORITE_REQUEST:
      case FORGOT_PASSWORD_REQUEST:
      case RESET_PASSWORD_REQUEST:
        return { ...state, isLoading: true, error: null, success: null };
  
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        return { ...state, isLoading: false, jwt: action.payload };
  
      case GET_USER_SUCCESS:
        return {
          ...state,
          isLoading: false,
          user: action.payload,
          favorites: action.payload.favorites
        };
  
      case ADD_TO_FAVORITE_SUCCESS:
        return {
          ...state,
          isLoading: false,
          error: null,
          favorites: isPrsesetInFavorites(state.favorites, action.payload)
            ? state.favorites.filter((item) => item.id !== action.payload.id)
            : [action.payload, ...state.favorites]
        };
  
      case FORGOT_PASSWORD_SUCCESS:
        return {
          ...state,
          isLoading: false,
          resetStatus: "Email sent successfully",
          error: null
        };
  
      case RESET_PASSWORD_SUCCESS:
        return {
          ...state,
          isLoading: false,
          resetStatus: "Password reset successful",
          error: null
        };
  
      case LOGOUT:
        return initialState;
  
      case REGISTER_FAILURE:
      case LOGIN_FAILURE:
      case GET_USER_FAILURE:
      case ADD_TO_FAVORITE_FAILURE:
      case FORGOT_PASSWORD_FAILURE:
      case RESET_PASSWORD_FAILURE:
        return {
          ...state,
          isLoading: false,
          error: action.payload,
          success: null
        };
  
      default:
        return state;
    }
  };