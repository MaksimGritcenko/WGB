import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Image from 'Component/Image';
import Field from 'Component/Field';

import './MyAccountNewReturnItemSelect.style';

export default class MyAccountNewReturnItemSelect extends PureComponent {
    static propTypes = {
        items: PropTypes.array.isRequired,
        onItemChange: PropTypes.func.isRequired,
        reasonData: PropTypes.object.isRequired
    };

    state = {
        selectedItems: {}
    };

    handleItemSelect = (isChecked, id) => {
        const { onItemChange } = this.props;
        const { selectedItems: items } = this.state;
        const selectedItems = { ...items };

        if (isChecked) {
            delete selectedItems[id];
        } else {
            selectedItems[id] = { quote_item_id: id };
        }

        this.setState({ selectedItems });
        onItemChange(selectedItems);
    };

    handleReasonBlockSelect(blockId, key, id) {
        const { selectedItems, selectedItems: { [id]: selectedItem } } = this.state;

        this.setState({
            selectedItems: {
                ...selectedItems,
                [id]: {
                    ...selectedItem,
                    [key]: blockId
                }
            }
        });
    }

    handleQtyChange(qty, id) {
        const { selectedItems, selectedItems: { [id]: selectedItem } } = this.state;

        this.setState({
            selectedItems: {
                ...selectedItems,
                [id]: {
                    ...selectedItem,
                    qty
                }
            }
        });
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
                  selectOptions={ options }
                  value={ value }
                  onChange={ blockId => this.handleReasonBlockSelect(blockId, key, id) }
                />
            </div>
        );
    }

    renderReasonBlockQty(id, orderedQty) {
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
                  max={ orderedQty }
                  value={ qty }
                  onChange={ qty => this.handleQtyChange(qty, id) }
                />
                <span>{ ` / ${ orderedQty }` }</span>
            </div>
        );
    }

    renderReasonBlock({ qty }, isChecked, id) {
        if (!isChecked) return null;

        const { reasonData } = this.props;

        const data = Object.entries(reasonData);

        return (
            <div
              block="MyAccountNewReturnItemSelect"
              elem="ReasonBlockWrapper"
            >
                { this.renderReasonBlockQty(id, qty) }
                { this.renderReasonBlockSelect('Return Reason', data[0], id) }
                { this.renderReasonBlockSelect('Item Condition', data[1], id) }
                { this.renderReasonBlockSelect('Return Resolution', data[2], id) }
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

        const isChecked = !!selectedItems[id];

        return (
            <div
              block="MyAccountNewReturnItemSelect"
              elem="ItemWrapper"
              key={ index }
            >
                { this.renderItemField(item, id, isChecked) }
                { this.renderReasonBlock(item, isChecked, id) }
            </div>
        );
    };

    renderItems() {
        const { items } = this.props;

        if (!items.length) return <h3>Loading</h3>;

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
