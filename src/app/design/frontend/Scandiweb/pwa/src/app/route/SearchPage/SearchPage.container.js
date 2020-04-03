import { connect } from 'react-redux';
import { SEARCH } from 'Component/Header/Header.component';
import { TOP_NAVIGATION_TYPE, BOTTOM_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { BreadcrumbsDispatcher } from 'Store/Breadcrumbs';
import { changeNavigationState } from 'Store/Navigation';
import { CategoryDispatcher, updateCurrentCategory } from 'Store/Category';
import { toggleOverlayByKey } from 'Store/Overlay';
import { setBigOfflineNotice } from 'Store/Offline';
import { NoMatchDispatcher } from 'Store/NoMatch';
import { MetaDispatcher } from 'Store/Meta';

import {
    ProductListInfoDispatcher,
    updateInfoLoadStatus
} from 'Store/ProductListInfo';
import {
    CategoryPageContainer,
    LOADING_TIME
} from 'SourceRoute/CategoryPage/CategoryPage.container';
import { getUrlParam } from 'Util/Url';
import { debounce } from 'Util/Request';

import SearchPage from './SearchPage.component';

const WOMEN_CATEGORY = 'women';
const MEN_CATEGORY = 'men';
const SEARCH_PAGE = `/${ SEARCH }`;

export const mapStateToProps = state => ({
    category: state.CategoryReducer.category,
    isOffline: state.OfflineReducer.isOffline,
    filters: state.ProductListInfoReducer.filters,
    sortFields: state.ProductListInfoReducer.sortFields,
    minPriceRange: state.ProductListInfoReducer.minPrice,
    maxPriceRange: state.ProductListInfoReducer.maxPrice,
    isInfoLoading: state.ProductListInfoReducer.isLoading,
    totalPages: state.ProductListReducer.totalPages,
    activeHorizontalSlideIndex: state.SliderReducer.activeHorizontalSlideIndex
});

export const mapDispatchToProps = dispatch => ({
    toggleOverlayByKey: key => dispatch(toggleOverlayByKey(key)),
    changeHeaderState: state => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    changeNavigationState: state => dispatch(changeNavigationState(BOTTOM_NAVIGATION_TYPE, state)),
    requestCategory: options => CategoryDispatcher.handleData(dispatch, options),
    updateBreadcrumbs: breadcrumbs => ((Object.keys(breadcrumbs).length)
        ? BreadcrumbsDispatcher.updateWithCategory(breadcrumbs, dispatch)
        : BreadcrumbsDispatcher.update([], dispatch)),
    requestProductListInfo: options => ProductListInfoDispatcher.handleData(dispatch, options),
    updateLoadStatus: isLoading => dispatch(updateInfoLoadStatus(isLoading)),
    updateNoMatch: options => NoMatchDispatcher.updateNoMatch(dispatch, options),
    setBigOfflineNotice: isBig => dispatch(setBigOfflineNotice(isBig)),
    updateMetaFromCategory: category => MetaDispatcher.updateWithCategory(category, dispatch),
    updateCurrentCategory: category => dispatch(updateCurrentCategory(category))
});


export class SearchPageContainer extends CategoryPageContainer {
    static defaultProps = {
        ...this.defaultProps,
        isSearchPage: true
    };

    componentDidMount() {
        const {
            location: { pathname },
            updateBreadcrumbs,
            isOnlyPlaceholder,
            updateLoadStatus,
            history
        } = this.props;

        if (isOnlyPlaceholder) updateLoadStatus(true);

        if (pathname === SEARCH_PAGE || pathname === `${ SEARCH_PAGE }/`) {
            history.push('/');
            return;
        }

        // request data only if URL does not match loaded category
        if (this.getIsNewCategory()) {
            this._requestCategoryWithPageList();
            updateBreadcrumbs({});
        } else {
            this._onCategoryUpdate();
        }
    }

    componentDidUpdate(prevProps) {
        const {
            category: { id }, isOffline
        } = this.props;

        const { category: { id: prevId } } = prevProps;

        if (isOffline) {
            debounce(this.setOfflineNoticeSize, LOADING_TIME)();
        }

        // update breadcrumbs only if category has changed
        if (id !== prevId) {
            this._onCategoryUpdate();
        }

        this._updateData(prevProps);
    }

    _onCategoryUpdate() {
        this._updateHeaderState();
        this._updateNavigationState();
    }

    _requestCategory() {
        const { updateCurrentCategory, match: { params: { query: url_path } } } = this.props;

        updateCurrentCategory({ url_path });
        this._updateHeaderState();
    }

    getGenderCategoryUrlPath() {
        const { activeHorizontalSlideIndex } = this.props;

        return activeHorizontalSlideIndex === 0 ? WOMEN_CATEGORY : MEN_CATEGORY;
    }

    _getProductListOptions(currentPage) {
        const { match: { params: { query } } } = this.props;
        const customFilters = this._getSelectedFiltersFromUrl();
        const categoryUrlPath = this.getGenderCategoryUrlPath();

        return {
            args: {
                filter: {
                    categoryUrlPath,
                    customFilters
                },
                search: query
            },
            currentPage
        };
    }

    _getFilter() {
        const { categoryIds } = this.props;
        const customFilters = this._getSelectedFiltersFromUrl();
        const priceRange = this._getSelectedPriceRangeFromUrl();
        const categoryUrlPath = this.getGenderCategoryUrlPath();

        return {
            priceRange,
            categoryIds,
            customFilters,
            categoryUrlPath
        };
    }

    _getSearchParam() {
        const { match: { params: { query } } } = this.props;

        return query;
    }

    getIsNewCategory() {
        const { category: { url_path } = {} } = this.props;

        const { location, match } = this.props;
        const path = getUrlParam(match, location);

        return `search/${ url_path }` !== path;
    }

    render() {
        const { pageSize } = this.config;

        return (
            <SearchPage
              { ...this.props }
              pageSize={ pageSize }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPageContainer);
