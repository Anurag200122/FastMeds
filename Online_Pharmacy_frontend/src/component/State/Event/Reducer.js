import { CREATE_EVENTS_FAILURE,CREATE_EVENTS_SUCCESS,CREATE_EVENTS_REQUEST,GET_ALL_EVENTS_FAILURE,GET_ALL_EVENTS_REQUEST,GET_ALL_EVENTS_SUCCESS, DELETE_EVENTS_REQUEST,DELETE_EVENTS_SUCCESS,DELETE_EVENTS_FAILURE} from "./ActionType";

// Add to your initialState
const initialState = {
    // ... existing state
    events: [],
    loadingEvents: false,
    errorEvents: null
  };
  
  // Add these cases to your reducer
  const eventReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_EVENTS_REQUEST:
      case GET_ALL_EVENTS_REQUEST:
      case DELETE_EVENTS_REQUEST:
        return { ...state, loadingEvents: true, errorEvents: null };
        
      case CREATE_EVENTS_SUCCESS:
        return { 
          ...state, 
          loadingEvents: false,
          events: [...state.events, action.payload] 
        };
        
      case GET_ALL_EVENTS_SUCCESS:
        return { 
          ...state, 
          loadingEvents: false,
          events: action.payload 
        };
        
      case DELETE_EVENTS_SUCCESS:
        return {
          ...state,
          loadingEvents: false,
          events: state.events.filter(event => event.id !== action.payload)
        };
        
      case CREATE_EVENTS_FAILURE:
      case GET_ALL_EVENTS_FAILURE:
      case DELETE_EVENTS_FAILURE:
        return { 
          ...state, 
          loadingEvents: false, 
          errorEvents: action.payload 
        };
        
      // ... other cases
      default:
        return state;
    }
  };

  export default eventReducer;