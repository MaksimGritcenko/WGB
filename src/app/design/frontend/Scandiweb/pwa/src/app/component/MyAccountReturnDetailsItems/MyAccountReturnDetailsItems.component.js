import MyAccountNewReturnItemSelect
    from 'Component/MyAccountNewReturnItemSelect/MyAccountNewReturnItemSelect.component';

import './MyAccountReturnDetailsItems.style';

export default class MyAccountReturnDetailsItems extends MyAccountNewReturnItemSelect {
    renderItemDetails(item) {
        const { name, qty } = item;

        return (
            <div>
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

    renderReasonBlock() {
        return (
            <div
              block="MyAccountReturnDetailsItems"
              elem="ReasonBlock"
            >
                { this.renderReasonItem('Return Reason:', '<return reason>') }
                { this.renderReasonItem('Items Condition:', '<items condition>') }
                { this.renderReasonItem('Return Resolution:', '<return resolution>') }
                <span
                  block="MyAccountReturnDetailsItems"
                  elem="ReasonBlockStatus"
                >
                    { '<Item Status>' }
                </span>
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
        return (
            <figure block="CartItem" elem="Wrapper">
                { this.renderImage(item) }
                <figcaption
                  block="CartItem"
                  elem="Content"
                >
                    { this.renderItemDetails(item) }
                    { this.renderReasonBlock() }
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
