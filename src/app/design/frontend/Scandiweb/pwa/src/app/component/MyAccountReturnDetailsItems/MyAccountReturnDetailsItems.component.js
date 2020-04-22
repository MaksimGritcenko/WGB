import PropTypes from 'prop-types';
import MyAccountNewReturnItemSelect
    from 'Component/MyAccountNewReturnItemSelect/MyAccountNewReturnItemSelect.component';

import './MyAccountReturnDetailsItems.style';

export default class MyAccountReturnDetailsItems extends MyAccountNewReturnItemSelect {
    static propTypes = {
        items: PropTypes.func.isRequired,
        onItemChange: PropTypes.func.isRequired,
        reasonData: PropTypes.object.isRequired
    };

    renderItemDetails(name, qty) {
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
                <span>{ `Qty: ${ qty }` }</span>
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

    renderStatusBlock({ status }) {
        return (
            <span
              block="MyAccountReturnDetailsItems"
              elem="ReasonBlockStatus"
            >
                { `Item Status: ${ status }` }
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
        const { product, product: { name }, qty } = item;

        return (
            <figure block="CartItem" elem="Wrapper">
                { this.renderImage(product) }
                <figcaption
                  block="CartItem"
                  elem="Content"
                >
                    { this.renderItemDetails(name, qty) }
                    { this.renderReasonBlock(item) }
                    { this.renderStatusBlock(item) }
                </figcaption>
            </figure>
        );
    }

    renderItem = item => (
        <div
          block="MyAccountNewReturnItemSelect"
          elem="ItemWrapper"
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
