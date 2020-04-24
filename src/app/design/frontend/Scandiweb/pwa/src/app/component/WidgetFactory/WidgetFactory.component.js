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
import HomeSlider from 'Component/SliderWidget';
import NewProducts from 'Component/NewProducts';
import ProductListWidget from 'Component/ProductListWidget';
import ShippingLabel from 'Component/ShippingLabel';

import PrintPageWidget from 'Component/PrintPageWidget';

import SourceWidgetFactory, {
    SLIDER,
    NEW_PRODUCTS,
    CATALOG_PRODUCT_LIST
} from 'SourceComponent/WidgetFactory/WidgetFactory.component';

export const SHIPPING_LABEL = 'ShippingLabelButton';
export const PRINT_SLIP = 'PackingSlipButton';

export default class WidgetFactory extends SourceWidgetFactory {
    static propTypes = {
        type: PropTypes.string.isRequired
    };

    renderMap = {
        [PRINT_SLIP]: {
            component: PrintPageWidget
        },
        [SHIPPING_LABEL]: {
            component: ShippingLabel
        },
        [SLIDER]: {
            component: HomeSlider
        },
        [NEW_PRODUCTS]: {
            component: NewProducts
        },
        [CATALOG_PRODUCT_LIST]: {
            component: ProductListWidget
        }
    };
}
