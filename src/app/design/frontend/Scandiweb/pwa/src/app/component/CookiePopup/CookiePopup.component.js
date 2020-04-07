import SourceCookiePopup, { COOKIE_POPUP } from 'SourceComponent/CookiePopup/CookiePopup.component';
import { closeIcon } from 'Component/Header/Header.config';
import ContentWrapper from 'Component/ContentWrapper';
import Link from 'Component/Link';
import './CookiePopup.style.scss';

export class CookiePopup extends SourceCookiePopup {
    renderCookieLink() {
        const { cookieLink } = this.props;

        if (!cookieLink) {
            return null;
        }

        return (
            <Link
              block="CookiePopup"
              elem="Link"
              to={ cookieLink }
            >
                <br />
                { __('Click here for more information on our ') }
                <u>{ __('Cookies policy.') }</u>
            </Link>
        );
    }

    getHeadingText() {
        if (this.countryFits()) {
            return 'Use of cookies';
        }

        return 'LOCATION';
    }

    renderCountryNotice() {
        const { userLocation = 'Latvia' } = this.props;

        return (
            <p>
                { __('We have identified your location as ') }
                <span block="CookiePopup" elem="Country">{ userLocation }</span>
                { __('. We can\'t ship here yet but you can browse, or find your nearest store ') }
                <Link to="/cart">here</Link>
            </p>
        );
    }

    countryFits() {
        const { countries } = this.props;

        return false;
    }

    renderCookieNotice() {
        const { cookieText } = this.props;

        return (
        <p>
            { cookieText }
            { this.renderCookieLink() }
        </p>
        );
    }

    renderCookieText() {
        return (
            <div block="CookiePopup" elem="Content">
                { this.countryFits() ? null : this.renderCountryNotice() }
                { this.renderCookieNotice() }
            </div>
        );
    }

    render() {
        const { cookieText } = this.props;
        const { isAccepted } = this.state;

        if (!cookieText || isAccepted) {
            return null;
        }

        return (
            <div block="CookiePopup">
                <ContentWrapper
                  label="Cookie popup"
                  mix={ { block: 'CookiePopup', elem: 'Wrapper' } }
                  wrapperMix={ { block: 'CookiePopup', elem: 'ContentWrapper' } }
                >
                    <div block="CookiePopup" elem="CTA">
                        <button onClick={ this.acceptCookies }>
                            { closeIcon }
                        </button>
                    </div>
                    <p block="CookiePopup" elem="Heading">{ this.getHeadingText() }</p>
                    { this.renderCookieText() }
                </ContentWrapper>
            </div>
        );
    }
}

export { COOKIE_POPUP };
export default CookiePopup;
