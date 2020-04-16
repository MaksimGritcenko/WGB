import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Image from 'Component/Image';
import Field from 'Component/Field';

import './MyAccountNewReturnItemSelect.style';

export default class MyAccountNewReturnItemSelect extends PureComponent {
    static propTypes = {
        items: PropTypes.array.isRequired,
        onItemChange: PropTypes.func.isRequired
    };

    state = {
        selectedItems: []
    };

    handleItemSelect = (isChecked, id) => {
        const { onItemChange } = this.props;
        const { selectedItems: items } = this.state;
        const selectedItems = Array.from(items);

        if (isChecked) {
            const itemIndex = selectedItems.findIndex(itemId => itemId === id);

            selectedItems.splice(itemIndex, 1);
        } else {
            selectedItems.push(id);
        }

        this.setState({ selectedItems });
        onItemChange(selectedItems);
    };

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

    renderReasonBlockSelect(title) {
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
                  selectOptions={ [
                      { label: '1', value: '1' },
                      { label: '2', value: '2' },
                      { label: '3', value: '3' }
                  ] }
                  value={ '' }
                //   onChange={ onChange }
                />
            </div>
        );
    }

    renderReasonBlockQty() {
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
                  max={ 99 }
                  value={ 1 }
                //   onChange={ handleChangeQuantity }
                />
                <span>{ ` / ${ 5 }` }</span>
            </div>
        );
    }

    renderReasonBlock(isChecked) {
        if (!isChecked) return null;

        return (
            <div
              block="MyAccountNewReturnItemSelect"
              elem="ReasonBlockWrapper"
            >
                { this.renderReasonBlockQty() }
                { this.renderReasonBlockSelect('Return Reason') }
                { this.renderReasonBlockSelect('Item Condition') }
                { this.renderReasonBlockSelect('Return Resolution') }
            </div>
        );
    }

    renderItemField(item, id, isChecked) {
        return (
            <Field
              id={ id }
              name={ id }
              value={ id }
              type="checkbox"
              mix={ {
                  block: 'MyAccountNewReturnItemSelect',
                  elem: 'ItemField'
              } }
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
              onChange={ () => this.handleItemSelect(isChecked, id) }
            />
        );
    }

    renderItem = (item, index) => {
        const { selectedItems } = this.state;
        const { id: prevId } = item;
        const id = `${ prevId }_${ index }`;

        const isChecked = !!selectedItems.find(itemId => itemId === id);

        return (
            <div
              block="MyAccountNewReturnItemSelect"
              elem="ItemWrapper"
            >
                { this.renderItemField(item, id, isChecked) }
                { this.renderReasonBlock(isChecked) }
            </div>
        );
    };

    renderItems() {
        const { items } = this.props;

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
