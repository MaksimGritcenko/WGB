/* eslint-disable no-magic-numbers */

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

import PropTypes from 'prop-types';
import Field from 'Component/Field/Field.component';
import { HERO_ATTRIBUTE } from 'Component/ProductCard/ProductCard.component';
import './CategoryProductAttributeValue.style';
import ProductAttributeValue from 'Component/ProductAttributeValue/ProductAttributeValue.component';

export default class CategoryProductAttributeValue extends ProductAttributeValue {
    static propTypes = {
        ...this.propTypes,
        isFormattedAsLink: PropTypes.bool
    };

    static defaultProps = {
        ...this.defaultProps,
        isFormattedAsText: false
    };

    renderSelectAttribute() {
        const { attribute: { attribute_value } } = this.props;
        const attributeOption = this.getOptionLabel(attribute_value);
        const { label, swatch_data } = attributeOption;

        if (!swatch_data) return this.renderStringValue(label || __('N/A'));

        const { value, type } = swatch_data;

        switch (type) {
        case '0':
            return this.renderStringValue(value, label);
        case '1':
            return this.renderColorValue(value, label);
        case '2':
            return this.renderImageValue(value, label);
        default:
            return this.renderStringValue(label || __('N/A'));
        }
    }

    renderPlaceholder() {
        return HERO_ATTRIBUTE;
    }

    renderColorValue(color, label) {
        const {
            isFormattedAsLink,
            isFormattedAsText,
            isSelected
        } = this.props;
        const isLight = this.getIsColorLight(color);

        if (isFormattedAsText) return label || __('N/A');

        if (isFormattedAsLink) return this.renderStringValue(label, label);

        return (
            <data
              block="CategoryProductAttributeValue"
              elem="Color"
              value={ label }
              title={ label }
              style={ {
                  '--option-background-color': color,
                  '--option-border-color': isLight ? '#000' : color,
                  '--option-check-mark-background': isLight ? '#000' : '#fff',
                  '--option-is-selected': +isSelected
              } }
            />
        );
    }

    renderImageValue(img, label) {
        const {
            isFormattedAsLink,
            isFormattedAsText,
            isSelected
        } = this.props;

        if (isFormattedAsText) return label || __('N/A');

        if (isFormattedAsLink) return this.renderStringValue(label, label);

        return (
            <>
                <img
                  block="CategoryProductAttributeValue"
                  elem="Image"
                  src={ `/media/attribute/swatch${img}` }
                  alt={ label }
                />
                <data
                  block="CategoryProductAttributeValue"
                  elem="Image-Overlay"
                  value={ label }
                  title={ label }
                  style={ {
                      '--option-is-selected': +isSelected
                  } }
                />
            </>
        );
    }

    renderDropdown(value) {
        const { isSelected } = this.props;

        return (
            <Field
              id={ value }
              name={ value }
              type="checkbox"
              label={ value }
              value={ value }
              mix={ {
                  block: 'CategoryProductAttributeValue',
                  elem: 'Text',
                  mods: { isSelected }
              } }
              checked={ isSelected }
            />
        );
    }

    renderStringValue(value, label) {
        const { isFormattedAsText, isSelected } = this.props;
        const isSwatch = label;

        if (isFormattedAsText) return label || value || __('N/A');

        if (!isSwatch) return this.renderDropdown(value);

        return (
            <span
              block="CategoryProductAttributeValue"
              elem="String"
              mods={ { isSelected } }
              title={ label }
            >
                { value }
            </span>
        );
    }

    renderAttributeByType() {
        const { attribute: { attribute_type } } = this.props;

        switch (attribute_type) {
        case 'select':
            return this.renderSelectAttribute();
        case 'boolean':
            return this.renderBooleanAttribute();
        case 'text':
            return this.renderTextAttribute();
        case 'multiselect':
            return this.renderMultiSelectAttribute();
        default:
            return this.renderPlaceholder();
        }
    }

    render() {
        const {
            getLink,
            attribute,
            isAvailable,
            attribute: { attribute_code, attribute_value },
            mix,
            isFormattedAsText
        } = this.props;

        if (attribute_code && !attribute_value) return HERO_ATTRIBUTE;

        const href = getLink(attribute);
        // Invert to apply css rule without using not()
        const isNotAvailable = !isAvailable;

        if (isFormattedAsText) {
            return (
                <div
                  block="CategoryProductAttributeValue"
                  mix={ mix }
                >
                    { this.renderAttributeByType() }
                </div>
            );
        }

        return (
            <a
              href={ href }
              block="CategoryProductAttributeValue"
              mods={ { isNotAvailable } }
              onClick={ this.clickHandler }
              aria-hidden={ isNotAvailable }
              mix={ mix }
            >
                { this.renderAttributeByType() }
            </a>
        );
    }
}
