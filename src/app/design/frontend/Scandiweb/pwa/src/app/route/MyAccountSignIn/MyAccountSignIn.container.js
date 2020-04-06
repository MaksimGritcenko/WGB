import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showNotification } from 'Store/Notification';
import { PureComponent } from 'react';
import { BreadcrumbsDispatcher } from 'Store/Breadcrumbs';
import { updateMeta } from 'Store/Meta';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { changeNavigationState } from 'Store/Navigation';
import MyAccountSignIn from 'Route/MyAccountSignIn/MyAccountSignIn.component';

export const mapDispatchToProps = dispatch => ({
    showNotification: (type, title, e) => dispatch(showNotification(type, title, e)),
    updateMeta: meta => dispatch(updateMeta(meta)),
    setHeaderState: stateName => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    updateBreadcrumbs: (breadcrumbs) => {
        BreadcrumbsDispatcher.update(breadcrumbs, dispatch);
    }
});

export class MyAccountSignInContainer extends PureComponent {
    static propTypes = {
        updateMeta: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { updateMeta } = this.props;

        updateMeta({ title: __('MyAccount SignIn') });
    }

    render() {
        return (
            <MyAccountSignIn
              { ...this.state }
              { ...this.props }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(MyAccountSignInContainer);
