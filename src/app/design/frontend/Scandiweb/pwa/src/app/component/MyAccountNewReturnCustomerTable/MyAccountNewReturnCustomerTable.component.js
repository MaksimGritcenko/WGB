import MyAccountCustomerTable from 'Component/MyAccountCustomerTable/MyAccountCustomerTable.component';

export default class MyAccountNewReturnCustomerTable extends MyAccountCustomerTable {
    render() {
        return (
            <div block="MyAccountCustomerTable">
                { this.renderTable() }
            </div>
        );
    }
}
