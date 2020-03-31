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

import { ProductListQuery as SourceProductListQuery } from 'SourceQuery/ProductList.query';

/**
 * Product List Query
 * @class ProductListQuery
 */
export class ProductListQuery extends SourceProductListQuery {
    _getProductInterfaceFields(isVariant, isForLinkedProducts = false) {
        const { isSingleProduct } = this.options;

        return [
            'id',
            'sku',
            'name',
            'type_id',
            'stock_status',
            this._getPriceField(),
            this._getStockItemField(),
            this._getProductThumbnailField(),
            this._getProductSmallField(),
            this._getShortDescriptionField(),
            'special_from_date',
            'special_to_date',
            this._getAttributesField(isVariant),
            this._getTierPricesField(),
            ...(!isVariant
                ? [
                    'url_key',
                    this._getReviewSummaryField(),
                    this._getConfigurableProductFragment()
                ]
                : []
            ),
            ...(isForLinkedProducts
                ? [this._getProductLinksField()]
                : []
            ),
            ...(isSingleProduct
                ? [
                    'meta_title',
                    'meta_keyword',
                    'canonical_url',
                    'meta_description',
                    this._getDescriptionField(),
                    this._getMediaGalleryField(),
                    this._getSimpleProductFragment(),
                    this._getProductLinksField(),
                    ...(!isVariant
                        ? [
                            this._getCategoriesField(),
                            this._getReviewsField(),
                            this._getVirtualProductFragment()
                        ]
                        : []
                    )
                ]
                : []
            )
        ];
    }
}

export default new ProductListQuery();
