import { PureComponent } from 'react';
import { ordersType } from 'Type/Account';
import MyAccountMyReturnsDropdown from './MyAccountMyReturnsDropdown.component';

export const PENDING_STATUS = 'PENDING';
export const COMPLETE_STATUS = 'COMPLETE';

export class MyAccountMyReturnsDropdownContainer extends PureComponent {
    static propTypes = {
        orderList: ordersType.isRequired
    };

    containerProps = () => ({
        selectOptions: this._getSelectOptions()
    });

    _getSelectOptions() {
        const { orderList } = this.props;

        return orderList.reduce(
            (list, order) => {
                const {
                    base_order_info: {
                        id,
                        created_at,
                        grand_total,
                        status_label
                    }
                } = order;

                // Handle pending orders
                if (status_label.toUpperCase() !== COMPLETE_STATUS) {
                    return list;
                }

                list.push({
                    id,
                    value: id,
                    label: `Order #${id} - ${created_at} - ${grand_total}`
                });

                return list;
            }, []
        );
    }

    render() {
        return (
            <MyAccountMyReturnsDropdown
              { ...this.props }
              { ...this.containerProps() }
            />
        );
    }
}

export default MyAccountMyReturnsDropdownContainer;
