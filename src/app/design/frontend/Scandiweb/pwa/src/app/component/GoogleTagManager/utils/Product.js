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
import { convertKeyValuesToQueryString } from 'Util/Url';
import GoogleTagManager, { EVENT_GENERAL } from 'Component/GoogleTagManager/GoogleTagManager.component';

/**
 * Product helper, contain all related to product data prepare methods
 */
class Product {
    static DEFAULT_BRAND = 'Vagabond';

    /**
     * Get product listing category string
     *
     * @param product
     * @return {string|string}
     */
    // eslint-disable-next-line no-unused-vars
    static getList(product) {
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
            category = '',
            variants = [],
            categories = [],
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
                        value = ''
                    } = {}
                } = {}
            } = {}
        } = selectedVariant;

        return {
            id: sku,
            name,
            price: +roundPrice(discountValue || value) || '',
            brand: this.getBrand(selectedVariant) || this.DEFAULT_BRAND,
            category: this.getCategory(categories) || category,
            variant: (variantSku === sku && !isVariantPassed)
                ? 'N/A'
                : variantSku
        };
    }
}

export default Product;
