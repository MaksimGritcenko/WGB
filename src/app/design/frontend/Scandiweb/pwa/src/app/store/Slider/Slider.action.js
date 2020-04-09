export const CHANGE_STATE = 'CHANGE_STATE';
export const CHANGE_VERTICAL_SLIDE_INDEX = 'CHANGE_VERTICAL_SLIDE_INDEX';
export const SET_SLIDE_CONTENT_COLORS = 'SET_SLIDE_CONTENT_COLORS';
export const RESET_SLIDER_IN_ACTION = 'RESET_SLIDER_IN_ACTION';
export const CHANGE_SLIDER_IN_ACTION = 'CHANGE_SLIDER_IN_ACTION';

export const changeState = activeHorizontalSlideIndex => ({
    type: CHANGE_STATE,
    activeHorizontalSlideIndex
});

export const changeVerticalSlideIndex = (activeHorizontalSlideIndex, activeVerticalSlideIndex) => ({
    type: CHANGE_VERTICAL_SLIDE_INDEX,
    activeVerticalSlideIndex,
    activeHorizontalSlideIndex
});

export const setSlideContentColors = slider => ({
    type: SET_SLIDE_CONTENT_COLORS,
    slider
});

export const resetSliderInAction = () => ({
    type: RESET_SLIDER_IN_ACTION
});

export const changeSliderInAction = index => ({
    type: CHANGE_SLIDER_IN_ACTION,
    index
});
