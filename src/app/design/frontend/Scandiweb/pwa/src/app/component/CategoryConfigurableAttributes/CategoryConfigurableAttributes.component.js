/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import CategoryProductAttributeValue from 'Component/CategoryProductAttributeValue';
import CategoryExpandableContent from 'Component/CategoryExpandableContent';
// eslint-disable-next-line max-len
import SourceCategoryConfigurableAttributes from 'SourceComponent/CategoryConfigurableAttributes/CategoryConfigurableAttributes.component';
import './CategoryConfigurableAttributes.style.scss';

export const VIEW_MORE_ITEMS_LIMIT = 3;

class CategoryConfigurableAttributes extends SourceCategoryConfigurableAttributes {
    state = {};

    toggleIsOpen = (id) => {
        this.setState(state => ({ [id]: id in state ? !state[id] : true }));
    };

    renderSwatch(option, id) {
        const { attribute_values } = option;

        const isLong = attribute_values.length > VIEW_MORE_ITEMS_LIMIT;
        const isOpen = this.state[id] || false;

        const text = isOpen ? __('View less') : __('View more');

        return (
            <div
              block="CategoryConfigurableAttributes"
              elem="SwatchList"
              mods={ { isLong } }
            >
                { attribute_values.map((attribute_value, i) => {
                    const mix = isLong && i >= VIEW_MORE_ITEMS_LIMIT
                        ? { block: 'CategoryProductAttributeValue', mods: { isOpen, isClosed: !isOpen } }
                        : {};

                    return this.renderConfigurableAttributeValue({ ...option, attribute_value, mix });
                }) }
                <button
                  block="CategoryConfigurableAttributes"
                  elem="SwatchList-More"
                  mods={ { isOpen } }
                  onClick={ () => this.toggleIsOpen(id) }
                >
                    { text }
                </button>
            </div>
        );
    }

    renderDropdown(option) {
        const { attribute_values } = option;

        return (
            <div
              block="CategoryConfigurableAttributes"
              elem="DropDownList"
            >
                { attribute_values.map(attribute_value => (
                    this.renderConfigurableAttributeValue({ ...option, attribute_value })
                )) }
            </div>
        );
    }

    renderConfigurableAttributes() {
        const {
            configurable_options,
            isContentExpanded,
            getSubHeading
        } = this.props;

        return Object.values(configurable_options).map((option, id) => {
            const {
                attribute_label,
                attribute_code,
                attribute_options
            } = option;

            const [{ swatch_data }] = Object.values(attribute_options) || [{}];
            const isSwatch = !!swatch_data;

            return (
                <CategoryExpandableContent
                  key={ attribute_code }
                  heading={ attribute_label }
                  subHeading={ getSubHeading(option) }
                  mix={ {
                      block: 'CategoryConfigurableAttributes',
                      elem: 'Expandable'
                  } }
                  isContentExpanded={ isContentExpanded }
                >
                    { isSwatch ? this.renderSwatch(option, id) : this.renderDropdown(option) }
                </CategoryExpandableContent>
            );
        });
    }

    renderConfigurableAttributeValue(attribute) {
        const {
            getIsConfigurableAttributeAvailable,
            handleOptionClick,
            getLink,
            isSelected
        } = this.props;

        const { attribute_value, mix } = attribute;

        return (
            <CategoryProductAttributeValue
              key={ attribute_value }
              attribute={ attribute }
              isSelected={ isSelected(attribute) }
              isAvailable={ getIsConfigurableAttributeAvailable(attribute) }
              onClick={ handleOptionClick }
              getLink={ getLink }
              mix={ mix }
              isFormattedAsLink
            />
        );
    }

    render() {
        const { isReady, mix } = this.props;

        return (
            <div block="CategoryConfigurableAttributes" mix={ mix }>
                { isReady ? this.renderConfigurableAttributes() : this.renderPlaceholders() }
            </div>
        );
    }
}

export default CategoryConfigurableAttributes;
