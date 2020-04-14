import DataContainer from 'Util/Request/DataContainer';
import { connect } from 'react-redux';
import StoreFinderQuery from 'Query/StoreFinder.query';
import { updateMeta } from 'Store/Meta';
import { changeNavigationState } from 'Store/Navigation';
import { showNotification } from 'Store/Notification';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { BreadcrumbsDispatcher } from 'Store/Breadcrumbs';
import PropTypes from 'prop-types';
import StoreFinder from './StoreFinder.component';

export const mapDispatchToProps = dispatch => ({
    showNotification: (type, title, e) => dispatch(showNotification(type, title, e)),
    updateMeta: meta => dispatch(updateMeta(meta)),
    setHeaderState: stateName => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    updateBreadcrumbs: (breadcrumbs) => {
        BreadcrumbsDispatcher.update(breadcrumbs, dispatch);
    }
});

export class StoreFinderContainer extends DataContainer {
    static propTypes = {
        updateMeta: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired
    };

    state = {
        StoreInfo: [{
            store_name: 'Store Name is not provided',
            address: 'Address is not provided',
            city: 'City is not provided',
            phone_number: 'Phone is not provided',
            store_hours: 'Hours are not provided',
            working_days: 'Working days are not provided',
            image_1: 'WGB1.jpg',
            image_2: 'WGB1.jpg',
            image_3: 'WGB1.jpg'
        }]
    };

    componentDidMount() {
        const { updateMeta } = this.props;

        updateMeta({ title: __('Stores') });
        this.requestStores();
    }

    requestStores() {
        const { showNotification } = this.props;

        this.fetchData(
            [StoreFinderQuery.getQuery()],
            ({ StoreInfo }) => this.setState({ StoreInfo }),
            e => showNotification('error', 'Error fetching Store Info!', e)
        );
    }

    render() {
        return (
            <StoreFinder
              { ...this.props }
              { ...this.state }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(StoreFinderContainer);
