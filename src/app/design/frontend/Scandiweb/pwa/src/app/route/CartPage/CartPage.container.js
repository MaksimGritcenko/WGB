import { connect } from 'react-redux';

import {
    CartPageContainer as SourceCartPageContainer,
    mapStateToProps,
    mapDispatchToProps
} from 'SourceRoute/CartPage/CartPage.container';

import CartPage from './CartPage.component';

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
