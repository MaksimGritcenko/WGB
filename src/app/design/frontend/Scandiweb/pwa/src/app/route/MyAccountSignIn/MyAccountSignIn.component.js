import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { FAVORITES } from 'Component/Header';
import MyAccountOverlay from 'Component/MyAccountOverlay';

import './MyAccountSignIn.style';

class MyAccountSignIn extends PureComponent {
    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.updateBreadcrumbs();
        this.updateHeaderMod();
    }

    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const breadcrumbs = [
            {
                url: '/MyAccount/SignIn',
                name: __('Sign In')
            },
            {
                url: '/',
                name: __('Home')
            }
        ];

        updateBreadcrumbs(breadcrumbs);
    }

    updateHeaderMod() {
        const { setHeaderState } = this.props;

        setHeaderState({
            name: FAVORITES
        });
    }

    render() {
        return (
            <div block="SignInPage">
            <MyAccountOverlay />
            </div>
        );
    }
}

export default MyAccountSignIn;
