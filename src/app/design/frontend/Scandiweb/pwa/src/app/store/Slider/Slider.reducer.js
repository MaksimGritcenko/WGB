import { WOMEN, MEN } from 'Component/GenderSlider/GenderSlider.component';
import {
    CHANGE_STATE,
    CHANGE_VERTICAL_SLIDE_INDEX
} from './Slider.action';

export const initialState = {
    activeHorizontalSlideIndex: WOMEN,
    activeVerticalSlideIndex: [0,0],
    sliderColors: [
        [true, false, true],
        [false, true, false]
    ],
    isActiveSlideWhite: true
};

const isActiveSliderWhite = (state, horizontalSlideIndex, verticalSlideIndex = null) => {
    const { sliderColors } = state;

    const verticalIndex = verticalSlideIndex === null
        ? state.activeVerticalSlideIndex[horizontalSlideIndex]
        : verticalSlideIndex

    return sliderColors[horizontalSlideIndex][verticalIndex];
}

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

    default:
        return state;
    }
};

export default SliderReducer;
