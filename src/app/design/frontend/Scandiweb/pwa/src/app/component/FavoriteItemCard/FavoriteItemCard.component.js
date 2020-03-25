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

import { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import Image from 'Component/Image';
import Loader from 'Component/Loader';
import { ProductType } from 'Type/ProductList';
import ProductPrice from 'Component/ProductPrice';
import TextPlaceholder from 'Component/TextPlaceholder';
import ProductAttributeValue from 'Component/ProductAttributeValue';

import './FavoriteItemCard.style';

/**
 * Product card
 * @class FavoriteItemCard
 */
export default class FavoriteItemCard extends PureComponent {
    static propTypes = {
        product: ProductType.isRequired,
        productOrVariant: ProductType.isRequired,
        thumbnail: PropTypes.string,
        availableVisualOptions: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
        })).isRequired,
        getAttribute: PropTypes.func.isRequired,
        registerSharedElement: PropTypes.func.isRequired,
        children: PropTypes.element,
        isLoading: PropTypes.bool,
        mix: PropTypes.shape({})
    };

    static defaultProps = {
        thumbnail: '',
        children: null,
        isLoading: false,
        mix: {}
    };

    imageRef = createRef();

    registerSharedElement = () => {
        const { registerSharedElement } = this.props;
        registerSharedElement(this.imageRef);
    };

    renderProductPrice() {
        const { productOrVariant: { price } } = this.props;
        if (!price) return <TextPlaceholder />;

        return (
            <ProductPrice
              price={ price }
              mix={ { block: 'FavoriteItemCard', elem: 'Price' } }
            />
        );
    }

    renderVisualConfigurableOptions() {
        const { availableVisualOptions } = this.props;

        return (
            <div block="FavoriteItemCard" elem="ConfigurableOptions">
                { availableVisualOptions.map(({ value, label }) => (
                    <span
                      block="FavoriteItemCard"
                      elem="Color"
                      key={ value }
                      style={ { backgroundColor: value } }
                      aria-label={ label }
                    />
                )) }
            </div>
        );
    }

    renderPicture() {
        const { product: { id, name }, thumbnail } = this.props;

        this.sharedComponent = (
            <Image
              imageRef={ this.imageRef }
              src={ thumbnail }
              alt={ name }
              ratio="custom"
              mix={ { block: 'FavoriteItemCard', elem: 'Picture' } }
              isPlaceholder={ !id }
            />
        );

        return (
            <>
                { this.sharedComponent }
                <img
                  style={ { display: 'none' } }
                  alt={ name }
                  src={ thumbnail }
                  itemProp="image"
                />
            </>
        );
    }

    renderAdditionalProductDetails() {
        const { product: { sku }, getAttribute } = this.props;
        const { product_list_content: { attribute_to_display } = {} } = window.contentConfiguration;
        const brand = getAttribute(attribute_to_display || 'brand') || {};

        if (sku && !brand) return null;

        return (
            <div
              block="FavoriteItemCard"
              elem="Brand"
              mods={ { isLoaded: !!brand } }
              itemProp="brand"
            >
                <ProductAttributeValue
                  attribute={ brand }
                  isFormattedAsText
                />
            </div>
        );
    }

    renderMainDetails() {
        const { product: { name } } = this.props;

        return (
            <p
              block="FavoriteItemCard"
              elem="Name"
              mods={ { isLoaded: !!name } }
              itemProp="name"
            >
                <TextPlaceholder content={ name } length="medium" />
            </p>
        );
    }

    render() {
        const {
            product: { sku },
            children,
            mix,
            isLoading
        } = this.props;

        return (
            <li
              block="FavoriteItemCard"
              itemScope
              itemType={ sku && 'https://schema.org/Product' }
              mix={ mix }
            >
                <Loader isLoading={ isLoading } />
                <meta itemProp="sku" content={ sku } />
                    <>
                        <figure block="FavoriteItemCard" elem="Figure">
                            { this.renderPicture() }
                        </figure>
                        <div block="FavoriteItemCard" elem="Content">
                            { this.renderVisualConfigurableOptions() }
                            <div block="FavoriteItemCard" elem="Info">
                                { this.renderMainDetails() }
                                { this.renderProductPrice() }
                            </div>
                            { this.renderAdditionalProductDetails() }
                            { children }
                        </div>
                    </>
            </li>
        );
    }
}
