import { connect } from 'react-redux';

import {
    CartPageContainer as SourceCartPageContainer,
    mapStateToProps as sourceMapStateToProps,
    mapDispatchToProps
} from 'SourceRoute/CartPage/CartPage.container';

import CartPage from './CartPage.component';

export const mapStateToProps = state => ({
    ...sourceMapStateToProps(state),
    guest_checkout: state.ConfigReducer.guest_checkout,
    isSignedIn: state.MyAccountReducer.isSignedIn
});

export class CartPageContainer extends SourceCartPageContainer {
    state = { isEditing: true };

    render() {
        return (
            <CartPage
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPageContainer);
