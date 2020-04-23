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
        createdAt: PropTypes.string.isRequired
    };

    state = {
        selectedItems: {}
    };

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

    isItemExpared(returnResolutions) {
        const { createdAt } = this.props;
        const createdAtDate = new Date(createdAt);

        const { value: returnPeriod } = returnResolutions.find(
            ({ resolution: { title } }) => title === 'Return'
        );

        if (createdAtDate.setDate(createdAtDate.getDate() + returnPeriod) > new Date() || returnPeriod === 0) return true;

        return false;
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

    renderReasonBlockSelect(title, data, id) {
        const { hasError } = this.props;
        const { selectedItems: { [id]: item } } = this.state;
        const [key, options] = data;
        const value = item[key] || '';

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
                  message={ hasError && !value && 'Select field!' }
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

    renderReasonBlockRules() {
        const { contactData: { phone_number, email } } = this.props;

        return (
            <>
                <span
                  block="MyAccountNewReturnItemSelect"
                  elem="ReasonBlockRuleTitle"
                >
                    The return for this product can’t be processed.
                    The return period expired.
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

    renderReasonBlockInputs(id, qty, qty_returning) {
        const { reasonData } = this.props;

        const data = Object.entries(reasonData);

        return (
            <>
                { this.renderReasonBlockQty(id, qty - qty_returning) }
                { this.renderReasonBlockSelect('Return Reason', data[0], id) }
                { this.renderReasonBlockSelect('Item Condition', data[1], id) }
                { this.renderReasonBlockSelect('Return Resolution', data[2], id) }
            </>
        );
    }

    renderReasonBlock(item, id, isChecked, isDisabled) {
        const { qty, qty_returning } = item;

        if (!isChecked && !isDisabled) return null;

        return (
            <div
              block="MyAccountNewReturnItemSelect"
              elem="ReasonBlockWrapper"
              mods={ { isRulesBlock: isDisabled } }
            >
                { isDisabled
                    ? this.renderReasonBlockRules()
                    : this.renderReasonBlockInputs(id, qty, qty_returning) }
            </div>
        );
    }

    renderItemField(item, id, isChecked, isDisabled) {
        return (
            <Field
              id={ id }
              name={ id }
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
        const { quote_item_id, return_resolutions } = item;

        const id = parseInt(quote_item_id, 10);
        const isChecked = !!selectedItems[id];
        const isDisabled = this.isItemExpared(return_resolutions);

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
