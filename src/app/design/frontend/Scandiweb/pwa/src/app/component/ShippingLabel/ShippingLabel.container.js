import DataContainer from 'Util/Request/DataContainer';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ProductReturnQuery } from 'Query';
import { history } from 'Route';
import ShippingLabel from './ShippingLabel.component';

const BASE_PATH = '/media/amasty/rma';
class ShippingLabelContainer extends DataContainer {
    static propTypes = {
        label: PropTypes.string
    };

    state = {
        details: {},
        url: '',
        id: 0
    };

    componentDidMount() {
        this.requestData();
    }

    componentDidUpdate() {
        const { details } = this.state;
        if (details.file) {
            this.buildLabelUrl(details.file);
        }
    }

    buildLabelUrl(filename) {
        const { id } = this.state;
        const path = `${BASE_PATH}/${id}/${filename}`;
        this.setState({ url: path });
    }

    requestData() {
        // eslint-disable-next-line prefer-destructuring
        const pathname = history.location.pathname;

        const returnId = pathname
            // eslint-disable-next-line no-magic-numbers
            .split('/')[3]
            .split('&')[1]
            .split('=')[1];

        this.setState({ id: returnId });

        this.fetchData(
            [ProductReturnQuery.getReturnDetails(returnId)],
            ({ getReturnDetailsById }) => this.setState({ details: getReturnDetailsById })
        );
    }

    render() {
        return (
            <ShippingLabel
              { ...this.props }
              { ...this.state }
            />
        );
    }
}
export default connect(null, null)(ShippingLabelContainer);
