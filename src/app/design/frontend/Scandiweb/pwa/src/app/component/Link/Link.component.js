/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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
import { Link as RouterLink } from 'react-router-dom';
import { stringify } from 'rebem-classname';

import SourceLink from 'SourceComponent/Link/Link.component';

export default class Link extends SourceLink {
    static propTypes = {
        ...this.propTypes,
        click: PropTypes.string
    };

    render() {
        const {
            to,
            children,
            click,
            ...props
        } = this.props;

        if (!to) {
            return (
                <div { ...props }>
                    { children }
                </div>
            );
        }
        if (click) {
            return (
                <button
                  block="Button"
                  onClick={ () => window.print() }
                >
                { children }
                </button>
            );
        }

        if (/^#/.test(to)) {
            return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <a
                  { ...props }
                  onClick={ this.scrollToElement }
                  href={ to }
                >
                    { children }
                </a>
            );
        }

        if (/^https?:\/\//.test(to)) {
            return (
                <a { ...props } href={ to }>
                    { children }
                </a>
            );
        }

        return (
            <RouterLink
              { ...props }
              to={ to }
              // eslint-disable-next-line react/forbid-component-props
              className={ stringify(this.props) }
            >
                { children }
            </RouterLink>
        );
    }
}
