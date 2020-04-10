import SourceProductActions from 'SourceComponent/ProductActions/ProductActions.component';
import ProductAttributeValue from 'Component/ProductAttributeValue';
import ProductPrice from 'Component/ProductPrice';
import isMobile from 'Util/Mobile';
import { GROUPED } from 'Util/Product';

import './ProductActions.style.override';

export default class ProductActions extends SourceProductActions {
    renderBrand() {
        const { product_list_content: { attribute_to_display } = {} } = window.contentConfiguration || {};
        const attributeToShow = this.getAttribute(attribute_to_display || 'brand');
        const { attribute_value } = (attributeToShow || {});

        const contentToShow = attribute_value
            ? (
                <ProductAttributeValue
                  mix={ { block: 'ProductActions', elem: 'Brand' } }
                  attribute={ attributeToShow }
                  isFormattedAsText
                />
            ) : <br />;

        return contentToShow;
    }

    onProductError(ref) {
        if (!ref) return;
        const { current } = ref;

        current.classList.remove('animate');
        // eslint-disable-next-line no-unused-expressions
        current.offsetWidth; // trigger a DOM reflow
        current.classList.add('animate');
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

    renderPriceWithSchema() {
        const {
            product,
            product: { variants },
            configurableVariantIndex
        } = this.props;

        // Product in props is updated before ConfigurableVariantIndex in props, when page is opened by clicking CartItem
        // As a result, we have new product, but old configurableVariantIndex, which may be out of range for variants
        const productOrVariant = variants && variants[configurableVariantIndex] !== undefined
            ? variants[configurableVariantIndex]
            : product;

        const { name, price, stock_status } = productOrVariant;

        return (
            <div
              block="ProductActions"
              elem="Schema"
              itemType="https://schema.org/AggregateOffer"
              itemProp="offers"
              itemScope
            >
                { this.renderSchema(name, stock_status) }
                <ProductPrice
                  isSchemaRequired
                  price={ price }
                  mix={ { block: 'ProductActions', elem: 'Price' } }
                />
            </div>
        );
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
                <h1 block="ProductActions" elem="Name" itemProp="name">{ name }</h1>
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
                <meta itemProp="brand" content="Vagabond" />
                { isMobile.any() ? this.renderBrand() : null }
                { this.renderNameAndPrice() }
                { this.renderSkuAndStock() }
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
