import { PureComponent } from 'react';
import Field from 'Component/Field';

import './MyAccountReturnDetailsRating.style';

export default class MyAccountReturnDetailsRating extends PureComponent {
    renderStar = (_, index) => {
        const { selectedIndex, setSelectedIndex, isInputDisabled } = this.props;

        const isChecked = selectedIndex !== null && index >= selectedIndex;

        return (
            <button
              block="MyAccountReturnDetailsRating"
              elem="Star"
              mods={ { isChecked, enabled: !isInputDisabled } }
              onClick={ () => setSelectedIndex(index) }
              disabled={ isInputDisabled }
            />
        )
    }

    renderStars() {
        return (
            <div
              block="MyAccountReturnDetailsRating"
              elem="Stars"
            >
                { Array.from({ length: 5 }, this.renderStar) }
            </div>
        )
    }

    renderActions() {
        const { textValue, setTextValue, submitRating, isInputDisabled } = this.props;

        return (
            <div
              block="MyAccountReturnDetailsRating"
              elem="ActionWrapper"
            >
                <Field
                  id="message"
                  name="message"
                  type="text"
                  placeholder="You can also leave a comment"
                  mix={ { block: 'MyAccountReturnDetailsRating', elem: 'CommentField' } }
                  value={ textValue }
                  onChange={ setTextValue }
                  isDisabled={ isInputDisabled }
                />
                <button
                  block="Button"
                  onClick={ submitRating }
                  disabled={ isInputDisabled }
                >
                    { __('SUBMIT REVIEW') }
                </button>
            </div>
        )
    }

    componentDidMount() {
        const {
            rating,
            setSelectedIndex,
            setTextValue
        } = this.props;

        if (rating.stars) {
            setSelectedIndex(5 - rating.stars);
            setTextValue(rating.comment);
        }
    }

    componentDidUpdate() {
        const { rating, disableInput } = this.props;
        if (rating.stars) {
            disableInput();
        }
    }

    render() {
        return (
            <div
              block="MyAccountReturnDetailsRating"
              elem="MainWrapper"
            >
                <h4
                  block="MyAccountReturnDetailsRating"
                  elem="Title"
                >
                    How do you rate the work of a manager?
                </h4>
                { this.renderStars() }
                { this.renderActions() }
            </div>
        );
    }
}
