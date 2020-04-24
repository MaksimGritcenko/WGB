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
import { Field } from 'Util/Query';

/**
 * Product List Query
 * @class ProductListQuery
 */
export class ProductListQuery extends SourceProductListQuery {
    _getResolutionFields() {
        return [
            'resolution_id',
            'title',
            'position',
            'label'
        ];
    }

    _getResolutionField() {
        return new Field('resolution')
            .addFieldList(this._getResolutionFields());
    }

    _getProductReturnResolutionsFields() {
        return [
            this._getResolutionField(),
            'value'
        ];
    }

    _getProductReturnResolutionsField() {
        return new Field('return_resolutions')
            .addFieldList(this._getProductReturnResolutionsFields());
    }

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
            this._getProductReturnResolutionsField(),
            ...(!isVariant
                ? [
                    'url_key',
                    this._getProdcutCategoriesField(),
                    this._getReviewSummaryField(),
                    this._getConfigurableProductFragment()
                ]
                : []
            ),
            ...(isForLinkedProducts
                ? [
                    this._getProductLinksField()
                ]
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
                    this._getReturnResolutions(),
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

    _getProdcutCategoriesField() {
        return new Field('categories')
            .addField('url_path');
    }

    _getReturnResolutions() {
        return new Field('return_resolutions')
            .addField(this._getResolution())
            .addField('value');
    }

    _getResolution() {
        return new Field('resolution')
            .addField('resolution_id')
            .addField('title')
            .addField('position')
            .addField('label');
    }

    _getProductFields() {
        const { requireInfo } = this.options;

        if (requireInfo) {
            return [
                'min_price',
                'max_price',
                this._getSortField(),
                this._getFiltersField()
            ];
        }

        return [
            'total_count',
            this._getItemsField(),
            this._getPageInfoField(),
            'is_show_rma_info_pdp'
        ];
    }
}

export default new ProductListQuery();
