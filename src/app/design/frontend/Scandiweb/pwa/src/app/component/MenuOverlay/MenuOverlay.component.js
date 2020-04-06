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

    state = { activeCategoryIdMap: [] };

    closeMenuOverlay(e) {
        const { hideActiveOverlay } = this.props;

        e.stopPropagation();

        this.setState({ activeCategoryIdMap: [] });
        hideActiveOverlay();
    }

    updateActiveCategoryIdMap(item_id) {
        const { activeCategoryIdMap } = this.state;

        const activeIdMap = Array.from(activeCategoryIdMap);

        const itemIdIndex = activeCategoryIdMap.indexOf(item_id);

        if (itemIdIndex === -1) {
            activeIdMap.push(item_id);

            return activeIdMap;
        }

        activeIdMap.splice(itemIdIndex, 1);

        return activeIdMap;
    }

    handleSubcategoryClick(item_id) {
        this.setState({ activeCategoryIdMap: this.updateActiveCategoryIdMap(item_id) });
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
        const { activeCategoryIdMap } = this.state;
        const { item_id, children } = category;
        const isVisible = activeCategoryIdMap.indexOf(item_id) !== -1;
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
        const { activeCategoryIdMap } = this.state;
        const { item_id } = item;

        const buttonIcon = activeCategoryIdMap.indexOf(item_id) === -1 ? 'plus' : 'minus';

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

    renderTopLevel(menuId, mods) {
        const { [menuId]: menu } = this.props;
        const categoryArray = Object.values(menu);

        if (!categoryArray.length) return null;

        const {
            0: { children: mainCategories, title: mainCategoriesTitle }
        } = categoryArray;

        const mainMods = { type: 'main' };

        return (
            <div
              block="MenuOverlay"
              elem="Menu"
              mods={ mods }
            >
                <ul
                  block="MenuOverlay"
                  elem="ItemList"
                  mods={ mainMods }
                  aria-label={ mainCategoriesTitle }
                >
                    { this.renderFirstLevel(mainCategories, { ...mainMods, ...mods }) }
                </ul>
            </div>
        );
    }

    renderBottomItem(icon, title, link) {
        return (
            <Link
              to={ link }
              block="MenuOverlay"
              elem="BottomItem"
              key="logo"
            >
                <div
                  block="MenuOverlay"
                  elem="BottomIcon"
                >
                    <span>{ icon }</span>
                </div>
                <span>{ title }</span>
            </Link>
        );
    }

    renderBottomContent() {
        const { isSignedIn } = this.props;

        const destinationForMyAccount = isSignedIn ? '/my-account' : '/signin';
        const destinationForWishlist = isSignedIn ? '/my-favorites' : '/signin';
        return (
            <div block="MenuOverlay" elem="BottomContent">
                { this.renderBottomItem(accountIcon, 'My account', destinationForMyAccount) }
                { this.renderBottomItem(wishlistIcon, 'Favorites', destinationForWishlist) }
            </div>
        );
    }

    renderSlide(slideId) {
        return (
            <>
                { this.renderTopLevel(slideId) }
                { this.renderTopLevel('moreInfoMenu', { isMoreInfo: true }) }
            </>
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
                    { this.renderSlide('womenMenu') }
                    { this.renderSlide('menMenu') }
                </GenderSlider>
                { this.renderBottomContent() }
            </Overlay>
        );
    }
}
