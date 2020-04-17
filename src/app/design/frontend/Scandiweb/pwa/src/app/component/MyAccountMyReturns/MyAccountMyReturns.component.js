import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountMyReturnsDropdown from 'Component/MyAccountMyReturnsDropdown';
import './MyAccountMyReturns.style';

class MyAccountMyReturns extends PureComponent {
    static propTypes = {
        handleReturnClick: PropTypes.func.isRequired,
        handleDropdownChange: PropTypes.func.isRequired
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
                <MyAccountMyReturnsDropdown
                  { ...this.props }
                  onSelectChange={ this.handleDropdownChange }
                />
                <button
                  block="Button"
                  onClick={ this.handleReturnClick }
                >
                  { __('Return') }
                </button>
            </div>
        );
    }

    renderList() {
        return (
            <div>
                <h4>Return list</h4>
            </div>
        );
    }

    render() {
        return (
            <div block="MyAccountMyReturns">
                { this.renderNew() }
                { this.renderList() }
            </div>
        );
    }
}

export default MyAccountMyReturns;
