import { customerType } from 'Type/Account';
import MyAccountCustomerTable from 'Component/MyAccountCustomerTable/MyAccountCustomerTable.component';

import './MyAccountNewReturnCustomerTable.style';

export default class MyAccountNewReturnCustomerTable extends MyAccountCustomerTable {
    static propTypes = {
        customer: customerType.isRequired
    };

    renderTitle() {
        return (
            <h4
              block="MyAccountNewReturnCustomerTable"
              elem="CustomerTableTitle"
            >
                My profile
            </h4>
        );
    }

    render() {
        return (
            <div
              block="MyAccountNewReturnCustomerTable"
              elem="MainWrapper"
            >
                { this.renderTitle() }
                { this.renderTable() }
            </div>
        );
    }
}
