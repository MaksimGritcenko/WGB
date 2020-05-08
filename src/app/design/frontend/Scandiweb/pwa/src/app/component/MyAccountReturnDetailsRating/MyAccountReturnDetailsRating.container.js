import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { showNotification } from 'Store/Notification';
import { fetchMutation } from 'Util/Request';
import { ProductReturnQuery } from 'Query/';
import MyAccountReturnDetailsRating from './MyAccountReturnDetailsRating.component';

const mapDispatchToProps = dispatch => ({
    showNotification: (type, title, e) => dispatch(showNotification(type, title, e))
});

export class MyAccountReturnDetailsRatingContainer extends PureComponent {
    static propTypes = {
        showNotification: PropTypes.func.isRequired
    }

    state = {
        isInputDisabled: false,
        selectedIndex: null,
        textValue: "",
        hidden: false
    }

    containerFunctions = {
        setSelectedIndex: this.setSelectedIndex.bind(this),
        setTextValue: this.setTextValue.bind(this),
        submitRating: this.submitRating.bind(this),
        disableInput: this.disableInput.bind(this)
    };

    setSelectedIndex(selectedIndex) {
        this.setState(() => ({ selectedIndex }));
    }

    setTextValue(textValue) {
        this.setState(() => ({ textValue }));
    }

    disableInput() {
        this.setState({
            isInputDisabled: true
        });
    }

    submitRating() {
        const { request_id, showNotification } = this.props;
        const { selectedIndex, textValue } = this.state;

        const input = {
            request_id,
            rating: {
                stars: 5 - selectedIndex,
                comment: textValue
            }
        };

        this.disableInput();
        fetchMutation(ProductReturnQuery.giveRatingForRequest(input))
            .then(({ giveRatingForRequest: { success } }) => {
                if (!success) throw 'Not successful';
                showNotification('success', 'Review successfully submitted');
                this.setState(() => ({ hidden: true }));
            })
            .catch(err => {
                showNotification('error', 'Error submitting review!', err);
            });
    }

    render() {
        const { rating } = this.props;
        const { hidden } = this.state;

        if (hidden) {
            return null;
        }

        return (
            <MyAccountReturnDetailsRating
              { ...this.containerFunctions }
              { ...this.state }
              rating={ rating }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(MyAccountReturnDetailsRatingContainer);