import {
    CHANGE_STATE
} from './Slider.action';
import { WOMEN } from 'Component/GenderSlider/GenderSlider.component';

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
            activeState: activeScreenIndex
        };

    default:
        return state;
    }
};

export default SliderReducer;
