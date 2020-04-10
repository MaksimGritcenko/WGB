import { connect } from 'react-redux';
import { mapStateToProps } from 'SourceComponent/CheckoutAddressForm/CheckoutAddressForm.container';
import CheckoutAddressForm from './CheckoutAddressForm.component';

export default connect(mapStateToProps)(CheckoutAddressForm);
