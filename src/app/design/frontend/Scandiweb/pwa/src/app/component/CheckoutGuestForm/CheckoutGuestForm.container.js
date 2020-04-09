import { connect } from 'react-redux';

import {
    CheckoutGuestFormContainer as SourceCheckoutGuestFormContainer,
    mapStateToProps,
    mapDispatchToProps
} from 'SourceComponent/CheckoutGuestForm/CheckoutGuestForm.container';

import CheckoutGuestForm from './CheckoutGuestForm.component';

export class CheckoutGuestFormContainer extends SourceCheckoutGuestFormContainer {
    render() {
        const { isSignedIn, isGuestEmailSaved } = this.props;
        if (isSignedIn || isGuestEmailSaved) return null;

        return (
            <CheckoutGuestForm
              { ...this.props }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutGuestFormContainer);
