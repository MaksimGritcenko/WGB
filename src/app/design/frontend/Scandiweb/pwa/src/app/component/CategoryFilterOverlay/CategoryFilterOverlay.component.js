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

import Overlay from 'Component/Overlay';
import RangeSelector from 'Component/RangeSelector';
import CategoryExpandableContent from 'Component/CategoryExpandableContent';
import SourceCategoryFilterOverlay,
{ CATEGORY_FILTER_OVERLAY_ID } from 'SourceComponent/CategoryFilterOverlay/CategoryFilterOverlay.component';
import './CategoryFilterOverlay.style';

export { CATEGORY_FILTER_OVERLAY_ID };

export default class CategoryFilterOverlay extends SourceCategoryFilterOverlay {
    renderFilterButton() {
        const { onFilterButtonClick } = this.props;

        return (
            <button
              block="CategoryFilterOverlay"
              elem="FilterButton"
              onClick={ onFilterButtonClick }
            >
                { __('Filters') }
            </button>
        );
    }

    renderHeading() {
        return (
            <>
                <div block="CategoryFilterOverlay" elem="Heading">
                    { this.renderFilterButton() }
                    { this.renderResetButton() }
                </div>
            </>
        );
    }

    renderNoResults() {
        return (
            <p block="CategoryFilterOverlay" elem="NoResults">
                { __(`The selected filter combination returned no results.
                Please try again, using a different set of filters.`) }
            </p>
        );
    }

    renderEmptyFilters() {
        return (
            <Overlay
              mix={ { block: 'CategoryFilterOverlay' } }
              id={ CATEGORY_FILTER_OVERLAY_ID }
              isFreezeEnabled={ false }
            >
                { this.renderHeading() }
                { this.renderNoResults() }
            </Overlay>
        );
    }

    renderMinimalFilters() {
        return (
            <Overlay
              mix={ { block: 'CategoryFilterOverlay' } }
              id={ CATEGORY_FILTER_OVERLAY_ID }
              isFreezeEnabled={ false }
            >
                { this.renderHeading() }
                { this.renderPriceRange() }
            </Overlay>
        );
    }

    renderPriceRange() {
        const {
            updatePriceRange,
            priceValue,
            minPriceValue,
            maxPriceValue
        } = this.props;

        const { min: minValue, max: maxValue } = priceValue;
        const min = minValue || minPriceValue;
        const max = maxValue || maxPriceValue;

        if (maxPriceValue - minPriceValue === 0) return null;

        return (
            <CategoryExpandableContent
              heading={ __('Price') }
              subHeading={ __('From: %s to %s', min, max) }
              mix={ {
                  block: 'CategoryFilterOverlay',
                  elem: 'Filter',
                  mods: { type: 'price' }
              } }
            >
                <RangeSelector
                  value={ priceValue }
                  minValue={ minPriceValue || min }
                  maxValue={ maxPriceValue || max }
                  onChangeComplete={ updatePriceRange }
                />
            </CategoryExpandableContent>
        );
    }


    renderDefaultFilters() {
        const { onVisible, onHide } = this.props;

        return (
            <Overlay
              onVisible={ onVisible }
              onHide={ onHide }
              mix={ { block: 'CategoryFilterOverlay' } }
              id={ CATEGORY_FILTER_OVERLAY_ID }
              isFreezeEnabled={ false }
              isStatic
            >
                { this.renderHeading() }
                { this.renderFilters() }
                { this.renderPriceRange() }
                { this.renderSeeResults() }
            </Overlay>
        );
    }
}
