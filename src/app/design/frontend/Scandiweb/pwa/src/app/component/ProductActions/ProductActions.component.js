import SourceProductActions from 'SourceComponent/ProductActions/ProductActions.component';
import ProductAttributeValue from 'Component/ProductAttributeValue';
import isMobile from 'Util/Mobile';
import { GROUPED } from 'Util/Product';

import './ProductActions.style.override';

export default class ProductActions extends SourceProductActions {
    renderBrand() {
        const { product_list_content: { attribute_to_display } = {} } = window.contentConfiguration || {};
        const attributeToShow = this.getAttribute(attribute_to_display || 'size');
        const contentToShow = attributeToShow
            ? (
                <ProductAttributeValue
                  mix={ { block: 'ProductActions', elem: 'Brand' } }
                  attribute={ attributeToShow }
                  isFormattedAsText
                />
            ) : <br />;

        return contentToShow;
    }

    getAttribute(code) {
        const { product: { attributes: parentAttributes = {} } } = this.props;
        const { productOrVariant: { attributes = {} } } = this.props;
        const { attribute_options = {} } = parentAttributes[code] || {};

        if (attributes[code]) {
            return {
                ...attributes[code],
                attribute_options
            };
        }

        return null;
    }

    renderNameAndPrice() {
        const {
            product: {
                name,
                type_id
            }
        } = this.props;

        if (type_id === GROUPED) return null;

        return (
            <div block="ProductActions" elem="NameAndPrice">
                <p block="ProductActions" elem="Name">{ name }</p>
                { this.renderPriceWithSchema() }
            </div>
        );
    }

    renderMobile() {
        return (
            <>
                { this.renderBrand() }
                { this.renderNameAndPrice() }
            </>
        );
    }

    render() {
        return (
            <article block="ProductActions">
                { isMobile.any() ? this.renderBrand() : null }
                { this.renderNameAndPrice() }
                { this.renderShortDescription() }
                <div block="ProductActions" elem="AddToCartWrapper">
                    { this.renderAddToCart() }
                    { this.renderProductWishlistButton() }
                </div>
                { this.renderReviews() }
                { this.renderConfigurableAttributes() }
                { this.renderGroupedItems() }
                { this.renderTierPrices() }
            </article>
        );
    }
}
