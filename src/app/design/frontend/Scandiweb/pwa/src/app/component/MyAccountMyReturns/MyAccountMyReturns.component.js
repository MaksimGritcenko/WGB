import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountMyReturnsDropdown from 'Component/MyAccountMyReturnsDropdown';
import './MyAccountMyReturns.style';

class MyAccountMyReturns extends PureComponent {
    static propTypes = {
        handleReturnClick: PropTypes.func.isRequired
    };

    renderNew() {
        const { handleReturnClick } = this.props;

        return (
            <div block="MyAccountMyReturns" elem="New">
                <MyAccountMyReturnsDropdown
                  { ...this.props }
                />
                <button
                  block="Button"
                  onClick={ handleReturnClick }
                >
                  { __('Return') }
                </button>
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
