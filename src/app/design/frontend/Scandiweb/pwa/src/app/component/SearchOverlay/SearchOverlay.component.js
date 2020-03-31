import SourceSearchOverlay from 'SourceComponent/SearchOverlay/SearchOverlay.component';
import Link from 'Component/Link';
import Overlay from 'Component/Overlay';
import TextPlaceholder from 'Component/TextPlaceholder';
import { closeIcon } from 'Component/Header/Header.config';
import isMobile from 'Util/Mobile';

import './SearchOverlay.style.override';

export {
    SEARCH_TIMEOUT
} from 'SourceComponent/SearchOverlay/SearchOverlay.component';

export const AMOUNT_OF_PLACEHOLDERS = 3;

export default class SearchOverlay extends SourceSearchOverlay {
    renderNoResults() {
        return (
            <span
              block="SearchOverlay"
              elem="ResultLookingFor"
            >
                No results found!
            </span>
        );
    }

    renderSearchResults() {
        const { searchCriteria, searchResults, isLoading } = this.props;

        if (!searchCriteria) return null;
        if (!searchResults.length && !isLoading && !this.timeout) return this.renderNoResults();
        const resultsToRender = (isLoading || this.timeout)
            ? Array(AMOUNT_OF_PLACEHOLDERS).fill({})
            : searchResults.splice(0, AMOUNT_OF_PLACEHOLDERS);

        return (
            <>
                <span
                  block="SearchOverlay"
                  elem="ResultLookingFor"
                >
                    Are you looking for:
                </span>
                <ul>
                    { resultsToRender.map((item, i) => this.renderSearchItem(item, i)) }
                </ul>
            </>
        );
    }

    renderSearchItemContent(name) {
        const placeholderLength = isMobile.any() ? 'long' : 'medium';

        return (
            <h4 block="SearchOverlay" elem="Title" mods={ { isLoaded: !!name } }>
                <TextPlaceholder content={ name } length={ placeholderLength } />
            </h4>
        );
    }

    renderSearchItem(product, i) {
        const { getProductLinkTo } = this.props;
        const { name } = product;

        return (
            <li
              block="SearchOverlay"
              elem="Item"
              key={ i }
            >
                <Link
                  block="SearchOverlay"
                  elem="Link"
                  to={ getProductLinkTo(product) }
                  onClick={ this.handleItemClick }
                >
                    <figure
                      block="SearchOverlay"
                      elem="Wrapper"
                    >
                        <figcaption block="SearchOverlay" elem="Content">
                            { this.renderSearchItemContent(name) }
                        </figcaption>
                    </figure>
                </Link>
            </li>
        );
    }

    renderCloseButton() {
        const { onCloseButtonClick } = this.props;

        return (
            <button
              onClick={ onCloseButtonClick }
              block="SearchOverlay"
              elem="CloseButton"
            >
                { closeIcon }
            </button>
        );
    }

    render() {
        const { children } = this.props;

        return (
            <Overlay
              id="search"
              mix={ { block: 'SearchOverlay' } }
            >
                { this.renderCloseButton() }
                <div
                  block="SearchOverlay"
                  elem="MainWrapper"
                >
                    <article
                      block="SearchOverlay"
                      elem="Results"
                      aria-label="Search results"
                    >
                        { children }
                        { this.renderSearchResults() }
                    </article>
                </div>
            </Overlay>
        );
    }
}
