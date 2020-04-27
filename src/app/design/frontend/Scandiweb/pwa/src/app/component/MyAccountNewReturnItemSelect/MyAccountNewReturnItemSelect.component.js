import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Image from 'Component/Image';
import Field from 'Component/Field';
import TextPlaceholder from 'Component/TextPlaceholder';

import './MyAccountNewReturnItemSelect.style';

export default class MyAccountNewReturnItemSelect extends PureComponent {
    static propTypes = {
        items: PropTypes.array.isRequired,
        onItemChange: PropTypes.func.isRequired,
        reasonData: PropTypes.object.isRequired,
        hasError: PropTypes.bool.isRequired,
        contactData: PropTypes.object.isRequired,
        shippingCover: PropTypes.object.isRequired
    };

    state = {
        selectedItems: {}
    };

    getPayer(payerId) {
        switch (payerId) {
        case 0:
            return 'You are supposed to cover shipping costs';
        case 1:
            return 'The Store is supposed to cover shipping costs';
        default:
            return null;
        }
    }

    handleItemSelect = (isChecked, id, isDisabled) => {
        const { onItemChange, reasonData } = this.props;
        const { selectedItems: items } = this.state;
        const selectedItems = { ...items };

        if (isDisabled) return;

        if (isChecked) {
            delete selectedItems[id];
        } else {
            selectedItems[id] = {
                quote_item_id: id,
                ...Object.keys(reasonData).reduce((acc, key) => ({ ...acc, [key]: '' }), {}),
                qty: 0
            };
        }

        this.setState({ selectedItems });
        onItemChange(selectedItems);
    };

    handleReasonBlockSelect(blockId, key, id) {
        const { onItemChange } = this.props;
        const {
            selectedItems: items,
            selectedItems: { [id]: selectedItem }
        } = this.state;

        const selectedItems = {
            ...items,
            [id]: {
                ...selectedItem,
                [key]: blockId
            }
        };

        this.setState({ selectedItems });
        onItemChange(selectedItems);
    }

    handleQtyChange(qty, id) {
        const { onItemChange } = this.props;
        const {
            selectedItems: items,
            selectedItems: { [id]: selectedItem }
        } = this.state;

        const selectedItems = {
            ...items,
            [id]: {
                ...selectedItem,
                qty
            }
        };

        this.setState({ selectedItems });
        onItemChange(selectedItems);
    }

    renderImage({ name, thumbnail: { url: thumbnailUrl }, small_image: { url: small_imageUrl } }) {
        return (
            <>
                <Image
                  src={ thumbnailUrl }
                  mix={ {
                      block: 'CartItem',
                      elem: 'Picture'
                  } }
                  ratio="custom"
                  alt={ `Product ${ name } thumbnail.` }
                />
                <img
                  style={ { display: 'none' } }
                  alt={ name }
                  src={ small_imageUrl }
                  itemProp="image"
                />
            </>
        );
    }

    renderItemDetails(item) {
        const { name } = item;

        return (
            <>
                <p
                  block="CartItem"
                  elem="Heading"
                  itemProp="name"
                >
                    { name }
                </p>
            </>
        );
    }

    renderReasonBlockSelect(title, options, key, id) {
        const { hasError } = this.props;
        const { selectedItems: { [id]: item } } = this.state;
        const value = item[key] || '';

        const message = (hasError && !value && 'Select field!') || '';

        return (
            <div
              block="MyAccountNewReturnItemSelect"
              elem="SelectWrapper"
            >
                <span
                  block="MyAccountNewReturnItemSelect"
                  elem="SelectTitle"
                >
                    { title }
                </span>
                <Field
                  id={ title }
                  name={ title }
                  type="select"
                  placeholder={ __('Choose %s', title.toLowerCase()) }
                  mix={ {
                      block: 'MyAccountNewReturnItemSelect',
                      elem: 'SelectInput'
                  } }
                  message={ message }
                  selectOptions={ options }
                  value={ value }
                  onChange={ blockId => this.handleReasonBlockSelect(blockId, key, id) }
                />
            </div>
        );
    }

    renderReasonBlockQty(id, orderedQty) {
        const { hasError } = this.props;
        const { selectedItems: { [id]: { qty } } } = this.state;

        return (
            <div
              block="MyAccountNewReturnItemSelect"
              elem="QtyBlockWrapper"
            >
                <span>Return Qty: </span>
                <Field
                  id="item_qty"
                  name="item_qty"
                  type="number"
                  isControlled
                  min={ 0 }
                  message={ hasError && !qty && 'Chose qty!' }
                  max={ orderedQty }
                  value={ qty }
                  onChange={ qty => this.handleQtyChange(qty, id) }
                />
                <span>{ ` / ${ orderedQty }` }</span>
            </div>
        );
    }

    renderReasonBlockRules(noReturnableReasonLabel) {
        const { contactData: { phone_number, email } } = this.props;

        const title = noReturnableReasonLabel || 'The return for this product can’t be processed.';

        return (
            <>
                <span
                  block="MyAccountNewReturnItemSelect"
                  elem="ReasonBlockRuleTitle"
                >
                    { title }
                </span>
                <span
                  block="MyAccountNewReturnItemSelect"
                  elem="ReasonBlockRule"
                >
                    If you have questions, please contact the store administrator:
                </span>
                <span
                  block="MyAccountNewReturnItemSelect"
                  elem="ReasonBlockRule"
                >
                    { phone_number || 'No phone number' }
                </span>
                <span
                  block="MyAccountNewReturnItemSelect"
                  elem="ReasonBlockRule"
                >
                    { email || 'No email' }
                </span>
            </>
        );
    }

    renderShippingCover(id) {
        const { selectedItems: { [id]: { reason: reasonId } } } = this.state;

        if (!reasonId) return null;

        const { shippingCover } = this.props;

        const payerText = this.getPayer(shippingCover[reasonId]);

        if (!payerText) return null;

        return (
            <span
              block="MyAccountNewReturnItemSelect"
              elem="ShippingCover"
            >
                { payerText }
            </span>
        );
    }

    renderReasonBlockInputs(id, qty, qty_returning, { returnability: { resolutions } }) {
        const { reasonData: { reason, condition } } = this.props;

        const resolutionOptions = resolutions.map(({ resolution_id, label }) => ({ label, value: resolution_id }));

        return (
            <>
                { this.renderReasonBlockQty(id, qty - qty_returning) }
                { this.renderReasonBlockSelect('Return Reason', reason, 'reason', id) }
                { this.renderReasonBlockSelect('Item Condition', condition, 'condition', id) }
                { this.renderReasonBlockSelect('Return Resolution', resolutionOptions, 'resolution', id) }
                { this.renderShippingCover(id) }
            </>
        );
    }

    renderReasonBlock(item, id, isChecked, isDisabled) {
        const {
            qty,
            qty_returning,
            returnability: { no_returnable_reason_label }
        } = item;

        if (!isChecked && !isDisabled) return null;

        return (
            <div
              block="MyAccountNewReturnItemSelect"
              elem="ReasonBlockWrapper"
              mods={ { isRulesBlock: isDisabled } }
            >
                { isDisabled
                    ? this.renderReasonBlockRules(no_returnable_reason_label)
                    : this.renderReasonBlockInputs(id, qty, qty_returning, item) }
            </div>
        );
    }

    renderItemField(item, id, isChecked, isDisabled) {
        return (
            <Field
              id={ `${ id }` }
              name={ `${ id }` }
              value={ id }
              type="checkbox"
              mix={ {
                  block: 'MyAccountNewReturnItemSelect',
                  elem: 'ItemField',
                  mods: { isDisabled }
              } }
              isDisabled={ isDisabled }
              label={ (
                <figure block="CartItem" elem="Wrapper">
                    { this.renderImage(item) }
                    <figcaption
                      block="CartItem"
                      elem="Content"
                    >
                        { this.renderItemDetails(item) }
                    </figcaption>
                </figure>
              ) }
              checked={ isChecked }
              onChange={ () => this.handleItemSelect(isChecked, id, isDisabled) }
            />
        );
    }

    renderItem = (item, index) => {
        const { selectedItems } = this.state;
        const { quote_item_id, returnability: { is_returnable } } = item;

        const id = parseInt(quote_item_id, 10);
        const isChecked = !!selectedItems[id];
        const isDisabled = !is_returnable;

        return (
            <div
              block="MyAccountNewReturnItemSelect"
              elem="ItemWrapper"
              key={ index }
            >
                { this.renderItemField(item, id, isChecked, isDisabled) }
                { this.renderReasonBlock(item, id, isChecked, isDisabled) }
            </div>
        );
    };

    renderItems() {
        const { items } = this.props;

        if (!items.length) {
            return (
                <>
                    <TextPlaceholder
                      mix={ {
                          block: 'MyAccountNewReturnItemSelect',
                          elem: 'ItemImagePlaceholder'
                      } }
                    />
                    <TextPlaceholder />
                </>
            );
        }

        return (
            <div>
                { items.map((item, index) => this.renderItem(item, index)) }
            </div>
        );
    }

    renderTitle() {
        return (
            <h4
              block="MyAccountNewReturnItemSelect"
              elem="Title"
            >
                Choose Items:
            </h4>
        );
    }

    render() {
        return (
            <div block="MyAccountNewReturnItemSelect">
                { this.renderTitle() }
                { this.renderItems() }
            </div>
        );
    }
}
