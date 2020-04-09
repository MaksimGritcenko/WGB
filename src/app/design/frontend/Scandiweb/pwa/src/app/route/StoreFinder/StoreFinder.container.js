import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DataContainer from 'Util/Request/DataContainer';

import { connect } from 'react-redux';

import StoreFinderQuery from 'Query/StoreFinder.query'

import StoreFinder from './StoreFinder.component';

export const mapStateToProps = state => ({

});

export const mapDispatchToProps = dispatch => ({

});

export class StoreFinderContainer extends DataContainer {
    static propTypes = {
        // TODO: implement prop-types
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
        // getData: this.getData.bind(this)
    };

    containerProps = () => {
        // isDisabled: this._getIsDisabled()
    }

    componentDidMount() {
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
