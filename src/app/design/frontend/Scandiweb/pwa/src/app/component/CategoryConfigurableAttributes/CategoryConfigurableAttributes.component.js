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

import ProductAttributeValue from 'Component/ProductAttributeValue';
// eslint-disable-next-line max-len
import SourceCategoryConfigurableAttributes from 'SourceComponent/CategoryConfigurableAttributes/CategoryConfigurableAttributes.component';

class CategoryConfigurableAttributes extends SourceCategoryConfigurableAttributes {
    renderConfigurableAttributeValue(attribute) {
        const {
            getIsConfigurableAttributeAvailable,
            handleOptionClick,
            getLink,
            isSelected
        } = this.props;

        const { attribute_value } = attribute;

        return (
            <ProductAttributeValue
              key={ attribute_value }
              attribute={ attribute }
              isSelected={ isSelected(attribute) }
              isAvailable={ getIsConfigurableAttributeAvailable(attribute) }
              onClick={ handleOptionClick }
              getLink={ getLink }
              isFormattedAsLink
            />
        );
    }
}

export default CategoryConfigurableAttributes;
