export const CHANGE_STATE = 'CHANGE_STATE';
export const CHANGE_VERTICAL_SLIDE_INDEX = 'CHANGE_VERTICAL_SLIDE_INDEX';
export const SET_SLIDE_CONTENT_COLORS = 'SET_SLIDE_CONTENT_COLORS';

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
