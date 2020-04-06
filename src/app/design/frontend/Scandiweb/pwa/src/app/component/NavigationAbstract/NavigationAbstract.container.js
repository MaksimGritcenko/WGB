import isMobile from 'Util/Mobile';
import { history } from 'Route';
import { CATEGORY_FILTER_OVERLAY_ID } from 'Component/CategoryFilterOverlay/CategoryFilterOverlay.component';
import {
    FAVORITES,
    CATEGORY,
    SEARCH
} from 'Component/Header/Header.component';
import SourceNavigationAbstractContainer from 'SourceComponent/NavigationAbstract/NavigationAbstract.container';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.component';

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

    getHeaderType() {
        const { location: { pathname = '' } = {} } = history || {};

        if ((pathname).substring(1, CATEGORY_STRING_END) === CATEGORY) {
            return { isCategory: true };
        }
        if ((pathname).indexOf(`/${ SEARCH }`) === 0) {
            return { isCategory: true, isSearch: true };
        }

        return {};
    }

    onRouteChanged(history) {
        const headerType = this.getHeaderType();

        if (!isMobile.any()) {
            return {
                headerType,
                ...this.handleDesktopRouteChange(history)
            };
        }

        return {
            headerType,
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
        const { setNavigationState, activeOverlay } = this.props;
        const { pathname = '' } = history;

        const { hideActiveOverlay } = this.props;
        const path = pathname.substring(1, CATEGORY_STRING_END);

        // leave filters open when filter attributes change / get cleared
        if (
            this.default_state.name === DEFAULT_STATE_NAME
            && !(path === CATEGORY && activeOverlay === CATEGORY_FILTER_OVERLAY_ID)
        ) {
            hideActiveOverlay();
        }

        if (pathname === '/') {
            setNavigationState(this.routeMap[pathname]);
        }

        return {};
    }
}

export default NavigationAbstractContainer;
