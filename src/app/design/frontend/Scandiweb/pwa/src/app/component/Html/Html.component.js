/* eslint-disable consistent-return */
// Disabled due `domToReact` internal logic
import SourceHtml from 'SourceComponent/Html/Html.component';
import attributesToProps from 'html-react-parser/lib/attributes-to-props';
import Link from 'Component/Link';
import domToReact from 'html-react-parser/lib/dom-to-react';
import WidgetFactory from 'Component/WidgetFactory';

const AMASTY = 'am-print-shipping-label action primary';
const PRINT = 'window.print()';

export default class Html extends SourceHtml {
    replaceLinks({ attribs, children }) {
        const { href, onclick, ...attrs } = attribs;
        if (attribs.class === AMASTY) {
            const child_label = children[0].data.replace(/\u21b5/g, '').replace(/\s/g, '');
            if (onclick === PRINT) {
                return (
                    <WidgetFactory { ...this.attributesToProps({
                        type: 'PackingSlipButton',
                        label: child_label
                    }) }
                    />
                );
            }

            return (
                <WidgetFactory { ...this.attributesToProps({
                    type: 'ShippingLabelButton',
                    label: child_label
                }) }
                />
            );
        }
        if (href) {
            const isAbsoluteUrl = value => new RegExp('^(?:[a-z]+:)?//', 'i').test(value);
            const isSpecialLink = value => new RegExp('^(sms|tel|mailto):', 'i').test(value);

            if (!isAbsoluteUrl(href) && !isSpecialLink(href)) {
                return (
                    <Link { ...attributesToProps({ ...attrs, to: href }) }>
                        { domToReact(children, this.parserOptions) }
                    </Link>
                );
            }
        }
    }
}
