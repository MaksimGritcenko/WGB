/**
 * @category  Netnutri
 * @author    Rihards Stasans <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

import HomeSlider from 'Component/SliderWidget';
import NewProducts from 'Component/NewProducts';
import ProductListWidget from 'Component/ProductListWidget';
import ContactForm from 'Component/ContactForm';
import SourceWidgetFactory, {
    SLIDER, NEW_PRODUCTS, CATALOG_PRODUCT_LIST
} from 'SourceComponent/WidgetFactory/WidgetFactory.component';

export * from 'SourceComponent/WidgetFactory/WidgetFactory.component';
export const CONTACT_FORM = 'ContactForm';

export default class WidgetFactory extends SourceWidgetFactory {
    renderMap = {
        [SLIDER]: {
            component: HomeSlider
        },
        [NEW_PRODUCTS]: {
            component: NewProducts
        },
        [CATALOG_PRODUCT_LIST]: {
            component: ProductListWidget
        },
        [CONTACT_FORM]: {
            component: ContactForm
        }
    };
}
