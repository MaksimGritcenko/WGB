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

import CategoryProductList from 'Component/CategoryProductList';
import './CategoryPage.style';

import SourceCategoryPage from 'SourceRoute/CategoryPage/CategoryPage.component';

export default class CategoryPage extends SourceCategoryPage {
    renderCategoryProductList() {
        const {
            filter,
            search,
            category,
            selectedSort,
            selectedFilters,
            getIsNewCategory
        } = this.props;

        return (
            <div block="CategoryPage" elem="ProductListWrapper">
                { this.renderItemsCount(true) }
                <CategoryProductList
                  filter={ filter }
                  search={ search }
                  sort={ selectedSort }
                  category={ category }
                  selectedFilters={ selectedFilters }
                  getIsNewCategory={ getIsNewCategory }
                />
            </div>
        );
    }
}
