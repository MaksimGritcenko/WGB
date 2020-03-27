import PropTypes from 'prop-types';
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
    static propTypes = {
        womenMenu: PropTypes.object.isRequired,
        menMenu: PropTypes.object.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        goToPreviousHeaderState: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired
    };

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

    renderSubLevelItemList(children, subcategoryMods) {
        const childrenArray = getSortedItems(Object.values(children));

        return childrenArray.map((item) => {
            const {
                url,
                item_id,
                children,
                cms_page_identifier
            } = item;

            const childrenArray = Object.values(children);

            const path = cms_page_identifier ? `/${ cms_page_identifier}` : url;

            if (childrenArray.length) {
                return (
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
                );
            }

            return (
                <Link
                  key={ item_id }
                  to={ path }
                  onClick={ this.closeMenuOverlay }
                  block="MenuOverlay"
                  elem="Link"
                >
                    { this.renderItemContent(item, subcategoryMods) }
                </Link>
            );
        });
    }

    renderSubLevel(category) {
        const { activeCategoryId } = this.state;
        const { item_id, children } = category;
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
                    { this.renderSubLevelItemList(children, subcategoryMods) }
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

    renderFirstLevelButton(item, itemMods) {
        const { activeCategoryId } = this.state;
        const { item_id } = item;

        const buttonIcon = activeCategoryId === item_id ? 'minus' : 'plus';

        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
              onClick={ () => this.handleSubcategoryClick(item_id) }
              tabIndex="0"
              role="button"
            >
                { this.renderItemContent(item, { ...itemMods, buttonIcon }) }
                { this.renderSubLevel(item) }
            </div>
        );
    }

    renderFirstLevelLink(item, itemMods) {
        const { url } = item;

        return (
            <Link
              to={ url }
              onClick={ this.closeMenuOverlay }
              block="MenuOverlay"
              elem="Link"
            >
                { this.renderItemContent(item, itemMods) }
            </Link>
        );
    }

    renderFirstLevelItem(childrenArrayLength, item, itemMods) {
        return (
            childrenArrayLength
                ? this.renderFirstLevelButton(item, itemMods)
                : this.renderFirstLevelLink(item, itemMods)
        );
    }

    renderFirstLevel(itemList, itemMods) {
        const childrenArray = getSortedItems(Object.values(itemList));

        return childrenArray.map((item) => {
            const { item_id, children } = item;
            const childrenArray = Object.values(children);

            return (
                <li key={ item_id } block="MenuOverlay" elem="Item">
                    { this.renderFirstLevelItem(childrenArray.length, item, itemMods) }
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
