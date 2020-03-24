export const CHANGE_STATE = 'CHANGE_STATE';

export const changeState = activeScreenIndex => ({
    type: CHANGE_STATE,
    activeScreenIndex
});
