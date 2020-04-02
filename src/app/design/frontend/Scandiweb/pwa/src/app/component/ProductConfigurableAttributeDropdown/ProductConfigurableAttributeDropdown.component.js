// eslint-disable-next-line max-len
import SourceProductConfigurableAttributeDropdown from 'SourceComponent/ProductConfigurableAttributeDropdown/ProductConfigurableAttributeDropdown.component';
import Field from 'Component/Field';

import './ProductConfigurableAttributeDropdown.style.override';

export default class ProductConfigurableAttributeDropdown extends SourceProductConfigurableAttributeDropdown {
    render() {
        const {
            selectOptions,
            selectValue,
            selectName,
            onChange
        } = this.props;

        return (
            <Field
              id={ selectName }
              name={ selectName }
              type="select"
              placeholder=" "
              mix={ { block: 'ProductConfigurableAttributeDropdown' } }
              selectOptions={ selectOptions }
              value={ selectValue }
              onChange={ onChange }
            />
        );
    }
}
