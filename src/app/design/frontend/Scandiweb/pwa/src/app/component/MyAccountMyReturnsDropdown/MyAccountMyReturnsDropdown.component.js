import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './MyAccountMyReturnsDropdown.style';
import Field from 'Component/Field';

class MyAccountMyReturnsDropdown extends PureComponent {
    state = {};

    static propTypes = {
        selectOptions: PropTypes.array,
        setChosenOrderId: PropTypes.func.isRequired,
        onSelectChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        selectOptions: []
    };

    onDropdownChange = (value) => {
        const { setChosenOrderId, onSelectChange } = this.props;

        this.setState(
            () => ({
                selectValue: value,
                selectValueText: this.getSelectValueText(value)
            }),
            () => setChosenOrderId(value)
        );
        onSelectChange(value);
    };

    getSelectValueText(value) {
        const { selectOptions } = this.props;
        const foundOption = selectOptions.filter(option => option.value === value)[0];

        return foundOption.label;
    }

    render() {
        const { selectOptions } = this.props;
        const { selectValue, selectValueText } = this.state;

        return (
            <Field
              id="order-to-return"
              name="order-to-return"
              type="select"
              placeholder={ selectValueText || __('Select order') }
              mix={ { block: 'MyAccountMyReturnsDropdown' } }
              selectOptions={ selectOptions }
              selectValue={ selectValue }
              validation={ ['notEmpty'] }
              onChange={ this.onDropdownChange }
            />
        );
    }
}

export default MyAccountMyReturnsDropdown;
