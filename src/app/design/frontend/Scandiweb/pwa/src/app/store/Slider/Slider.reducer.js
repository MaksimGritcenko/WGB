import { WOMEN } from 'Component/GenderSlider/GenderSlider.component';
import {
    CHANGE_STATE
} from './Slider.action';

export const initialState = {
    activeStateIndex: WOMEN
};

const SliderReducer = (state = initialState, action) => {
    const { type } = action;

    switch (type) {
    case CHANGE_STATE:
        const { activeScreenIndex } = action;

        return {
            ...state,
            activeStateIndex: activeScreenIndex
        };

    default:
        return state;
    }
};

export default SliderReducer;
