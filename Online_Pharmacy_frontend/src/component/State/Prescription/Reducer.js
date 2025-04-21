import {
  UPLOAD_PRESCRIPTION_REQUEST,
  UPLOAD_PRESCRIPTION_SUCCESS,
  UPLOAD_PRESCRIPTION_FAILURE,
  GET_PRESCRIPTION_REQUEST,
  GET_PRESCRIPTION_SUCCESS,
  GET_PRESCRIPTION_FAILURE,
  UPDATE_PRESCRIPTION_STATUS_REQUEST,
  UPDATE_PRESCRIPTION_STATUS_SUCCESS,
  UPDATE_PRESCRIPTION_STATUS_FAILURE,
  DELETE_PRESCRIPTION_REQUEST,
  DELETE_PRESCRIPTION_SUCCESS,
  DELETE_PRESCRIPTION_FAILURE,
  DOWNLOAD_PRESCRIPTION_REQUEST,
  DOWNLOAD_PRESCRIPTION_SUCCESS,
  DOWNLOAD_PRESCRIPTION_FAILURE,
  VIEW_PRESCRIPTION_REQUEST,
  VIEW_PRESCRIPTION_SUCCESS,
  VIEW_PRESCRIPTION_FAILURE
} from "./ActionType.js";

const initialState = {
  prescription: null,
  loading: false,
  error: null,
  downloading: false,
  downloadError: null,
  viewLoading: false,
  viewUrl: null,
  viewError: null
};

const prescriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_PRESCRIPTION_REQUEST:
    case GET_PRESCRIPTION_REQUEST:
    case UPDATE_PRESCRIPTION_STATUS_REQUEST:
    case DELETE_PRESCRIPTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case UPLOAD_PRESCRIPTION_SUCCESS:
    case GET_PRESCRIPTION_SUCCESS:
    case UPDATE_PRESCRIPTION_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        prescription: action.payload,
        error: null
      };

    case DELETE_PRESCRIPTION_SUCCESS:
      return {
        ...state,
        loading: false,
        prescription: null,
        error: null
      };

    case UPLOAD_PRESCRIPTION_FAILURE:
    case GET_PRESCRIPTION_FAILURE:
    case UPDATE_PRESCRIPTION_STATUS_FAILURE:
    case DELETE_PRESCRIPTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
      case DOWNLOAD_PRESCRIPTION_REQUEST:
        return {
          ...state,
          downloading: true,
          downloadError: null
        };
      
      case DOWNLOAD_PRESCRIPTION_SUCCESS:
        return {
          ...state,
          downloading: false,
          downloadError: null
        };
      
      case DOWNLOAD_PRESCRIPTION_FAILURE:
        return {
          ...state,
          downloading: false,
          downloadError: action.payload
        };

        case VIEW_PRESCRIPTION_REQUEST:
          return {
            ...state,
            viewLoading: true,
            viewError: null
          };
        
        case VIEW_PRESCRIPTION_SUCCESS:
          return {
            ...state,
            viewLoading: false,
            viewUrl: action.payload,
            viewError: null
          };
        
        case VIEW_PRESCRIPTION_FAILURE:
          return {
            ...state,
            viewLoading: false,
            viewError: action.payload
          };

    default:
      return state;
  }
};

export default prescriptionReducer;