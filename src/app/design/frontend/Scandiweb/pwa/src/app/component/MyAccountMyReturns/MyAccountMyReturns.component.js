import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountMyReturnsDropdown from 'Component/MyAccountMyReturnsDropdown';
import './MyAccountMyReturns.style';

class MyAccountMyReturns extends PureComponent {
    static propTypes = {
        handleReturnClick: PropTypes.func.isRequired
    };

    render() {
        const { handleReturnClick } = this.props;

        return (
            <div block="MyAccountMyReturns">
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
}

export default MyAccountMyReturns;
