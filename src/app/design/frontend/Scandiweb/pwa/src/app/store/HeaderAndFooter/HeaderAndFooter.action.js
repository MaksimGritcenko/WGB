import { UPDATE_MENU } from 'SourceStore/HeaderAndFooter/HeaderAndFooter.action';

export const updateMenu = (menMenu, womenMenu, moreInfoMenu) => ({
    type: UPDATE_MENU,
    menMenu,
    womenMenu,
    moreInfoMenu
});

export {
    UPDATE_MENU,
    TOGGLE_HEADER_AND_FOOTER
} from 'SourceStore/HeaderAndFooter/HeaderAndFooter.action';
