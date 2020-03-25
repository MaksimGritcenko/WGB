/* eslint-disable react/require-render-return */

/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { CATEGORY } from 'Component/Header/Header.component';
import SourceNavigationAbstractContainer from 'SourceComponent/NavigationAbstract/NavigationAbstract.container';

export { DEFAULT_STATE } from 'SourceComponent/NavigationAbstract/NavigationAbstract.container';

export const HISTORY_START_CATEGORY_STRING = 1;
export const HISTORY_END_CATEGORY_STRING = 8;

export class NavigationAbstractContainer extends SourceNavigationAbstractContainer {
    handleDesktopRouteChange(history) {
        const { hideActiveOverlay } = this.props;

        const path = history.pathname.substr(HISTORY_START_CATEGORY_STRING, HISTORY_END_CATEGORY_STRING);

        if (path !== CATEGORY) hideActiveOverlay();

        return {};
    }
}

export default NavigationAbstractContainer;
