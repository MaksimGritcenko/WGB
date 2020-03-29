import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showNotification } from 'Store/Notification';
import { ContactInfoQuery } from 'Query';
import DataContainer from 'Util/Request/DataContainer';
import { BreadcrumbsDispatcher } from 'Store/Breadcrumbs';
import { updateMeta } from 'Store/Meta';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { changeNavigationState } from 'Store/Navigation';
import ContactPage from './ContactPage.component';

export const mapStateToProps = state => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = dispatch => ({
    updateMeta: meta => dispatch(updateMeta(meta)),
    setHeaderState: stateName => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    updateBreadcrumbs: (breadcrumbs) => {
        BreadcrumbsDispatcher.update(breadcrumbs, dispatch);
    }
});

export class ContactPageContainer extends DataContainer {
    static propTypes = {
        updateMeta: PropTypes.func.isRequired
    };

    state = {
        ContactInfo: {
            store_phone: 'Not Defined',
            store_email: 'Not Defined',
            store_working_hours: 'Not Defined'
        }
    };

    componentDidMount() {
        const { updateMeta } = this.props;

        updateMeta({ title: __('Contact Us') });
        this.requestContactInfo();
    }

    requestContactInfo() {
        this.fetchData(
            [ContactInfoQuery.getContactInfoQuery()],
            ({ ContactInfo }) => this.setState({ ContactInfo }),
            e => console.log(e)
        );
    }

    render() {
        return (
            <ContactPage
              { ...this.state }
              { ...this.props }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactPageContainer);
