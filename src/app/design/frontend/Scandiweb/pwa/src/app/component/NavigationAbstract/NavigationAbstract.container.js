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

import {
    CATEGORY, FILTER, PDP, FAVORITES
} from 'Component/Header/Header.component';
import SourceNavigationAbstractContainer from 'SourceComponent/NavigationAbstract/NavigationAbstract.container';

export { DEFAULT_STATE } from 'SourceComponent/NavigationAbstract/NavigationAbstract.container';

export const HISTORY_START_CATEGORY_STRING = 1;
export const HISTORY_END_CATEGORY_STRING = 8;

export class NavigationAbstractContainer extends SourceNavigationAbstractContainer {
    handleMobileRouteChange(history) {
        const {
            hideActiveOverlay,
            setNavigationState,
            navigationState: { name }
        } = this.props;

        const { pathname } = history;

        // Find the new state name
        const newNavigationState = this.getNavigationState(pathname);
        const { name: newName } = newNavigationState;

        // Update the state if new name is set
        if (name !== newName && name !== FILTER && name !== FAVORITES) {
            setNavigationState(newNavigationState);
        }

        if (name === FILTER && newName === PDP) {
            hideActiveOverlay();
        }

        return { prevPathname: pathname };
    }

    handleDesktopRouteChange(history) {
        const { hideActiveOverlay, setNavigationState } = this.props;
        const { pathname } = history;

        const path = pathname.substr(HISTORY_START_CATEGORY_STRING, HISTORY_END_CATEGORY_STRING);

        if (path !== CATEGORY) hideActiveOverlay();

        if (pathname === '/') {
            setNavigationState(this.routeMap[pathname]);
        }

        return {};
    }
}

export default NavigationAbstractContainer;
