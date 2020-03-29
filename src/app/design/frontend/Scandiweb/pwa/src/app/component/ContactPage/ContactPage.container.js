import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showNotification } from 'Store/Notification';
import { ContactInfoQuery } from 'Query';
import DataContainer from 'Util/Request/DataContainer';
import ContactPage from './ContactPage.component';


export const mapStateToProps = state => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = dispatch => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class ContactPageContainer extends DataContainer {
    static propTypes = {
        // TODO: implement prop-types
    };

    state = {
        ContactInfo: {
            store_phone: 'Not Defined',
            store_email: 'Not Defined',
            store_working_hours: 'Not Defined'
        }
    };

    componentDidMount() {
        this.requestContactInfo();
    }

    requestContactInfo() {
        this.fetchData(
            [ContactInfoQuery.getContactInfoQuery()],
            ({ ContactInfo }) => this.setState({ ContactInfo }),
            e => console.log('Error')
        );
    }

    render() {
        return (
            <ContactPage
              { ...this.state }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactPageContainer);
