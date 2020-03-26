import SourceMenuOverlay, { MENU_OVERLAY_KEY } from 'SourceComponent/MenuOverlay/MenuOverlay.component';
import Overlay from 'Component/Overlay';
import GenderSlider from 'Component/GenderSlider';
import Link from 'Component/Link';
import { wishlistIcon, accountIcon } from 'Component/Header/Header.config';
import { getSortedItems } from 'Util/Menu';
import isMobile from 'Util/Mobile';

import './MenuOverlay.style';

export { MENU_OVERLAY_KEY };

export default class MenuOverlay extends SourceMenuOverlay {
    state = { activeCategoryId: null };

    closeMenuOverlay(e) {
        const { hideActiveOverlay } = this.props;

        e.stopPropagation();

        this.setState({ activeCategoryId: null });
        hideActiveOverlay();
    }

    handleSubcategoryClick(item_id) {
        const { activeCategoryId } = this.state;

        this.setState({ activeCategoryId: activeCategoryId === item_id ? null : item_id });
    }

    renderSubLevel(category) {
        const { activeCategoryId } = this.state;
        const { item_id, children } = category;
        const childrenArray = getSortedItems(Object.values(children));
        const isVisible = activeCategoryId === item_id;
        const subcategoryMods = { type: 'subcategory' };

        return (
            <div
              block="MenuOverlay"
              elem="SubMenu"
              mods={ { isVisible } }
            >
                <div
                  block="MenuOverlay"
                  elem="ItemList"
                  mods={ { ...subcategoryMods } }
                >
                    { childrenArray.map((item) => {
                        const {
                            url,
                            item_id,
                            children,
                            cms_page_identifier
                        } = item;

                        const childrenArray = Object.values(children);

                        const path = cms_page_identifier ? `/${ cms_page_identifier}` : url;

                        return (childrenArray.length
                            ? (
                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                                <div
                                  key={ item_id }
                                  onClick={ e => this.handleSubcategoryClick(e, item) }
                                  tabIndex="0"
                                  role="button"
                                >
                                    { this.renderItemContent(item, subcategoryMods) }
                                    { this.renderSubLevel(item) }
                                </div>
                            ) : (
                                <Link
                                  key={ item_id }
                                  to={ path }
                                  onClick={ this.closeMenuOverlay }
                                  block="MenuOverlay"
                                  elem="Link"
                                >
                                    { this.renderItemContent(item, subcategoryMods) }
                                </Link>
                            )
                        );
                    }) }
                </div>
            </div>
        );
    }

    renderItemContent(item, mods = {}, onClick = () => {}) {
        const { title, icon, item_class } = item;
        const itemMods = item_class === 'MenuOverlay-ItemFigure_type_banner' ? { type: 'banner' } : mods;

        return (
            <button
              block="MenuOverlay"
              elem="ItemFigure"
              mods={ itemMods }
              onClick={ onClick }
              // eslint-disable-next-line react/forbid-dom-props
              className={ item_class }
            >
                { this.renderItemContentImage(icon, itemMods) }
                <figcaption
                  block="MenuOverlay"
                  elem="ItemCaption"
                  mods={ itemMods }
                >
                    { title }
                </figcaption>
            </button>
        );
    }

    renderFirstLevel(itemList, itemMods) {
        const { activeCategoryId } = this.state;
        const childrenArray = getSortedItems(Object.values(itemList));

        return childrenArray.map((item) => {
            const { item_id, children, url } = item;
            const childrenArray = Object.values(children);

            return (
                <li key={ item_id } block="MenuOverlay" elem="Item">
                    { childrenArray.length
                        ? (
                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                            <div
                              onClick={ () => this.handleSubcategoryClick(item_id) }
                              tabIndex="0"
                              role="button"
                            >
                                { this.renderItemContent(item, { ...itemMods, buttonIcon: activeCategoryId === item_id ? 'minus' : 'plus' }) }
                                { this.renderSubLevel(item) }
                            </div>
                        ) : (
                            <Link
                              to={ url }
                              onClick={ this.closeMenuOverlay }
                              block="MenuOverlay"
                              elem="Link"
                            >
                                { this.renderItemContent(item, itemMods) }
                            </Link>
                        ) }
                </li>
            );
        });
    }

    renderTopLevel(menuId) {
        const { [menuId]: menu } = this.props;
        const categoryArray = Object.values(menu);

        if (!categoryArray.length) return null;

        const {
            0: { children: mainCategories, title: mainCategoriesTitle }
        } = categoryArray;

        const mainMods = { type: 'main' };

        return (
            <div block="MenuOverlay" elem="Menu">
                <ul
                  block="MenuOverlay"
                  elem="ItemList"
                  mods={ mainMods }
                  aria-label={ mainCategoriesTitle }
                >
                    { this.renderFirstLevel(mainCategories, mainMods) }
                </ul>
            </div>
        );
    }

    renderBottomItem(icon, title) {
        return (
            <button
              block="MenuOverlay"
              elem="BottomItem"
            >
                <div
                  block="MenuOverlay"
                  elem="BottomIcon"
                >
                    <span>{ icon }</span>
                </div>
                <span>{ title }</span>
            </button>
        );
    }

    renderBottomContent() {
        return (
            <div block="MenuOverlay" elem="BottomContent">
                { this.renderBottomItem(accountIcon, 'My account') }
                { this.renderBottomItem(wishlistIcon, 'Favorites') }
            </div>
        );
    }

    render() {
        return (
            <Overlay
              id={ MENU_OVERLAY_KEY }
              mix={ { block: 'MenuOverlay' } }
              onVisible={ this.onVisible }
              isStatic={ !!isMobile.any() }
            >
                <GenderSlider
                  isGenderSwitcher
                >
                    { this.renderTopLevel('womenMenu') }
                    { this.renderTopLevel('menMenu') }
                </GenderSlider>
                { this.renderBottomContent() }
            </Overlay>
        );
    }
}
