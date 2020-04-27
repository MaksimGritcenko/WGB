import PropTypes from 'prop-types';
import MyAccountNewReturnItemSelect
    from 'Component/MyAccountNewReturnItemSelect/MyAccountNewReturnItemSelect.component';

import './MyAccountReturnDetailsItems.style';

export default class MyAccountReturnDetailsItems extends MyAccountNewReturnItemSelect {
    static propTypes = {
        items: PropTypes.array.isRequired
    };

    renderItemDetails(name, qty, chosen_attributes) {
        return (
            <div
              block="MyAccountReturnDetailsItems"
              elem="ItemDetails"
            >
                <p
                  block="CartItem"
                  elem="Heading"
                  itemProp="name"
                >
                    { name }
                </p>
                <p>{ `Qty: ${ qty }` }</p>
                { chosen_attributes.map(attr => {
                    return <p>{ attr.label }: { attr.value }</p>
                }) }
            </div>
        );
    }

    renderReasonItem(title, value) {
        return (
            <div>
                <span
                  block="MyAccountReturnDetailsItems"
                  elem="ReasonItemTitle"
                >
                    { `${ title } ` }
                </span>
                <span>{ value }</span>
            </div>
        );
    }

    renderStatusBlock(state_label) {
        return (
            <span
              block="MyAccountReturnDetailsItems"
              elem="ReasonBlockStatus"
            >
                { `Item Status: ${ state_label }` }
            </span>
        );
    }

    renderReasonBlock(item) {
        const {
            reason: { title: reasonTitle },
            resolution: { title: resolutionTitle },
            condition: { title: conditionTitle }
        } = item;

        return (
            <div
              block="MyAccountReturnDetailsItems"
              elem="ReasonBlock"
            >
                { this.renderReasonItem('Return Reason:', reasonTitle) }
                { this.renderReasonItem('Items Condition:', conditionTitle) }
                { this.renderReasonItem('Return Resolution:', resolutionTitle) }
                <span
                  block="MyAccountReturnDetailsItems"
                  elem="ReasonBlockPayer"
                >
                    Store pays for Shipping.
                </span>
            </div>
        );
    }

    renderItemInfo(item) {
        const {
            product,
            qty,
            chosen_attributes,
            name,
            status: { state_label }
        } = item;

        return (
            <figure block="CartItem" elem="Wrapper">
                { this.renderImage(product) }
                <figcaption
                  block="CartItem"
                  elem="Content"
                >
                    { this.renderItemDetails(name, qty, chosen_attributes) }
                    { this.renderReasonBlock(item) }
                    { this.renderStatusBlock(state_label) }
                </figcaption>
            </figure>
        );
    }

    renderItem = (item, index) => (
        <div
          block="MyAccountNewReturnItemSelect"
          elem="ItemWrapper"
          key={ index }
        >
            { this.renderItemInfo(item) }
        </div>
    );

    renderTitle() {
        return (
            <h4
              block="MyAccountNewReturnItemSelect"
              elem="Title"
            >
                Items
            </h4>
        );
    }

    render() {
        return (
            <div
              block="MyAccountNewReturnItemSelect"
              mix={ {
                  block: 'MyAccountReturnDetailsItems'
              } }
            >
                { this.renderTitle() }
                { this.renderItems() }
            </div>
        );
    }
}
