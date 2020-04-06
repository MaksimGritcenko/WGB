import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PureComponent, createRef } from 'react';
import { history } from 'Route';
import { SearchBarDispatcher } from 'Store/SearchBar';
import { hideActiveOverlay } from 'Store/Overlay';
import { goToPreviousNavigationState } from 'Store/Navigation';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { searchIcon } from 'Component/Header/Header.config';
import { SEARCH } from 'Component/Header/Header.component';
import SearchOverlay from './SearchOverlay.component';

export const mapStateToProps = state => ({
    searchResults: state.SearchBarReducer.productsInSearch,
    isLoading: state.SearchBarReducer.isLoading,
    navigationState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState
});

export const mapDispatchToProps = dispatch => ({
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    makeSearchRequest: options => SearchBarDispatcher.handleData(dispatch, options),
    clearSearchResults: () => SearchBarDispatcher.clearSearchResults(dispatch),
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE))
});

export class SearchOverlayContainer extends PureComponent {
    state = { searchCriteria: '' };

    static propTypes = {
        makeSearchRequest: PropTypes.func.isRequired,
        clearSearchResults: PropTypes.func.isRequired,
        goToPreviousNavigationState: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        navigationState: PropTypes.object.isRequired
    };

    containerFunctions = {
        getProductLinkTo: this.getProductLinkTo.bind(this),
        makeSearchRequest: this.makeSearchRequest.bind(this),
        onCloseButtonClick: this.closeSearchOverlay.bind(this)
    };

    searchInputRef = createRef();

    componentDidUpdate(prevProps) {
        const { navigationState: { name: prevName } } = prevProps;
        const { navigationState: { name } } = this.props;

        if (prevName !== name && name === SEARCH) {
            this.searchInputRef.current.focus();
        }
    }

    onSearchBarChange = ({ target: { value: searchCriteria } }) => {
        this.setState({ searchCriteria });
    };

    setDefaultValues() {
        const {
            goToPreviousNavigationState,
            hideActiveOverlay
        } = this.props;

        this.setState({ searchCriteria: '' });

        hideActiveOverlay();
        goToPreviousNavigationState();
    }

    onSearchEnterPress = (e) => {
        if (e.key === 'Enter') {
            const { searchCriteria } = this.state;
            const search = searchCriteria.replace(/\s\s+/g, '%20');

            this.closeSearchOverlay();

            history.push(`/search/${ search }`);
        }
    };

    getProductLinkTo(product) {
        const { url_key } = product;

        if (!url_key) return {};
        return {
            pathname: `/product/${ url_key }`,
            state: { product }
        };
    }

    closeSearchOverlay() {
        const {
            navigationState: { name }
        } = this.props;

        if (name === SEARCH) {
            this.setDefaultValues();
        }
    }

    makeSearchRequest() {
        const { makeSearchRequest, clearSearchResults } = this.props;
        const { searchCriteria } = this.state;

        if (searchCriteria) {
            clearSearchResults();
            makeSearchRequest({ args: { search: searchCriteria } });
        }
    }

    renderSearchField() {
        const { searchCriteria } = this.state;

        return (
            <div
              block="SearchOverlay"
              elem="InputWrapper"
              aria-label="Search"
            >
                <div
                  block="SearchOverlay"
                  elem="InputIcon"
                >
                    { searchIcon }
                </div>
                <input
                  ref={ this.searchInputRef }
                  id="search-field"
                  autoComplete="off"
                  block="SearchOverlay"
                  elem="Input"
                  onKeyDown={ this.onSearchEnterPress }
                  onChange={ this.onSearchBarChange }
                  value={ searchCriteria }
                />
            </div>
        );
    }

    render() {
        const { searchCriteria } = this.state;

        return (
            <SearchOverlay
              { ...this.props }
              { ...this.containerFunctions }
              searchCriteria={ searchCriteria }
            >
                { this.renderSearchField() }
            </SearchOverlay>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchOverlayContainer);
