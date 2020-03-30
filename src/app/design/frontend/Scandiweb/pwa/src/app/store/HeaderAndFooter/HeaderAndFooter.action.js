import { UPDATE_MENU } from 'SourceStore/HeaderAndFooter/HeaderAndFooter.action';

export const updateMenu = (menMenu, womenMenu) => ({
    type: UPDATE_MENU,
    menMenu,
    womenMenu
});

export {
    UPDATE_MENU,
    TOGGLE_HEADER_AND_FOOTER
} from 'SourceStore/HeaderAndFooter/HeaderAndFooter.action';
