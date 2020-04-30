/* eslint-disable no-restricted-globals */
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

import { roundPrice } from 'Util/Price';
import GoogleTagManager, { EVENT_GENERAL } from 'Component/GoogleTagManager/GoogleTagManager.component';

export const NOT_APPLICABLE = 'N/A';

/**
 * Product helper, contain all related to product data prepare methods
 */
export default class Product {
    static DEFAULT_BRAND = 'Vagabond';

    /**
     * Get product listing category string
     *
     * @param product
     * @return {string|string}
     */
    // eslint-disable-next-line no-unused-vars
    static getList() {
        const meta = GoogleTagManager.getEvent(EVENT_GENERAL).currentMeta.metaObject || {};

        return meta.name
            || meta.title
            || document.title.split('|').pop()
            || '';
    }

    /**
     * Get product Quantity from product object
     *
     * @param product
     * @return {number|string}
     */
    static getQuantity({ qty }) {
        return parseInt(qty, 10) || 0;
    }

    /**
     * Get product brand from product object
     *
     * @param product
     * @return {string|string}
     */
    static getBrand(selectedVariant) {
        const { attributes = {} } = selectedVariant;
        const { brand: { attribute_value = '' } = {} } = attributes;
        return attribute_value;
    }

    static getSelectedVariant(product) {
        const { sku, variants } = product;
        return variants.find(({ sku: variantSku }) => sku === variantSku);
    }

    static getSelectedVariantIndex(product, sku) {
        const { variants = [] } = product;
        return variants.findIndex(({ sku: variantSku = '' }) => sku === variantSku);
    }

    /**
     * Get product sku
     *
     * @param product
     * @return {string}
     */
    static getSku(product) {
        const { variants = [], configurableVariantIndex = -1 } = product;
        const { sku = '' } = variants[configurableVariantIndex] || product;
        return sku;
    }

    /**
     * Get item data as object
     *
     * @param product
     *
     * @return {{quantity: number, price: number, name: string, variant: string, id: string, availability: boolean, list: string, category: string, brand: string}}
     */
    static getItemData(item, isVariantPassed = false) {
        if (item && Object.values(item).length) {
            const { product = {}, sku = '' } = item;
            const configurableVariantIndex = this.getSelectedVariantIndex(product, sku);

            return this.getProductData({ ...product, configurableVariantIndex }, isVariantPassed);
        }

        return {};
    }

    static getCategory(categories = []) {
        const { url_path = '' } = categories.slice(-1)[0] || {};
        return url_path;
    }

    /**
     * varian: color
     * dimension1: size
     * dimension2: simple/grouped
     * dimension3: variantSKU
     * metric1: total for grouped product
     */

    static getVariantSku(sku, variantSku, isVariantPassed) {
        return (variantSku === sku && !isVariantPassed)
            ? NOT_APPLICABLE
            : variantSku;
    }

    static getGroupedProductPrice(product) {
        return 0;
    }

    static getAttribute(variant, parentAttributes, attributeName) {
        const { attribute_value = '' } = variant.attributes[attributeName] || {};
        const { attribute_options = {} } = parentAttributes[attributeName] || {};
        const { label = NOT_APPLICABLE } = attribute_options[attribute_value] || {};

        return label || NOT_APPLICABLE;
    }

    /**
     * Get product data as object
     *
     * @param product
     *
     * @return {{quantity: number, price: number, name: string, variant: string, id: string, availability: boolean, list: string, category: string, brand: string}}
     */
    static getProductData(product, isVariantPassed = false) {
        const {
            sku,
            name,
            type_id,
            category = NOT_APPLICABLE,
            variants = [],
            categories = [],
            attributes = {},
            configurableVariantIndex = this.getSelectedVariantIndex(product, sku)
        } = product;
        const selectedVariant = variants[configurableVariantIndex] || product;
        const {
            sku: variantSku,
            price: {
                minimalPrice: {
                    amount: {
                        value: discountValue = null
                    } = {}
                } = {},
                regularPrice: {
                    amount: {
                        value = 0
                    } = {}
                } = {}
            } = {}
        } = selectedVariant;

        return {
            id: sku,
            name,
            price: +roundPrice(discountValue || value) || 0,
            brand: this.getBrand(selectedVariant) || this.DEFAULT_BRAND,
            category: this.getCategory(categories) || category,
            variant: this.getAttribute(selectedVariant, attributes, 'color_vgb'),
            dimension1: this.getAttribute(selectedVariant, attributes, 'size_vgb'),
            dimension2: type_id,
            dimension3: this.getVariantSku(sku, variantSku, isVariantPassed),
            metric1: this.getGroupedProductPrice(product)
        };
    }
}
