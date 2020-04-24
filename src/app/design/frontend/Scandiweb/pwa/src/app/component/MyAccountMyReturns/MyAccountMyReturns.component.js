import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountMyReturnsDropdown from 'Component/MyAccountMyReturnsDropdown';
import MyAccountReturnTableRow from 'Component/MyAccountReturnTableRow';
import isMobile from 'Util/Mobile';
import Loader from 'Component/Loader';
import './MyAccountMyReturns.style';

class MyAccountMyReturns extends PureComponent {
    static propTypes = {
        handleReturnClick: PropTypes.func.isRequired,
        handleReturnItemClick: PropTypes.func.isRequired,
        returnList: PropTypes.array.isRequired,
        areReturnsLoading: PropTypes.bool.isRequired,
        renderPageTitle: PropTypes.func.isRequired
    };

    state = {
        selectedOrderId: ''
    };

    handleDropdownChange = (id) => {
        this.setState({ selectedOrderId: id });
    };

    handleReturnClick = () => {
        const { handleReturnClick } = this.props;
        const { selectedOrderId } = this.state;

        handleReturnClick(selectedOrderId);
    };

    renderNew() {
        return (
            <div block="MyAccountMyReturns" elem="New">
                <p>Create new return request:</p>
                <div block="MyAccountMyReturns" elem="DropdownWrapper">
                    <MyAccountMyReturnsDropdown
                      { ...this.props }
                      onSelectChange={ this.handleDropdownChange }
                    />
                    <button
                      block="Button"
                      onClick={ this.handleReturnClick }
                      disabled={ !this.state.selectedOrderId }
                    >
                    { __('Return') }
                    </button>
                </div>
            </div>
        );
    }

    renderTable() {
        const { returnList, areReturnsLoading } = this.props;

        if (areReturnsLoading) {
            return null;
        }

        if (!areReturnsLoading && !returnList.length) {
            return this.renderNoReturns();
        }

        return (
            <table block="MyAccountMyOrders" elem="Table">
                <thead>
                    <tr>
                        <th>{ __('Order') }</th>
                        <th block="hidden-mobile">{ __('Qty') }</th>
                        <th block="hidden-mobile">{ __('ID') }</th>
                        <th>{ __('Date') }</th>
                        <th>{ __('Status') }</th>
                    </tr>
                </thead>
                <tbody>
                    { this.renderReturnsList() }
                </tbody>
            </table>
        );
    }

    renderReturnRow = (row) => {
        const { handleReturnItemClick } = this.props;
        const { request_id } = row;

        return (
            <MyAccountReturnTableRow
              key={ request_id }
              row={ row }
              onClick={ () => handleReturnItemClick(request_id) }
            />
        );
    };

    renderReturnsList() {
        const { returnList } = this.props;

        const returns = returnList.length
            ? returnList
            : Array.from({ length: 10 }, (_, id) => ({ base_order_info: { id } }));

        return returns.reduceRight(
            (acc, e) => [...acc, this.renderReturnRow(e)],
            []
        );
    }

    renderNoReturns() {
        return (
            <tr block="MyAccountMyReturns" elem="NoReturns">
                { /* eslint-disable-next-line no-magic-numbers */ }
                <td colSpan={ isMobile.any() ? 3 : 4 }>{ __('You have no returns.') }</td>
            </tr>
        );
    }

    render() {
        const { areReturnsLoading, renderPageTitle } = this.props;

        return (
            <div block="MyAccountMyReturns">
                { renderPageTitle() }
                <Loader isLoading={ areReturnsLoading } />
                { this.renderNew() }
                { this.renderTable() }
            </div>
        );
    }
}

export default MyAccountMyReturns;
