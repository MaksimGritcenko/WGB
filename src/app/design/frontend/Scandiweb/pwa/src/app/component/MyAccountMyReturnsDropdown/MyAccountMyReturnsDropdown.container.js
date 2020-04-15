import { PureComponent } from 'react';
import { ordersType } from 'Type/Account';
import MyAccountMyReturnsDropdown from './MyAccountMyReturnsDropdown.component';

export class MyAccountMyReturnsDropdownContainer extends PureComponent {
    static propTypes = {
        orderList: ordersType.isRequired
    };

    containerProps = {
        selectOptions: this._getSelectOptions()
    };

    _getSelectOptions() {
        const { orderList } = this.props;

        return orderList.map(
            (order) => {
                const { base_order_info: { id, created_at, grand_total } } = order;

                return {
                    id,
                    value: id,
                    label: `Order #${id} - ${created_at} - ${grand_total}`
                };
            }
        );
    }

    render() {
        return (
            <MyAccountMyReturnsDropdown
              { ...this.props }
              { ...this.containerProps }
            />
        );
    }
}

export default MyAccountMyReturnsDropdownContainer;
