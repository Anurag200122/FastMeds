import { CREATE_DOSSAGE_CATEGORY_SUCCESS, CREATE_DOSSAGE_SUCCESS, GET_DOSSAGE, GET_DOSSAGE_CATEGORY_SUCCESS, UPDATE_STOCK } from "./ActionType.js";

const initialState={
    dossage:[],
    update:null,
    category:[],
};

export const dossageReducer=(state=initialState,action)=>{
    switch (action.type){
        case GET_DOSSAGE:
            return{
                ...state,
                dossage:action.payload,
            };
        case GET_DOSSAGE_CATEGORY_SUCCESS:
            return{
                ...state,category:action.payload,
            };
        case CREATE_DOSSAGE_CATEGORY_SUCCESS:
            return{
                ...state,category:[...state.category,action.payload],
            };
        case CREATE_DOSSAGE_SUCCESS:
            return{
                ...state,
                dossage:[...state.dossage,action.payload],
            };
        case UPDATE_STOCK:
            return{
                ...state,
                update:action.payload,
                dossage:state.dossage.map((item)=>
                    item.id===action.payload.id? action.payload:item
                ),
            };
        default:
            return state;
    }
};
