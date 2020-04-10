import { WOMEN } from 'Component/GenderSlider/GenderSlider.component';
import { WOMEN_SLIDER_ID } from 'Route/HomePage/HomePage.component';

import {
    CHANGE_STATE,
    CHANGE_VERTICAL_SLIDE_INDEX,
    SET_SLIDE_CONTENT_COLORS,
    RESET_SLIDER_IN_ACTION,
    CHANGE_SLIDER_IN_ACTION
} from './Slider.action';

const INITIAL_VERTICAL_STATE = 0;
const INITIAL_HORIZONTAL_STATE = 0;

export const VERTICAL_INDEX = 0;
export const HORIZONTAL_INDEX = 1;

const DEFAULT_SLIDER_IN_ACTION = null;

export const initialState = {
    activeHorizontalSlideIndex: WOMEN,
    activeVerticalSlideIndex: {
        [VERTICAL_INDEX]: INITIAL_VERTICAL_STATE,
        [HORIZONTAL_INDEX]: INITIAL_HORIZONTAL_STATE
    },
    sliderColors: [[], []],
    isActiveSlideWhite: false,
    sliderInAction: DEFAULT_SLIDER_IN_ACTION
};

const isActiveSliderWhite = (state, horizontalSlideIndex, verticalSlideIndex = null) => {
    const { sliderColors } = state;

    const verticalIndex = verticalSlideIndex === null
        ? state.activeVerticalSlideIndex[horizontalSlideIndex]
        : verticalSlideIndex;

    return sliderColors[horizontalSlideIndex][verticalIndex];
};

const SliderReducer = (state = initialState, action) => {
    const { type, activeHorizontalSlideIndex } = action;

    switch (type) {
    case CHANGE_STATE:
        return {
            ...state,
            activeHorizontalSlideIndex,
            isActiveSlideWhite: isActiveSliderWhite(state, activeHorizontalSlideIndex)
        };

    case CHANGE_VERTICAL_SLIDE_INDEX:
        const { activeVerticalSlideIndex } = action;

        return {
            ...state,
            activeVerticalSlideIndex: {
                ...state.activeVerticalSlideIndex,
                [activeHorizontalSlideIndex]: activeVerticalSlideIndex
            },
            isActiveSlideWhite: isActiveSliderWhite(state, activeHorizontalSlideIndex, activeVerticalSlideIndex)
        };

    case SET_SLIDE_CONTENT_COLORS:
        const { slider: { slider_id, slides } } = action;
        const { sliderColors } = state;

        const sliderIndex = parseInt(slider_id, 10) === WOMEN_SLIDER_ID ? 0 : 1;

        sliderColors[sliderIndex] = slides.map(({ slide_content_is_white }) => slide_content_is_white);

        return {
            ...state,
            sliderColors,
            isActiveSlideWhite: sliderColors[INITIAL_VERTICAL_STATE][INITIAL_HORIZONTAL_STATE] || false
        };

    case RESET_SLIDER_IN_ACTION:
        return { ...state, sliderInAction: DEFAULT_SLIDER_IN_ACTION };

    case CHANGE_SLIDER_IN_ACTION:
        const { index } = action;

        return { ...state, sliderInAction: index };

    default:
        return state;
    }
};

export default SliderReducer;
