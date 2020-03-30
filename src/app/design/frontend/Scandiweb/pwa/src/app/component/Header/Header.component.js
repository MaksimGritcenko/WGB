import { Fragment, createRef } from 'react';
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
import MyAccountOverlay from 'Component/MyAccountOverlay';

import {
    menuIcon,
    searchIcon,
    accountIcon,
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
    CUSTOMER_SUB_ACCOUNT,
    CUSTOMER_ACCOUNT_PAGE,
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
export default class Header extends SourceHeader {
    static propTypes = {
        ...this.propTypes
        // onSearchBarClick: PropTypes.func.isRequired
    };

    stateMap = {
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
            back: true,
            title: true,
            minicart: true
        },
        [CATEGORY]: {
            menu: true,
            searchButton: true,
            title: true,
            account: true,
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
        [SEARCH]: {
            back: true,
            search: true
        },
        [CART]: {
            close: true,
            title: true,
            edit: true
        },
        [CART_EDITING]: {
            ok: true,
            title: true,
            cancel: true
        },
        // [FILTER]: {
        //     close: true,
        //     clear: true,
        //     title: true
        // },
        [FILTER]: {
            menu: true,
            searchButton: true,
            title: true,
            account: true,
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
        wishlist: this.renderWishlistButton.bind(this),
        ...this.renderMap
    };

    searchBarRef = createRef();

    onClearSearchButtonClick = this.onClearSearchButtonClick.bind(this);

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
        return (
            <button
              key="searchButton"
              block="Header"
              elem="Button"
              mods={ { type: 'searchButton', isVisible } }
              onClick={ () => {} }
              aria-label="Search"
              aria-hidden={ !isVisible }
              tabIndex={ isVisible ? 0 : -1 }
            >
                { searchIcon }
            </button>
        );
    }

    renderSearchField(isSearchVisible = false) {
        const {
            searchCriteria, onSearchOutsideClick,
            onClearSearchButtonClick
            // onSearchBarClick, onSearchBarChange
        } = this.props;

        return (
            <Fragment key="search">
                <ClickOutside onClick={ onSearchOutsideClick }>
                    <div
                      block="Header"
                      elem="SearchWrapper"
                      aria-label="Search"
                    >
                        { /* <input
                            id="search-field"
                            ref={ this.searchBarRef }
                            placeholder={ __('Type a new search') }
                            block="Header"
                            elem="SearchField"
                            onClick={ onSearchBarClick }
                            onChange={ onSearchBarChange }
                            value={ searchCriteria }
                            mods={ {
                                isVisible: isSearchVisible,
                                type: 'searchField'
                            } }
                        /> */ }
                        <SearchOverlay
                          clearSearch={ onClearSearchButtonClick }
                          searchCriteria={ searchCriteria }
                        />
                    </div>
                </ClickOutside>
                <button
                  block="Header"
                  elem="Button"
                  onClick={ this.onClearSearchButtonClick }
                  mods={ {
                      type: 'searchClear',
                      isVisible: isSearchVisible
                  } }
                  aria-label="Clear search"
                />
            </Fragment>
        );
    }

    renderAccountButton(isVisible = false) {
        const { onMyAccountOutsideClick, onMyAccountButtonClick } = this.props;

        return (
            <ClickOutside onClick={ onMyAccountOutsideClick } key="account">
                <div
                  block="Header"
                  elem="AccountWrapper"
                  aria-label="My account"
                >
                    <button
                      block="Header"
                      elem="Button"
                      mods={ { isVisible, type: 'account' } }
                      onClick={ onMyAccountButtonClick }
                      aria-label="Open my account"
                    >
                        { accountIcon }
                    </button>
                    <MyAccountOverlay />
                </div>
            </ClickOutside>
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
        return (
            <button
              key="wishlist"
              block="Header"
              elem="Button"
              mods={ { type: 'wishlist', isVisible } }
              aria-label="Wishlist"
              aria-hidden={ !isVisible }
              tabIndex={ isVisible ? 0 : -1 }
            >
                { wishlistIcon }
            </button>
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

    renderHeaderState() {
        const { navigationState: { name } } = this.props;

        const source = this.stateMap[name]
            ? this.stateMap[name]
            : this.stateMap[HOME_PAGE];

        return Object.entries(this.renderMap).map(
            ([key, renderFunction]) => renderFunction(source[key])
        );
    }

    renderFilterButton() {
        const { onFilterButtonClick } = this.props;

        return (
            <div
              block="Header"
              elem="Filter"
            >
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
        const { navigationState: { name } } = this.props;

        return (
            <header block="Header" mods={ { name } }>
                <nav block="Header" elem="Nav">
                    { this.renderHeaderState() }
                </nav>
                { this.renderFilterButton() }
            </header>
        );
    }
}
