import { MenuQuery, CmsBlockQuery } from 'Query';
import { updateMenu } from 'Store/HeaderAndFooter';
import { updateCmsBlocks } from 'Store/CmsBlocksAndSlider';
import {
    HeaderAndFooterDispatcher as SourceHeaderAndFooterDispatcher
} from 'SourceStore/HeaderAndFooter/HeaderAndFooter.dispatcher';

export class HeaderAndFooterDispatcher extends SourceHeaderAndFooterDispatcher {
    onSuccess(options, dispatch) {
        if (options) {
            const {
                menMenu,
                womenMenu,
                moreInfoMenu,
                cmsBlocks
            } = options;

            dispatch(updateMenu(menMenu, womenMenu, moreInfoMenu));
            dispatch(updateCmsBlocks(cmsBlocks));
        }
    }

    prepareRequest(options) {
        const menMenu = MenuQuery.getQuery({ identifier: 'men-menu' }).setAlias('menMenu');
        const womenMenu = MenuQuery.getQuery({ identifier: 'women-menu' }).setAlias('womenMenu');
        const moreInfoMenu = MenuQuery.getQuery({ identifier: 'moreinfo-menu' }).setAlias('moreInfoMenu');

        return [
            menMenu,
            womenMenu,
            moreInfoMenu,
            CmsBlockQuery.getQuery(options.footer)
        ];
    }
}

export default new HeaderAndFooterDispatcher();
