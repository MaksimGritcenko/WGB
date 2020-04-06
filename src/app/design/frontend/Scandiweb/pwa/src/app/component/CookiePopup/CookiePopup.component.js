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
                    <p block="CookiePopup" elem="Heading">Use of cookies</p>
                    { this.renderCookieText() }
                </ContentWrapper>
            </div>
        );
    }
}

export { COOKIE_POPUP };
export default CookiePopup;
