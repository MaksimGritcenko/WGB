import MenuReducer from 'Util/Menu';
import {
    UPDATE_MENU,
    TOGGLE_HEADER_AND_FOOTER
} from './HeaderAndFooter.action';

export const initialState = {
    menMenu: {},
    womenMenu: {},
    isHeaderAndFooterVisible: true
};

const HeaderAndFooterReducer = (state = initialState, action) => {
    const {
        type,
        isHeaderAndFooterVisible,
        menMenu,
        womenMenu
    } = action;

    switch (type) {
    case UPDATE_MENU:
        return {
            ...state,
            menMenu: MenuReducer.reduce(menMenu),
            womenMenu: MenuReducer.reduce(womenMenu)
        };
    case TOGGLE_HEADER_AND_FOOTER:
        return { ...state, isHeaderAndFooterVisible };
    default:
        return state;
    }
};

export default HeaderAndFooterReducer;
