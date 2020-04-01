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

import isMobile from 'Util/Mobile';
import { history } from 'Route';
import {
    FAVORITES, CATEGORY
} from 'Component/Header/Header.component';
import SourceNavigationAbstractContainer from 'SourceComponent/NavigationAbstract/NavigationAbstract.container';

export const CATEGORY_STRING_END = 9;

export { DEFAULT_STATE } from 'SourceComponent/NavigationAbstract/NavigationAbstract.container';

export class NavigationAbstractContainer extends SourceNavigationAbstractContainer {
    componentDidMount() {
        const { setNavigationState } = this.props;
        setNavigationState(this.getNavigationState(history.location.pathname));
        history.listen(history => this.setState(this.onRouteChanged(history)));
        this.setState(this.onRouteChanged(history));
    }

    getNavigationState(pathname = '') {
        const activeRoute = Object.keys(this.routeMap)
            .find(route => (route !== '/' || pathname === '/') && pathname.includes(route));

        return this.routeMap[activeRoute] || this.default_state;
    }

    onRouteChanged(history) {
        const { hideActiveOverlay } = this.props;
        hideActiveOverlay();

        const { location: { pathname: startPathname } = {}, pathname = '' } = history || {};
        const isCategory = (startPathname || pathname).substring(1, CATEGORY_STRING_END) === CATEGORY;

        if (!isMobile.any()) {
            return {
                isCategory,
                ...this.handleDesktopRouteChange(history)
            };
        }

        return {
            isCategory,
            ...this.handleMobileUrlChange(history)
        };
    }

    handleMobileRouteChange(history) {
        const {
            setNavigationState,
            navigationState: { name }
        } = this.props;

        const { pathname } = history;

        // Find the new state name
        const newNavigationState = this.getNavigationState(pathname);
        const { name: newName } = newNavigationState;

        // Update the state if new name is set
        if (name !== newName && name !== FAVORITES) {
            setNavigationState(newNavigationState);
        }

        return { prevPathname: pathname };
    }

    handleDesktopRouteChange(history) {
        const { setNavigationState } = this.props;
        const { pathname } = history;

        if (pathname === '/') {
            setNavigationState(this.routeMap[pathname]);
        }

        return {};
    }
}

export default NavigationAbstractContainer;
