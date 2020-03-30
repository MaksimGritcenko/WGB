export const CHANGE_STATE = 'CHANGE_STATE';
export const CHANGE_VERTICAL_SLIDE_INDEX = 'CHANGE_VERTICAL_SLIDE_INDEX';

export const changeState = activeHorizontalSlideIndex => ({
    type: CHANGE_STATE,
    activeHorizontalSlideIndex
});

export const changeVerticalSlideIndex = (activeHorizontalSlideIndex, activeVerticalSlideIndex) => ({
    type: CHANGE_VERTICAL_SLIDE_INDEX,
    activeVerticalSlideIndex,
    activeHorizontalSlideIndex
});
