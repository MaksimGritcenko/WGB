import SourceCheckout, {
    SHIPPING_STEP,
    BILLING_STEP,
    DETAILS_STEP
} from 'SourceRoute/Checkout/Checkout.component';
import { CHECKOUT, HOME_PAGE } from 'Component/Header';
import Link from 'Component/Link';
import './Checkout.override.style.scss';

class Checkout extends SourceCheckout {
    updateHeader() {
        const { setHeaderState, checkoutStep, history } = this.props;
        const { title = '' } = this.stepMap[checkoutStep];

        if (checkoutStep !== DETAILS_STEP) {
            setHeaderState({
                name: CHECKOUT,
                title,
                onBackClick: () => history.push('/')
            });

            return;
        }

        setHeaderState({
            name: HOME_PAGE
        });
    }

    renderTitle() {
        const { checkoutStep } = this.props;
        const { title = '' } = this.stepMap[checkoutStep];

        if (checkoutStep === DETAILS_STEP) {
            return null;
        }

        return (
            <h1 block="Checkout" elem="Title">
                { title }
            </h1>
        );
    }

    renderDetailsStep() {
        const { orderID } = this.props;

        return (
            <div block="Checkout" elem="Success">
                <h3>{ __('Thank you!') }</h3>
                <p>
                    { __(`You have successfully placed your order #${orderID}.`) }
                    <br />
                    { __('Check your e-mail for status updates.') }
                </p>
                <Link
                  block="Button"
                  mix={ { block: 'Checkout', elem: 'ContinueButton' } }
                  to="/"
                >
                    { __('Back to VGB paradise') }
                </Link>
            </div>
        );
    }
}

// TODO: implement Checkout

export { SHIPPING_STEP, BILLING_STEP, DETAILS_STEP };
export default Checkout;
