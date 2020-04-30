import { PureComponent } from 'react';
import Field from 'Component/Field';

import './MyAccountReturnDetailsRating.style';

export default class MyAccountReturnDetailsRating extends PureComponent {
    state = {
        selectedIndex: null
    }

    handleStarRatingClick = (selectedIndex) => {
        this.setState({ selectedIndex });
    }

    renderStar = (_, index) => {
        const { selectedIndex } = this.state;

        const isChecked = selectedIndex !== null && index >= selectedIndex;

        return (
            <button
              key={ index }
              block="MyAccountReturnDetailsRating"
              elem="Star"
              mods={ { isChecked } }
              onClick={ () => this.handleStarRatingClick(index) }
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
                //   value={  }
                //   onChange={  }
                />
                <button
                  block="Button"
                  //   onClick={  }
                  disabled={ false }
                >
                    { __('SUBMIT REVIEW') }
                </button>
            </div>
        )
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
