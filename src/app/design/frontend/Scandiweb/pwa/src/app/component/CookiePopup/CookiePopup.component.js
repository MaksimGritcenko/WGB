import { createRef } from 'react';

import SourceCookiePopup, { COOKIE_POPUP } from 'SourceComponent/CookiePopup/CookiePopup.component';
import { closeIcon } from 'Component/Header/Header.config';
import ContentWrapper from 'Component/ContentWrapper';
import BrowserDatabase from 'Util/BrowserDatabase';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';
import Link from 'Component/Link';
import './CookiePopup.style.scss';

const POPUP_HIDE_DURATION = 200;

export class CookiePopup extends SourceCookiePopup {
    state = {
        isAccepted: BrowserDatabase.getItem(COOKIE_POPUP) || false,
        display: false
    };

    constructor(props) {
        super(props);

        this.popupRef = createRef();
    }

    acceptCookies = () => {
        BrowserDatabase.setItem(true, COOKIE_POPUP, ONE_MONTH_IN_SECONDS);
        this.popupRef.current.classList.add('CookiePopup_isHidden');
        setTimeout(() => {
            this.setState({ isAccepted: true });
        }, POPUP_HIDE_DURATION);
    };

    componentDidMount() {
        const {
            currentCountry,
            isCountryLoading,
            isCountryLoadingFailed,
            getUserLocation
        } = this.props;

        if (!currentCountry && !isCountryLoadingFailed && !isCountryLoading) {
            getUserLocation();
        }
    }

    renderCookieLink() {
        const { cookieLink } = this.props;

        if (!cookieLink) {
            return null;
        }

        const absoluteCookieLink = cookieLink[0] === '/'
            ? cookieLink
            : `/${ cookieLink }`;

        return (
            <Link
              block="CookiePopup"
              elem="Link"
              to={ absoluteCookieLink }
            >
                <br />
                { __('Click here for more information on our ') }
                <u>{ __('Cookies policy.') }</u>
            </Link>
        );
    }

    renderHeading() {
        const stuffToRender = this.countryFits()
            ? __('Use of cookies')
            : __('LOCATION');

        return (
            <p block="CookiePopup" elem="Heading">{ stuffToRender }</p>
        );
    }

    renderCountryNotice() {
        const { userLocationName } = this.props;

        return (
            <p>
                { __('We have identified your location as ') }
                <span block="CookiePopup" elem="Country">{ userLocationName }</span>
                { __('. We can\'t ship here yet but you can browse, or find your nearest store ') }
                <Link to="/stores">here</Link>
            </p>
        );
    }

    countryFits() {
        const {
            allowedCountries,
            userLocation,
            isCountryLoadingFailed
        } = this.props;

        // Handle country loading failed - ignore country notice and show cookie notice
        if (isCountryLoadingFailed || !userLocation) {
            return true;
        }

        return allowedCountries.filter(country => country.id === userLocation).length;
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
        const { cookieText, isCountryLoading } = this.props;
        const { isAccepted } = this.state;

        if (!cookieText || isAccepted) {
            return null;
        }

        const isShown = !isAccepted && !!cookieText && !isCountryLoading;

        return (
            <div ref={ this.popupRef } block="CookiePopup" mods={ { isShown } }>
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
                    { this.renderHeading() }
                    { this.renderCookieText() }
                </ContentWrapper>
            </div>
        );
    }
}

export { COOKIE_POPUP };
export default CookiePopup;
