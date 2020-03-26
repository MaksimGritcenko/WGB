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
import './CategoryExpandableContent.style';


export default class CategoryExpandableContent extends ExpandableContent {
    renderButton() {
        const { isContentExpanded } = this.state;
        const { heading, subHeading, mix } = this.props;

        return (
            <button
              block="CategoryExpandableContent"
              elem="Button"
              mods={ { isContentExpanded } }
              mix={ { ...mix, elem: 'CategoryExpandableContentButton' } }
              onClick={ this.toggleExpand }
            >
                <span
                  block="CategoryExpandableContent"
                  elem="Heading"
                  mix={ { ...mix, elem: 'CategoryExpandableContentHeading' } }
                >
                    <TextPlaceholder content={ heading } />
                </span>
                <span
                  block="CategoryExpandableContent"
                  elem="SubHeading"
                  mix={ { ...mix, elem: 'CategoryExpandableContentSubHeading' } }
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
              block="CategoryExpandableContent"
              elem="Content"
              mods={ mods }
              mix={ { ...mix, elem: 'CategoryExpandableContentContent', mods } }
            >
                { children }
            </div>
        );
    }

    render() {
        const { mix } = this.props;

        return (
            <article
              block="CategoryExpandableContent"
              mix={ mix }
            >
                { this.renderButton() }
                { this.renderContent() }
            </article>
        );
    }
}
