import PropTypes from 'prop-types';
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
import { DRAGBAR_OPEN } from 'Component/Header/Header.component';

export const HISTORY_START_CATEGORY_STRING = 1;
export const HISTORY_END_CATEGORY_STRING = 8;

export const mapStateToProps = state => ({
    navigationState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
    cartTotals: state.CartReducer.cartTotals,
    header_logo_src: state.ConfigReducer.header_logo_src,
    logo_alt: state.ConfigReducer.logo_alt,
    isLoading: state.ConfigReducer.isLoading,
    isActiveSlideWhite: state.SliderReducer.isActiveSlideWhite
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
            searchCriteria
        } = this.state;

        return {
            navigationState,
            cartTotals,
            header_logo_src,
            logo_alt,
            isLoading,
            isClearEnabled,
            searchCriteria,
            isActiveSlideWhite
        };
    };

    handleMobileUrlChange(history) {
        const { navigationState: { name } } = this.props;
        const { prevPathname } = this.state;
        const { pathname } = history;
        const isClearEnabled = this.getIsClearEnabled();

        // handle dragbar update on select option
        if (name === DRAGBAR_OPEN && (prevPathname === pathname || !prevPathname)) {
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
        const { showOverlay } = this.props;
        showOverlay(CATEGORY_FILTER_OVERLAY_ID);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
