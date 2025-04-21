import { LOGOUT } from "../Authentication/ActionType.js";
import {FIND_CART_REQUEST,FIND_CART_SUCCESS,FIND_CART_FAILURE,
    GET_ALL_CART_ITEMS_REQUEST,
    CLEAR_CART_REQUEST,CLEAR_CART_SUCCESS,CLEAR_CART_FAILURE,
    ADD_ITEM_TO_CART_REQUEST,ADD_ITEM_TO_CART_FAILURE,ADD_ITEM_TO_CART_SUCCESS,
    UPDATE_CARTITEM_FAILURE,UPDATE_CARTITEM_REQUEST,UPDATE_CARTITEM_SUCCESS,
REMOVE_CARTITEM_FAILURE,REMOVE_CARTITEM_REQUEST,REMOVE_CARTITEM_SUCCESS}  from "./ActionType.js";

const initialState = {
    cart: null,
    cartItems: [],
    loading: false,
    error: null,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case FIND_CART_REQUEST:
        case GET_ALL_CART_ITEMS_REQUEST:
        case UPDATE_CARTITEM_REQUEST:
        case REMOVE_CARTITEM_REQUEST:
        case ADD_ITEM_TO_CART_REQUEST:
        case CLEAR_CART_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FIND_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                cart: action.payload,
                cartItems: action.payload?.item || [],
            };

            case CLEAR_CART_SUCCESS:
                return {
                    ...state,
                    cartItems: [], // Clear all items
                    cart: null, // Or reset cart object if needed
                    loading: false,
                    error: null
                };

        case ADD_ITEM_TO_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                cart: {
                    ...state.cart,
                    item: [action.payload, ...(state.cart?.item || [])],
                },
                cartItems: [action.payload, ...state.cartItems],
            };

        case UPDATE_CARTITEM_SUCCESS:
            const updatedItems = state.cartItems.map(item =>
                item.id === action.payload.id ? action.payload : item
            );
            
            return {
                ...state,
                loading: false,
                cart: {
                    ...state.cart,
                    item: updatedItems,
                    total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
                },
                cartItems: updatedItems,
            };

        case REMOVE_CARTITEM_SUCCESS:
            const filteredItems = state.cartItems.filter(item => item.id !== action.payload);
            
            return {
                ...state,
                loading: false,
                cart: {
                    ...state.cart,
                    item: filteredItems,
                    total: filteredItems.reduce((sum, item) => sum + item.totalPrice, 0)
                },
                cartItems: filteredItems,
            };

        case FIND_CART_FAILURE:
        case UPDATE_CARTITEM_FAILURE:
        case REMOVE_CARTITEM_FAILURE:
        case CLEAR_CART_FAILURE:
        case ADD_ITEM_TO_CART_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case LOGOUT:
            localStorage.removeItem("jwt");
            return {
                ...state,
                cart: null,
                cartItems: [],
                success: "logout success",
            };

        default:
            return state;
    }
};

export default cartReducer;