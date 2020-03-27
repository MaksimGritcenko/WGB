import { PureComponent } from 'react';
import { connect } from 'react-redux';
import HomePage from './HomePage.component';

export const mapStateToProps = state => ({
    urlKey: state.ConfigReducer.cms_contact_page
});

export class HomePageContainer extends PureComponent {
    render() {
        return (
            <HomePage
              { ...this.props }
            />
        );
    }
}

export default connect(mapStateToProps)(HomePageContainer);
