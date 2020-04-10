// eslint-disable-next-line max-len
import SourceProductConfigurableAttributes from 'SourceComponent/ProductConfigurableAttributes/ProductConfigurableAttributes.component';

import './ProductConfigurableAttributes.style.override';

export default class ProductConfigurableAttributes extends SourceProductConfigurableAttributes {
    renderDropdownHeading(option) {
        const { attribute_label } = option;

        return (
            <p
              block="ProductConfigurableAttributes"
              mix={ { block: 'Attribute', elem: 'Name' } }
            >
                { attribute_label }
            </p>
        );
    }

    renderConfigurableAttributes() {
        const {
            configurable_options
        } = this.props;

        return Object.values(configurable_options).map(
            option => (
                <div block="ProductConfigurableAttributes" elem="Attribute" key={ option.attribute_label }>
                    { this.renderDropdownHeading(option) }
                    { this.renderDropdown(option) }
                </div>
            )
        );
    }
}
