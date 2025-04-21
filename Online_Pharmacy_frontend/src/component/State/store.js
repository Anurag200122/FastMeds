import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { authReducer } from "./Authentication/Reducer.js"; // Add the file extension
import { thunk } from "redux-thunk";
import pharmacyReducer from "./Pharmacy/Reducer.js";
import  cartReducer  from "./Cart/Reducer.js";
import { orderReducer } from "./Order/Reducer.js";
import pharmacyOrderReducer from "./PharmacyOrder/Reducer.js";
import { dossageReducer } from "./Dossage/Reducer.js";
import menuItemReducer from "./Menu/Reducer.js";
import eventReducer from "./Event/Reducer.js";
import prescriptionReducer from "./Prescription/Reducer.js";
import { deliveryReducer } from "./Delivery/Reducer.js";
import { searchReducer } from "./Search/Reducer.js";


const rootReducer = combineReducers({
    auth: authReducer,
    pharmacy: pharmacyReducer,
    menu:menuItemReducer,
    cart:cartReducer,
    order:orderReducer,
    pharmacyOrder: pharmacyOrderReducer,
    dossage:dossageReducer,
    events: eventReducer,
    prescription:prescriptionReducer,
    delivery: deliveryReducer,
    search: searchReducer
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));