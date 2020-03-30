import { MenuQuery, CmsBlockQuery } from 'Query';
import { updateMenu } from 'Store/HeaderAndFooter';
import { updateCmsBlocks } from 'Store/CmsBlocksAndSlider';
import {
    HeaderAndFooterDispatcher as SourceHeaderAndFooterDispatcher
} from 'SourceStore/HeaderAndFooter/HeaderAndFooter.dispatcher';

export class HeaderAndFooterDispatcher extends SourceHeaderAndFooterDispatcher {
    onSuccess(options, dispatch) {
        if (options) {
            const { menMenu, womenMenu, cmsBlocks } = options;
            dispatch(updateMenu(menMenu, womenMenu));
            dispatch(updateCmsBlocks(cmsBlocks));
        }
    }

    prepareRequest(options) {
        const menMenu = MenuQuery.getQuery({ identifier: 'men-menu' }).setAlias('menMenu');
        const womenMenu = MenuQuery.getQuery({ identifier: 'women-menu' }).setAlias('womenMenu');

        return [
            menMenu,
            womenMenu,
            CmsBlockQuery.getQuery(options.footer)
        ];
    }
}

export default new HeaderAndFooterDispatcher();
