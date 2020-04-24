import PropTypes from 'prop-types';
import Field from 'Component/Field';
import CartItemPrice from 'Component/CartItemPrice';
import { closeIcon } from 'Component/Header/Header.config';
import Loader from 'Component/Loader';

import SourceCartItem from 'SourceComponent/CartItem/CartItem.component';
import './CartItem.style.override';

export default class CartItem extends SourceCartItem {
    static propTypes = {
        ...this.propTypes,
        isNotEditing: PropTypes.bool,
        isReturnRulesShowed: PropTypes.bool
    };

    static defaultProps = {
        ...this.defaultProps,
        isNotEditing: false,
        isReturnRulesShowed: false
    };

    renderDeleteButton() {
        const { handleRemoveItem, isLikeTable, isNotEditing } = this.props;

        if (isNotEditing) return null;

        return (
            <button
              block="CartItem"
              id="RemoveItem"
              name="RemoveItem"
              elem="MobileDelete"
              mods={ { isLikeTable } }
              aria-label="Remove item from cart"
              onClick={ handleRemoveItem }
            >
                { closeIcon }
            </button>
        );
    }

    renderQty() {
        const {
            item: { qty },
            minSaleQuantity,
            maxSaleQuantity,
            handleChangeQuantity,
            isLikeTable,
            isNotEditing
        } = this.props;

        if (isNotEditing) return null;

        return (
            <div
              block="CartItem"
              elem="QtyWrapper"
              mods={ { isLikeTable } }
            >
                <span
                  block="CartItem"
                  elem="QtyTitle"
                >
                    Quantity:
                </span>
                <Field
                  id="item_qty"
                  name="item_qty"
                  type="number"
                  isControlled
                  min={ minSaleQuantity }
                  max={ maxSaleQuantity }
                  mix={ { block: 'CartItem', elem: 'Qty' } }
                  value={ qty }
                  onChange={ handleChangeQuantity }
                />
            </div>
        );
    }

    renderReturnRule = ({ resolution: { title }, value }, index) => (
        <span
          block="CartItem"
          elem="ReturnRule"
          key={ index }
        >
            <span
              block="CartItem"
              elem="ReturnRuleTitle"
            >
                { `${ title } period: ` }
            </span>
            { value }
        </span>
    );

    renderReturnRules(isMobile = false) {
        const { item: { product: { return_resolutions } }, isReturnRulesShowed } = this.props;

        if (!isReturnRulesShowed) return null;

        return (
            <div
              block="CartItem"
              elem="ReturnRuleWrapper"
              mods={ { isMobile } }
            >
                { return_resolutions.map(this.renderReturnRule) }
            </div>
        );
    }


    renderConfiguration() {
        const {
            item: {
                product: {
                    configurable_options,
                    variants
                }
            },
            isLikeTable,
            getCurrentProduct
        } = this.props;

        if (!variants || !configurable_options) return null;

        const product = getCurrentProduct() || {};
        const { attributes = [] } = product;

        const optionMap = Object.entries(attributes).reduce((acc, [key, item]) => {
            if (Object.keys(configurable_options).includes(key)) {
                acc.push(item);

                return acc;
            }

            return acc;
        }, []);
        const optionLength = optionMap.length;

        return (
            <ul
              block="CartItem"
              elem="Options"
              mods={ { isLikeTable } }
            >
                { optionMap.map(({ attribute_code, attribute_value }, index) => (
                    <li
                      key={ attribute_code }
                      aria-label={ attribute_code }
                      block="CartItem"
                      elem="Option"
                    >
                        { `${
                            configurable_options[attribute_code].attribute_options[attribute_value].label
                        }${ index === optionLength - 1 ? '' : ',' }` }
                    </li>
                )) }
            </ul>
        );
    }

    renderProductDetails() {
        const {
            isLikeTable,
            currency_code,
            item: {
                row_total,
                product: {
                    name
                }
            }
        } = this.props;

        return (
            <>
                <p
                  block="CartItem"
                  elem="Heading"
                  itemProp="name"
                >
                    { name }
                </p>
                { this.renderConfiguration() }
                { this.renderQty() }
                <CartItemPrice
                  row_total={ row_total }
                  currency_code={ currency_code }
                  mix={ {
                      block: 'CartItem',
                      elem: 'Price',
                      mods: { isLikeTable }
                  } }
                />
                { this.renderReturnRules() }
            </>
        );
    }

    renderContent() {
        const { isLikeTable } = this.props;

        return (
            <figure
              block="CartItem"
              elem="Wrapper"
              mods={ { isLikeTable } }
            >
                { this.renderImage() }
                <figcaption
                  block="CartItem"
                  elem="Content"
                  mods={ { isLikeTable } }
                >
                    { this.renderProductDetails() }
                </figcaption>
            </figure>
        );
    }

    renderActions() {
        const {
            isEditing,
            isLikeTable,
            item: { qty },
            minSaleQuantity,
            maxSaleQuantity,
            handleRemoveItem,
            handleChangeQuantity
        } = this.props;

        return (
            <div
              block="CartItem"
              elem="Actions"
              mods={ { isEditing, isLikeTable } }
            >
                <button
                  block="CartItem"
                  id="RemoveItem"
                  name="RemoveItem"
                  elem="Delete"
                  aria-label="Remove item from cart"
                  onClick={ handleRemoveItem }
                >
                    <span>{ __('Delete') }</span>
                </button>
                <Field
                  id="item_qty"
                  name="item_qty"
                  type="number"
                  isControlled
                  min={ minSaleQuantity }
                  max={ maxSaleQuantity }
                  mix={ {
                      block: 'CartItem',
                      elem: 'Qty',
                      mods: { isLikeTable }
                  } }
                  value={ qty }
                  onChange={ handleChangeQuantity }
                />
            </div>
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <li
              block="CartItem"
            >
                <Loader isLoading={ isLoading } />
                { this.renderDeleteButton() }
                { this.renderContent() }
                { this.renderActions() }
                { this.renderReturnRules(true) }
            </li>
        );
    }
}
