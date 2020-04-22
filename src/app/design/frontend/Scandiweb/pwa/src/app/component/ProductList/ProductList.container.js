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

import { withRouter } from 'react-router-dom';

import { getQueryParam } from 'Util/Url';
import { HOME_PAGE, SEARCH } from 'Component/Header';
import Event, { EVENT_GTM_IMPRESSIONS_PLP, EVENT_GTM_IMPRESSIONS_HOME, EVENT_GTM_IMPRESSIONS_SEARCH } from 'Util/Event';


import {
    ProductListContainer as SourceProductListContainer, UPDATE_PAGE_FREQUENCY
} from 'SourceComponent/ProductList/ProductList.container';

export { UPDATE_PAGE_FREQUENCY };

export class ProductListContainer extends SourceProductListContainer {
    static defaultProps = {
        ...this.defaultProps,
        pageSize: 15
    };

    componentDidMount() {
        super.componentDidMount();
        this._updateImpressions({}, true);
    }

    componentDidUpdate(prevProps) {
        const { sort, search, filter } = this.props;
        const { sort: prevSort, search: prevSearch, filter: prevFilter } = prevProps;

        if (search !== prevSearch
            || JSON.stringify(sort) !== JSON.stringify(prevSort)
            || JSON.stringify(filter) !== JSON.stringify(prevFilter)
        ) this.requestPage(this._getPageFromUrl());

        this._updateImpressions(prevProps);
    }

    _updateImpressions(prevProps) {
        const {
            pages, isLoading, selectedFilters: filters,
            category = {}
        } = this.props;
        const { isLoading: prevIsLoading } = prevProps;
        const currentPage = getQueryParam('page', location) || 1;

        if (!Object.keys(pages || {}).length
            || !Object.keys(pages[currentPage] || {}).length
            || isLoading
            || isLoading === prevIsLoading
        ) return;

        const { currentRouteName } = window;

        if (currentRouteName === HOME_PAGE) {
            Event.dispatch(EVENT_GTM_IMPRESSIONS_HOME, { items: pages[currentPage], filters });
        } else if (currentRouteName === SEARCH) {
            Event.dispatch(EVENT_GTM_IMPRESSIONS_SEARCH, {
                items: pages[currentPage], filters
            });
        } else {
            Event.dispatch(EVENT_GTM_IMPRESSIONS_PLP, {
                items: pages[currentPage], filters, category
            });
        }
    }
}

export default withRouter(ProductListContainer);
