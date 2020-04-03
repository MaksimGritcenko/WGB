import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ConditionalWrapper extends PureComponent {
    static propTypes = {
        condition: PropTypes.bool.isRequired,
        ifTrue: PropTypes.func.isRequired,
        ifFalse: PropTypes.func.isRequired,
        children: PropTypes.arrayOf(PropTypes.element).isRequired
    };

    render() {
        const {
            condition,
            ifTrue,
            ifFalse,
            children
        } = this.props;

        return condition ? ifTrue(children) : ifFalse(children);
    }
}

export default ConditionalWrapper;
