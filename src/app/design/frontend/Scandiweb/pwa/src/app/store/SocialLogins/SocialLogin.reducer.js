import { UPDATE_SOCIAL_LOGINS } from './SocialLogin.action';

const initialState = {
    logins: [],
    isLoading: true
};

const SocialLoginReducer = (state = initialState, action) => {
    const { type } = action;

    switch (type) {
    case UPDATE_SOCIAL_LOGINS:
        const { logins } = action;

        return {
            ...state,
            logins,
            isLoading: false
        };
    default:
        return state;
    }
};

export default SocialLoginReducer;
