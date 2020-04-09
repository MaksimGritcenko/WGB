import SourceCookiePopup, { COOKIE_POPUP } from 'SourceComponent/CookiePopup/CookiePopup.component';
import { closeIcon } from 'Component/Header/Header.config';
import ContentWrapper from 'Component/ContentWrapper';
import Link from 'Component/Link';
import './CookiePopup.style.scss';

export class CookiePopup extends SourceCookiePopup {
    state = {
        display: false
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

    renderHeading() {
        return (
            <p block="CookiePopup" elem="Heading">
            { this.countryFits()
                ? 'Use of cookies'
                : 'LOCATION' }
            </p>
        );
    }

    renderCountryNotice() {
        const { userLocation } = this.props;

        return (
            <p>
                { __('We have identified your location as ') }
                <span block="CookiePopup" elem="Country">{ userLocation }</span>
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
        if (isCountryLoadingFailed) {
            return true;
        }

        return allowedCountries.filter(country => country.id === userLocation);
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
            <div block="CookiePopup" mods={ { isShown } }>
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
