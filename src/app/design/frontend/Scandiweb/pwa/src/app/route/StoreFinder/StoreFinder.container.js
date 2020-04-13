import DataContainer from 'Util/Request/DataContainer';
import { connect } from 'react-redux';
import StoreFinderQuery from 'Query/StoreFinder.query'
import StoreFinder from './StoreFinder.component';
import {updateMeta} from "Store/Meta";
import {changeNavigationState} from "Store/Navigation";
import {TOP_NAVIGATION_TYPE} from "Store/Navigation/Navigation.reducer";
import {BreadcrumbsDispatcher} from "Store/Breadcrumbs";
import PropTypes from "prop-types";

export const mapStateToProps = state => ({

});

export const mapDispatchToProps = dispatch => ({
    updateMeta: meta => dispatch(updateMeta(meta)),
    setHeaderState: stateName => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    updateBreadcrumbs: (breadcrumbs) => {
        BreadcrumbsDispatcher.update(breadcrumbs, dispatch);
    }
});

export class StoreFinderContainer extends DataContainer {
    static propTypes = {
        updateMeta: PropTypes.func.isRequired,
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

    containerFunctions = {
    };

    containerProps = () => {
        // isDisabled: this._getIsDisabled()
    }

    componentDidMount() {
        const { updateMeta } = this.props;

        updateMeta({ title: __('Stores') });
        this.requestStores();
    }

    requestStores() {
        this.fetchData(
            [StoreFinderQuery.getQuery()],
            ({ StoreInfo }) => this.setState({ StoreInfo }),
            e => console.log(e)
        );
    }



    render() {
        return (
            <StoreFinder
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreFinderContainer);
