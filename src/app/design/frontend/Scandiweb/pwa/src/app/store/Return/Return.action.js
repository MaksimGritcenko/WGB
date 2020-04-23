export const GET_RETURN_LIST = 'GET_RETURN_LIST';
export const SET_LOADING = 'SET_LOADING';

export const getReturnList = data => ({
    type: GET_RETURN_LIST,
    data
});

export const setLoading = is => ({
    type: SET_LOADING,
    is
});
