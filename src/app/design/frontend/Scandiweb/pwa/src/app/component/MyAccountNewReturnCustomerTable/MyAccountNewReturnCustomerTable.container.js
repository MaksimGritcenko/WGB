import { connect } from 'react-redux';

import MyAccountNewReturnCustomerTable from './MyAccountNewReturnCustomerTable.component';

export const mapStateToProps = state => ({
    customer: state.MyAccountReducer.customer
});

export default connect(mapStateToProps)(MyAccountNewReturnCustomerTable);
