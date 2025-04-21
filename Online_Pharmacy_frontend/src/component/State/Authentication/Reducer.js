import { isPrsesetInFavorites } from "../../config/logic.js";
import { ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_REQUEST, LOGIN_SUCCESS, REGESTER_REQUEST,REGESTER_SUCCESS,LOGOUT } from "./ActionType.js"

const initialState={

    user:null,
    isLoading: false,
    error:null,
    jwt:null,
    favorites:[],
    success:null
}

export const authReducer=(state=initialState, action)=>{
    switch(action.type){
        case REGESTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
        case ADD_TO_FAVORITE_REQUEST:
            return {...state,isLoading:true,error:null,success:null};

        case REGESTER_SUCCESS:
        case LOGIN_SUCCESS:
            return {...state,isLoading:false,jwt:action.payload,success:"Registration Success"};

        case GET_USER_SUCCESS:
            return{
                ...state,
                isLoading:false,
                user: action.payload, 
                favorites:action.payload.favorites
            };
        case ADD_TO_FAVORITE_SUCCESS:
            return{
                ...state,
                isLoading:false,
                error:null,
                favorites:isPrsesetInFavorites(state.favorites,action.payload)
                ? state.favorites.filter((item)=> item.id!==action.payload.id):
                [action.payload,...state.favorites],
            };
            case LOGOUT:
                return initialState;

            case REGESTER_REQUEST:
            case LOGIN_REQUEST:
            case GET_USER_REQUEST:
            case ADD_TO_FAVORITE_REQUEST:
                return{
                    ...state,
                    isLoading:false,
                    error:action.payload,
                    success:null,
                };
                    

        default:
            return state;
    }
};