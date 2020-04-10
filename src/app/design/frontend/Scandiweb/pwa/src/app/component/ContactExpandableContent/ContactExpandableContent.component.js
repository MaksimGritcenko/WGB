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

import TextPlaceholder from 'Component/TextPlaceholder';
import ExpandableContent from 'Component/ExpandableContent';
import './ContactExpandableContent.style';


export default class ContactExpandableContent extends ExpandableContent {
    renderButton() {
        const { isContentExpanded } = this.state;
        const { heading, subHeading, mix } = this.props;

        return (
            <button
              block="ContactExpandableContent"
              elem="Button"
              mods={ { isContentExpanded } }
              mix={ { ...mix, block: 'ContactExpandableContent', elem: 'Button' } }
              onClick={ this.toggleExpand }
            >
            <span
              block="ContactExpandableContent"
              elem="Heading"
              mix={ { ...mix, block: 'ContactExpandableContent', elem: 'Heading' } }
            >
              <TextPlaceholder content={ heading } />
            </span>
            <span
              block="ContactExpandableContent"
              elem="SubHeading"
              mix={ { ...mix, block: 'ContactExpandableContent', elem: 'SubHeading' } }
            >
              { subHeading }
            </span>
            </button>

        );
    }

    renderContent() {
        const { children, mix } = this.props;
        const { isContentExpanded } = this.state;
        const mods = { isContentExpanded };

        return (
            <div
              block="ContactExpandableContent"
              elem="Content"
              mods={ mods }
              mix={ {
                  ...mix, block: 'ContactExpandableContent', elem: 'Content', mods
              } }
            >
              { children }
            </div>
        );
    }

    render() {
        const { mix } = this.props;

        return (
            <article
              block="ContactExpandableContent"
              mix={ mix }
            >
              { this.renderButton() }
              { this.renderContent() }
            </article>
        );
    }
}
