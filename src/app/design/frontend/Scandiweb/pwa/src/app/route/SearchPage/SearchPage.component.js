import CategoryPage from 'SourceRoute/CategoryPage/CategoryPage.component';
import ContentWrapper from 'Component/ContentWrapper';

export default class SearchPage extends CategoryPage {
    render() {
        return (
            <main block="CategoryPage">
                <ContentWrapper
                  wrapperMix={ { block: 'CategoryPage', elem: 'Wrapper' } }
                  label="Category page"
                >
                    { this.renderFilterOverlay() }
                    <aside block="CategoryPage" elem="Miscellaneous">
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
