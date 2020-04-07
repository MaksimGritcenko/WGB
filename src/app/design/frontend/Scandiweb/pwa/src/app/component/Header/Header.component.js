import { Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import { history } from 'Route';

import SourceHeader, {
    PDP,
    CATEGORY,
    CUSTOMER_ACCOUNT,
    CUSTOMER_ACCOUNT_PAGE,
    HOME_PAGE,
    MENU,
    MENU_SUBCATEGORY,
    SEARCH,
    FILTER,
    CART,
    CART_EDITING,
    CHECKOUT,
    CMS_PAGE,
    POPUP
} from 'SourceComponent/Header/Header.component';
import MenuOverlay from 'Component/MenuOverlay';
import CartOverlay from 'Component/CartOverlay';
import ClickOutside from 'Component/ClickOutside';
import SearchOverlay from 'Component/SearchOverlay';
import GenderSliderButtons from 'Component/GenderSliderButtons';
import Link from 'Component/Link';

import { CART_OVERLAY_ID } from 'Component/CartOverlay/CartOverlay.container';

import {
    menuIcon,
    searchIcon,
    minicartIcon,
    logoIcon,
    closeIcon,
    backIcon,
    editIcon,
    wishlistIcon
} from './Header.config';

import './Header.style';
import 'Component/Popup/Popup.style';

export {
    PDP,
    POPUP,
    CATEGORY,
    CUSTOMER_ACCOUNT,
    CUSTOMER_ACCOUNT_PAGE,
    CUSTOMER_SUB_ACCOUNT,
    HOME_PAGE,
    MENU,
    MENU_SUBCATEGORY,
    SEARCH,
    FILTER,
    CART,
    CART_EDITING,
    CHECKOUT,
    CMS_PAGE
} from 'SourceComponent/Header/Header.component';

export const FAVORITES = 'favorites';
export const URL_REWRITE = 'url-rewrite';
export const PASSWORD_CHANGE = 'password-change';
export const CONTACT_US = 'contact-us';
export const SIGN_IN = 'sign-in';


export const DESKTOP_OVERLAYS = [FILTER, CART_OVERLAY_ID, MENU];
export const MOBILE_OVERLAYS = [FILTER];

export const DRAGBAR_OPEN = 'DRAGBAR_OPEN';

export default class Header extends SourceHeader {
    static propTypes = {
        ...this.propTypes,
        isActiveSlideWhite: PropTypes.bool
    };

    static defaultProps = {
        ...this.defaultProps,
        isActiveSlideWhite: false
    };

    stateMap = {
        [SIGN_IN]: {
            menu: true,
            searchButton: true,
            title: true,
            wishlist: true,
            minicart: true,
            logo: true
        },
        [CONTACT_US]: {
            menu: true,
            searchButton: true,
            title: true,
            wishlist: true,
            minicart: true,
            logo: true
        },
        [FAVORITES]: {
            menu: true,
            searchButton: true,
            title: true,
            account: true,
            minicart: true,
            logo: true
        },
        [POPUP]: {
            title: true,
            close: true
        },
        [PDP]: {
            menu: true,
            searchButton: true,
            title: true,
            account: true,
            minicart: true,
            logo: true,
            not_transparent_part: true
        },
        [DRAGBAR_OPEN]: {
            dragbar_close: true
        },
        [CATEGORY]: {
            menu: true,
            searchButton: true,
            title: true,
            wishlist: true,
            minicart: true
        },
        [CUSTOMER_ACCOUNT]: {
            close: true,
            title: true
        },
        [CUSTOMER_ACCOUNT_PAGE]: {
            back: true,
            title: true
        },
        [HOME_PAGE]: {
            menu: true,
            searchButton: true,
            title: true,
            wishlist: true,
            minicart: true,
            logo: true
        },
        [MENU]: {},
        [MENU_SUBCATEGORY]: {
            back: true,
            title: true
        },
        [SEARCH]: {},
        [CART]: {
            menu: true,
            searchButton: true,
            wishlist: true,
            minicart: true,
            logo: true
        },
        [CART_EDITING]: {
            ok: true,
            title: true,
            cancel: true
        },
        [FILTER]: {
            menu: true,
            searchButton: true,
            title: true,
            wishlist: true,
            minicart: true
        },
        [CHECKOUT]: {
            back: true,
            title: true
        },
        [CMS_PAGE]: {
            back: true,
            title: true
        }
    };

    renderMap = {
        cancel: this.renderCancelButton.bind(this),
        back: this.renderBackButton.bind(this),
        close: this.renderCloseButton.bind(this),
        menu: this.renderMenuButton.bind(this),
        searchButton: this.renderSearchButton.bind(this),
        search: this.renderSearchField.bind(this),
        title: this.renderTitle.bind(this),
        logo: this.renderLogo.bind(this),
        account: this.renderAccountButton.bind(this),
        minicart: this.renderMinicartButton.bind(this),
        clear: this.renderClearButton.bind(this),
        edit: this.renderEditButton.bind(this),
        ok: this.renderOkButton.bind(this),
        dragbar_close: this.renderDragbarCloseButton.bind(this),
        wishlist: this.renderWishlistButton.bind(this),
        not_transparent_part: this.renderNotTransparentPart.bind(this),
        ...this.renderMap
    };

    searchBarRef = createRef();

    onClearSearchButtonClick = this.onClearSearchButtonClick.bind(this);

    renderNotTransparentPart() {
        return <div block="Header" elem="NotTransparentPart" key="NotTransparentPart" />;
    }

    componentDidUpdate() {
        this.disableScrollBehavior();
    }

    disableScrollBehavior() {
        const { location: { pathname } } = history;
        if (pathname === '/') {
            document.body.style.overscrollBehaviorX = 'none';

            return;
        }

        document.body.style.overscrollBehaviorX = 'auto';
    }

    onClearSearchButtonClick() {
        const { onClearSearchButtonClick } = this.props;
        this.searchBarRef.current.focus();
        onClearSearchButtonClick();
    }

    renderLogoImage() {
        return logoIcon;
    }

    renderMenuButton(isVisible = false) {
        const { onMenuOutsideClick, onMenuButtonClick } = this.props;

        return (
            <ClickOutside onClick={ onMenuOutsideClick } key="menu">
                <div
                  block="Header"
                  elem="MenuWrapper"
                >
                    <button
                      block="Header"
                      elem="Button"
                      mods={ { isVisible, type: 'menu' } }
                      aria-label="Go to menu and search"
                      aria-hidden={ !isVisible }
                      tabIndex={ isVisible ? 0 : -1 }
                      onClick={ onMenuButtonClick }
                    >
                        { menuIcon }
                    </button>
                    <MenuOverlay />
                </div>
            </ClickOutside>
        );
    }

    renderBackButton(isVisible = false) {
        const { onBackButtonClick } = this.props;

        return (
            <button
              key="back"
              block="Header"
              elem="Button"
              mods={ { type: 'back', isVisible } }
              onClick={ onBackButtonClick }
              aria-label="Go back"
              aria-hidden={ !isVisible }
              tabIndex={ isVisible ? 0 : -1 }
            >
                { backIcon }
            </button>
        );
    }

    renderSearchButton(isVisible = false) {
        const { onSearchBarFocus } = this.props;

        return (
            <Fragment key="searchButton">
                <button
                  block="Header"
                  elem="Button"
                  mods={ { type: 'searchButton', isVisible } }
                  onClick={ onSearchBarFocus }
                  aria-label="Search"
                  aria-hidden={ !isVisible }
                  tabIndex={ isVisible ? 0 : -1 }
                >
                    { searchIcon }
                </button>
                <SearchOverlay />
            </Fragment>
        );
    }

    renderSearchField() {
        return (
            <Fragment key="search">
                <div
                  block="Header"
                  elem="SearchWrapper"
                  aria-label="Search"
                />
            </Fragment>
        );
    }

    renderAccountButton() {
        return <div key="Account" block="Empty" />;
    }

    renderDragbarCloseButton(isVisible = false) {
        const { onCloseButtonClick } = this.props;

        return (
            <button
              key="dragbar_close"
              block="Header"
              elem="Button"
              mods={ { type: 'close', isVisible } }
              mix={ { block: 'DragBar', elem: 'Close' } }
              onClick={ onCloseButtonClick }
              aria-label="Close"
              aria-hidden={ !isVisible }
              tabIndex={ isVisible ? 0 : -1 }
            >
                { closeIcon }
            </button>
        );
    }

    renderCloseButton(isVisible = false) {
        const { onCloseButtonClick } = this.props;

        return (
            <button
              key="close"
              block="Header"
              elem="Button"
              mods={ { type: 'close', isVisible } }
              onClick={ onCloseButtonClick }
              aria-label="Close"
              aria-hidden={ !isVisible }
              tabIndex={ isVisible ? 0 : -1 }
            >
                { closeIcon }
            </button>
        );
    }

    renderWishlistButton(isVisible = false) {
        const { isSignedIn } = this.props;
        const destination = isSignedIn ? '/my-favorites' : '/signin';

        return (
            <Link
              to={ destination }
              key="wishlist"
              block="Header"
              elem="Button"
              mods={ { type: 'wishlist', isVisible } }
              aria-label="Wishlist"
              aria-hidden={ !isVisible }
              tabIndex={ isVisible ? 0 : -1 }
            >
                { wishlistIcon }
            </Link>
        );
    }

    renderMinicartButton(isVisible = false) {
        const { cartTotals: { items_qty }, onMinicartOutsideClick, onMinicartButtonClick } = this.props;

        return (
            <ClickOutside onClick={ onMinicartOutsideClick } key="minicart">
                <div
                  block="Header"
                  elem="MiniCartWrapper"
                >
                    <button
                      block="Header"
                      elem="Button"
                      mods={ { isVisible, type: 'minicart' } }
                      onClick={ onMinicartButtonClick }
                      aria-label="Minicart"
                    >
                        { minicartIcon }
                        <span
                          aria-label="Items in cart"
                          block="Header"
                          elem="MinicartQty"
                        >
                            { items_qty || '0' }
                        </span>
                    </button>
                    <CartOverlay />
                </div>
            </ClickOutside>
        );
    }

    renderEditButton(isVisible = false) {
        const { onEditButtonClick } = this.props;

        return (
            <button
              key="edit"
              block="Header"
              elem="Button"
              mods={ { type: 'edit', isVisible } }
              onClick={ onEditButtonClick }
              aria-label="Clear"
              aria-hidden={ !isVisible }
              tabIndex={ isVisible ? 0 : -1 }
            >
                { editIcon }
            </button>
        );
    }

    renderLogo(isVisible = false) {
        return (
            <Link
              to="/"
              aria-label="Go to homepage by clicking on ScandiPWA logo"
              aria-hidden={ !isVisible }
              tabIndex={ isVisible ? 0 : -1 }
              block="Header"
              elem="LogoWrapper"
              mods={ { isVisible } }
              key="logo"
            >
                { this.renderLogoImage() }
            </Link>
        );
    }

    renderHeaderState() {
        const { navigationState: { name } } = this.props;

        const source = this.stateMap[name]
            ? this.stateMap[name]
            : this.stateMap[HOME_PAGE];

        return Object.entries(this.renderMap).map(
            ([key, renderFunction]) => renderFunction(source[key])
        );
    }

    renderGenderSwitcherButtons() {
        const { headerType } = this.props;

        if (!headerType || !headerType.isSearch) return null;

        return <GenderSliderButtons />;
    }

    renderFilterButton() {
        const { onFilterButtonClick } = this.props;

        return (
            <div
              block="Header"
              elem="Filter"
            >
                { this.renderGenderSwitcherButtons() }
                <button
                  block="Header"
                  elem="Filter-Button"
                  onClick={ onFilterButtonClick }
                >
                    { __('Filters') }
                </button>
            </div>
        );
    }

    renderTitle(isVisible = false) {
        const { navigationState: { title } } = this.props;

        return (
            <h2
              key="title"
              block="Header"
              elem="Title"
              mods={ { isVisible } }
            >
                { title }
            </h2>
        );
    }

    render() {
        const {
            navigationState: { name },
            isActiveSlideWhite,
            headerType
        } = this.props;
        const { pathname } = history.location;

        const isWhite = isActiveSlideWhite && pathname === '/';

        return (
            <header block="Header" mods={ { name, ...headerType } }>
                <nav
                  block="Header"
                  elem="Nav"
                  mods={ { isWhite } }
                >
                    { this.renderHeaderState() }
                </nav>
                { this.renderFilterButton() }
            </header>
        );
    }
}
