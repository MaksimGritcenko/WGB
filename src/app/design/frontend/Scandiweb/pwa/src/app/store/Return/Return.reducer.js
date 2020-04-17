import { GET_RETURN_LIST, SET_LOADING } from './Return.action';

const initialState = {
    isLoading: false,
    returnList: []
};

const ReturnReducer = (state = initialState, action) => {
    const { type } = action;

    switch (type) {
    case GET_RETURN_LIST:
        const { data } = action;

        return {
            ...state,
            returnList: data
        };
    case SET_LOADING:
        const { is } = action;

        return {
            ...state,
            isLoading: is
        };
    default:
        return state;
    }
};

export default ReturnReducer;
