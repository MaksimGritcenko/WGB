/* eslint-disable consistent-return */
// Disabled due `domToReact` internal logic
import SourceHtml from 'SourceComponent/Html/Html.component';
import attributesToProps from 'html-react-parser/lib/attributes-to-props';
import Link from 'Component/Link';
import domToReact from 'html-react-parser/lib/dom-to-react';


export default class Html extends SourceHtml {
    rules = [
        {
            query: { name: ['widget'] },
            replace: this.replaceWidget
        },
        {
            query: { name: ['a'] },
            replace: this.replaceLinks
        },
        {
            query: { name: ['img'] },
            replace: this.replaceImages
        },
        {
            query: { name: ['input'] },
            replace: this.replaceInput
        },
        {
            query: { name: ['script'] },
            replace: this.getDefaultStatusesreplaceScript
        },
        {
            query: { name: ['style'] },
            replace: this.replaceStyle
        },
        {
            query: { name: ['table'] },
            replace: this.wrapTable
        }
    ];


    replaceLinks({ attribs, children }) {
        const { href, onclick, ...attrs } = attribs;
        if (href) {
            const isAbsoluteUrl = value => new RegExp('^(?:[a-z]+:)?//', 'i').test(value);
            const isSpecialLink = value => new RegExp('^(sms|tel|mailto):', 'i').test(value);

            if (!isAbsoluteUrl(href) && !isSpecialLink(href)) {
                return (
                    <Link { ...attributesToProps({ ...attrs, to: href, click: onclick }) }>
                        { domToReact(children, this.parserOptions) }
                    </Link>
                );
            }
        }
    }
}
