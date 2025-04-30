import {
    CREATE_MENU_ITEM_FAILURE,
    CREATE_MENU_ITEM_REQUEST,
    CREATE_MENU_ITEM_SUCCESS,
    GET_MENU_ITEMS_BY_PHARMACY_ID_FAILURE,
    GET_MENU_ITEMS_BY_PHARMACY_ID_REQUEST,
    GET_MENU_ITEMS_BY_PHARMACY_ID_SUCCESS,
    SEARCH_MENU_ITEM_FAILURE,
    SEARCH_MENU_ITEM_REQUEST,
    SEARCH_MENU_ITEM_SUCCESS,
    UPDATE_MENU_ITEM_AVAILABILITY_FAILURE,
    UPDATE_MENU_ITEM_AVAILABILITY_REQUEST,
    UPDATE_MENU_ITEM_AVAILABILITY_SUCCESS,
    DELETE_MENU_ITEM_FAILURE,
    DELETE_MENU_ITEM_SUCCESS,
    DELETE_MENU_ITEM_REQUEST
  } from "./ActionType.js";

const initialState={
    menuItems:[],
    loading:false,
    error:null,
    search:[],
    message:null
};

export const menuItemReducer=(state=initialState,action)=>{
    switch(action.type){
        case CREATE_MENU_ITEM_REQUEST:
        case DELETE_MENU_ITEM_REQUEST:
        case SEARCH_MENU_ITEM_REQUEST:
        case UPDATE_MENU_ITEM_AVAILABILITY_REQUEST:
            
            return{
                ...state,
                loading:true,
                error:null,
                message:null,
            };
        case GET_MENU_ITEMS_BY_PHARMACY_ID_REQUEST:
            console.log("Reducer: Handling GET_MENU_ITEMS_BY_PHARMACY_ID_REQUEST");
            return{
                ...state,
                loading:true,
                error:null,
                message:null,
            }
        case CREATE_MENU_ITEM_SUCCESS:
            return{
                ...state,
                loading:false,
                menuItems:[...state.menuItems, action.payload],
                message:"Medicine created Successfully",

            };
        case GET_MENU_ITEMS_BY_PHARMACY_ID_SUCCESS:
            console.log("Reducer: Handling GET_MENU_ITEMS_BY_PHARMACY_ID_SUCCESS", action.payload);
            return{
                ...state,
                loading:false,
                menuItems: action.payload,
            };
        case DELETE_MENU_ITEM_SUCCESS:
            return{
                ...state,
                loading:false,
                menuItems: state.menuItems.filter(
                    (menuItem)=>menuItem.id!==action.payload
                ),
            };
        case UPDATE_MENU_ITEM_AVAILABILITY_SUCCESS:
            return{
                ...state,
                loading:false,
                menuItems:state.menuItems.map(
                    (menuItem)=> menuItem.id=== action.payload.id?
                    action.payload:menuItem
                ),
            };
        case SEARCH_MENU_ITEM_SUCCESS:
            return{
                ...state,
                loading:false,
                search:action.payload,
            };
        case CREATE_MENU_ITEM_FAILURE:
        case GET_MENU_ITEMS_BY_PHARMACY_ID_FAILURE:
        case DELETE_MENU_ITEM_FAILURE:
        case SEARCH_MENU_ITEM_FAILURE:
        case UPDATE_MENU_ITEM_AVAILABILITY_FAILURE:
            return{
                ...state,
                loading: false,
                error: action.payload,
                message:null,
            };
        default:
            return state;
    }
};

export default menuItemReducer;