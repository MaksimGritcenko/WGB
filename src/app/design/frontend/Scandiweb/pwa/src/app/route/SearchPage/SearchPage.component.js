import CategoryPage from 'SourceRoute/CategoryPage/CategoryPage.component';
import ContentWrapper from 'Component/ContentWrapper';
import GenderSliderButtons from 'Component/GenderSliderButtons';

export default class SearchPage extends CategoryPage {
    render() {
        return (
            <main block="CategoryPage">
                <ContentWrapper
                  wrapperMix={ { block: 'CategoryPage', elem: 'Wrapper', mods: { isSearchPage: true }} }
                  label="Category page"
                >
                    { this.renderFilterOverlay() }
                    <aside block="CategoryPage" elem="Miscellaneous">
                        <GenderSliderButtons />
                        { this.renderItemsCount() }
                        { this.renderCategorySort() }
                        { this.renderFilterButton() }
                    </aside>
                    { this.renderCategoryProductList() }
                </ContentWrapper>
            </main>
        );
    }
}
