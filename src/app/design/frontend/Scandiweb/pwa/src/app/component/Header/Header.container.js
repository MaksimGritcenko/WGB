import PropTypes from 'prop-types';
import isMobile from 'Util/Mobile';
import { connect } from 'react-redux';
import { toggleOverlayByKey, hideActiveOverlay } from 'Store/Overlay';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation';
import {
    HeaderContainer as SourceHeaderContainer
} from 'SourceComponent/Header/Header.container';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import {
    CATEGORY_FILTER_OVERLAY_ID
} from 'Component/CategoryFilterOverlay/CategoryFilterOverlay.component';

import Header, {
    DRAGBAR_OPEN,
    MENU,
    SEARCH,
    FILTER,
    CUSTOMER_ACCOUNT_PAGE
} from 'Component/Header/Header.component';
import { CART_OVERLAY_ID } from 'Component/CartOverlay/CartOverlay.container';
import { history } from 'Route';

export const HISTORY_START_CATEGORY_STRING = 1;
export const HISTORY_END_CATEGORY_STRING = 8;

export const mapStateToProps = state => ({
    availableFilters: state.ProductListInfoReducer.filters,
    navigationState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
    activeOverlay: state.OverlayReducer.activeOverlay,
    cartTotals: state.CartReducer.cartTotals,
    header_logo_src: state.ConfigReducer.header_logo_src,
    isOffline: state.OfflineReducer.isOffline,
    logo_alt: state.ConfigReducer.logo_alt,
    isLoading: state.ConfigReducer.isLoading,
    isActiveSlideWhite: state.SliderReducer.isActiveSlideWhite,
    isSignedIn: state.MyAccountReducer.isSignedIn
});

export const mapDispatchToProps = dispatch => ({
    showOverlay: overlayKey => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    setNavigationState: stateName => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE))
});

export { DEFAULT_HEADER_STATE } from 'SourceComponent/Header/Header.container';

export class HeaderContainer extends SourceHeaderContainer {
    static propTypes = {
        showOverlay: PropTypes.func.isRequired,
        goToPreviousNavigationState: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        header_logo_src: PropTypes.string
    };

    routeMap = {
        ...this.routeMap,
        '/my-account': {
            name: CUSTOMER_ACCOUNT_PAGE,
            title: 'My Account',
            onBackClick: () => history.goBack()
        }
    };

    static defaultProps = {
        header_logo_src: ''
    };


    containerFunctions = {
        ...this.containerFunctions,
        onFilterButtonClick: this.onFilterButtonClick.bind(this)
    };

    containerProps = () => {
        const {
            navigationState,
            cartTotals,
            header_logo_src,
            logo_alt,
            isLoading,
            isActiveSlideWhite
        } = this.props;

        const {
            isClearEnabled,
            searchCriteria,
            isCheckout,
            showMyAccountLogin
        } = this.state;

        return {
            navigationState,
            cartTotals,
            header_logo_src,
            logo_alt,
            isLoading,
            isClearEnabled,
            searchCriteria,
            isActiveSlideWhite,
            isCheckout,
            showMyAccountLogin
        };
    };

    handleMobileUrlChange(history) {
        const { navigationState: { name } } = this.props;
        const { prevPathname } = this.state;
        const { pathname } = history;
        const isClearEnabled = this.getIsClearEnabled();

        // handle dragbar update on select option
        if (
            name === DRAGBAR_OPEN
            && (prevPathname === pathname || !prevPathname)
        ) {
            return {};
        }

        if (prevPathname === pathname) {
            return { isClearEnabled };
        }

        return {
            isClearEnabled,
            ...this.handleMobileRouteChange(history)
        };
    }

    onFilterButtonClick() {
        const { showOverlay, setNavigationState } = this.props;

        showOverlay(CATEGORY_FILTER_OVERLAY_ID);
        setNavigationState({ name: FILTER });
    }

    onMenuButtonClick() {
        const {
            showOverlay,
            setNavigationState,
            navigationState: { name }
        } = this.props;

        if (name !== MENU) {
            showOverlay(MENU);
            setNavigationState({ name: MENU });
        }
    }

    onSearchBarFocus() {
        const {
            setNavigationState,
            showOverlay,
            navigationState: { name }
        } = this.props;

        if (!isMobile.any() && name === SEARCH) return;

        showOverlay(SEARCH);

        setNavigationState({
            name: SEARCH
        });
    }

    onSearchOutsideClick() {}

    onMinicartOutsideClick() {
        const {
            goToPreviousNavigationState,
            hideActiveOverlay,
            navigationState: { name }
        } = this.props;

        if (isMobile.any() || name !== CART_OVERLAY_ID) return;

        goToPreviousNavigationState();
        hideActiveOverlay();
    }

    onMinicartButtonClick() {
        const {
            goToPreviousNavigationState,
            activeOverlay,
            showOverlay
        } = this.props;

        if (!isMobile.any()) {
            if (activeOverlay === CART_OVERLAY_ID) goToPreviousNavigationState();
            return showOverlay(CART_OVERLAY_ID);
        }

        return history.push('/cart');
    }

    render() {
        const {
            isSignedIn, availableFilters
        } = this.props;

        return (
            <Header
              isSignedIn={ isSignedIn }
              availableFilters={ availableFilters }
              { ...this.state }
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
