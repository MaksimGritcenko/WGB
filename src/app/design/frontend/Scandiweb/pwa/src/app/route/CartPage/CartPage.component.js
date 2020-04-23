import Link from 'Component/Link';
import isMobile from 'Util/Mobile';
import CartItem from 'Component/CartItem';
import ContentWrapper from 'Component/ContentWrapper';
import { formatCurrency, roundPrice } from 'Util/Price';

import SourceCartPage from 'SourceRoute/CartPage/CartPage.component';

import './CartPage.style.override';

export default class CartPage extends SourceCartPage {
    renderPageTitle() {
        return (
            <h1
              block="CartPage"
              elem="MainTitle"
            >
                my shopping cart
            </h1>
        );
    }

    renderCartItems() {
        const { isEditing, totals: { items, quote_currency_code, is_show_rma_info_cart } } = this.props;

        if (!items || items.length < 1) {
            return (
                <p block="CartPage" elem="Empty">{ __('There are no products in cart.') }</p>
            );
        }

        return (
            <>
                <p block="CartPage" elem="TableHead" aria-hidden>
                    <span>{ __('item') }</span>
                    <span>{ __('qty') }</span>
                    <span>{ __('subtotal') }</span>
                </p>
                <ul block="CartPage" elem="Items" aria-label="List of items in cart">
                    { items.map(item => (
                        <CartItem
                          key={ item.item_id }
                          item={ item }
                          currency_code={ quote_currency_code }
                          isEditing={ !isMobile.any() || isEditing }
                          isLikeTable
                          isReturnRulesShowed={ is_show_rma_info_cart }
                        />
                    )) }
                </ul>
                <p
                  block="CartPage"
                  elem="ItemsComment"
                >
                    * Items placed in your bag are not reserved
                </p>
            </>
        );
    }

    renderOrderTotal() {
        const {
            totals: {
                subtotal_incl_tax = 0
            }
        } = this.props;

        return (
            <dl block="CartPage" elem="Total" aria-label="Complete order total">
                <dt>{ __('Order total:') }</dt>
                <dd>{ this.renderPriceLine(subtotal_incl_tax) }</dd>
            </dl>
        );
    }

    renderPriceLine(price) {
        const { totals: { quote_currency_code } } = this.props;
        return `${ roundPrice(price) } ${ formatCurrency(quote_currency_code) }`;
    }

    renderTotalDetails(isMobile = false) {
        const {
            totals: {
                subtotal = 0,
                tax_amount = 0,
                subtotal_incl_tax = 0
            }
        } = this.props;

        return (
            <div
              block="CartPage"
              elem="TotalDetailsWrapper"
              mods={ { isMobile } }
            >
                <p
                  block="CartPage"
                  elem="TotalDetailsTitle"
                  mods={ { isMobile } }
                >
                    Summary
                </p>
                <dl
                  block="CartPage"
                  elem="TotalDetails"
                  aria-label={ __('Order total details') }
                  mods={ { isMobile } }
                >
                    <dt>{ __('Sub-total') }</dt>
                    <dd>{ this.renderPriceLine(subtotal) }</dd>
                    { this.renderDiscount() }
                    <dt>{ __('Tax') }</dt>
                    <dd>{ this.renderPriceLine(tax_amount) }</dd>
                    <dt
                      block="CartPage"
                      elem="TotalDetailTotal"
                    >
                        { __('TOTAL (VAT Included)') }
                    </dt>
                    <dd
                      block="CartPage"
                      elem="TotalDetailTotal"
                    >
                        { this.renderPriceLine(subtotal_incl_tax) }
                    </dd>
                </dl>
            </div>
        );
    }

    renderTotals() {
        const {
            totals: {
                subtotal_incl_tax = 0,
                items
            },
            guest_checkout,
            isSignedIn
        } = this.props;

        const props = !items || items.length < 1
            ? {
                onClick: e => e.preventDefault(),
                disabled: true
            }
            : {};

        const destination = (isSignedIn || guest_checkout) ? '/checkout' : '/signin';

        return (
            <article block="CartPage" elem="Summary">
                <h4 block="CartPage" elem="SummaryHeading">{ __('Summary') }</h4>
                { this.renderTotalDetails() }
                <dl block="CartPage" elem="Total" aria-label="Complete order total">
                    <dt>{ __('TOTAL (VAT Included)') }</dt>
                    <dd>{ this.renderPriceLine(subtotal_incl_tax) }</dd>
                </dl>
                { this.renderPrivacyComment() }
                <div block="CartPage" elem="CheckoutButtons">
                    <Link
                      block="CartPage"
                      elem="CheckoutButton"
                      mix={ { block: 'Button' } }
                      to={ destination }
                      { ...props }
                    >
                        <span />
                        { __('Continue to checkout') }
                    </Link>
                    <Link
                      block="CartPage"
                      elem="ContinueShopping"
                      to="/"
                    >
                        { __('Continue shopping') }
                    </Link>
                </div>
            </article>
        );
    }

    renderPrivacyLink(link, title) {
        return (
            <Link
              to={ link }
              block="CartPage"
              elem="PrivacyLink"
            >
                { title }
            </Link>
        );
    }

    renderPrivacyComment(isMobile = false) {
        return (
            <p
              block="CartPage"
              elem="PrivacyComment"
              mods={ { isMobile } }
            >
                <span>* I have read and accept the </span>
                { this.renderPrivacyLink('/page/terms-and-conditions', 'Purchase Conditions') }
                <span> and understand the </span>
                { this.renderPrivacyLink('/page/privacy-policy-cookie-restriction-mode', 'Privacy and Cookies Policy') }
            </p>
        );
    }

    render() {
        return (
            <main block="CartPage" aria-label="Cart Page">
                { this.renderPageTitle() }
                <ContentWrapper
                  wrapperMix={ { block: 'CartPage', elem: 'Wrapper' } }
                  label="Cart page details"
                >
                    <div block="CartPage" elem="Static">
                        { this.renderCartItems() }
                        { this.renderTotalDetails(true) }
                        {/* { this.renderDiscountCode() } */}
                        { this.renderCrossSellProducts() }
                        { this.renderPrivacyComment(true) }
                    </div>
                    <div block="CartPage" elem="Floating">
                        {/* { this.renderPromo() } */}
                        { this.renderTotals() }
                    </div>
                </ContentWrapper>
            </main>
        );
    }
}
