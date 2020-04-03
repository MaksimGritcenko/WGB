import React from 'react';
import SourceMyAccountOverlay from 'SourceComponent/MyAccountOverlay/MyAccountOverlay.component';
import Asset from 'Util/Resources';
import Form from 'Component/Form';
import Field from 'Component/Field';
import { withRouter } from 'react-router-dom';
import 'SourceComponent/MyAccountOverlay/MyAccountOverlay.style.scss';
import './MyAccountOverlay.extended.style.scss';

export * from 'SourceComponent/MyAccountOverlay/MyAccountOverlay.component';

const SOCIAL_LOGIN_PROVIDERS = {
    facebook: Asset.image('facebook.png'),
    google: Asset.image('google.svg'),
    instagram: Asset.image('google.svg')
};

class MyAccountOverlay extends SourceMyAccountOverlay.WrappedComponent {
    getSocialLogins() {
        const { logins, isSocialLoginsLoading } = this.props;

        if (isSocialLoginsLoading) {
            return (
                <>
                    <div block="MyAccountOverlay" elem="Provider" mods={ { loading: true } } />
                    <div block="MyAccountOverlay" elem="Provider" mods={ { loading: true } } />
                </>
            );
        }

        return logins.map(({ url, provider }) => (
            <div block="MyAccountOverlay" elem="Provider" key={ provider }>
                <a href={ url }>
                    <img src={ SOCIAL_LOGIN_PROVIDERS[provider] } alt={ provider } />
                </a>
            </div>
        ));
    }

    renderSignIn() {
        const {
            state,
            onSignInAttempt,
            onSignInSuccess,
            onFormError,
            handleForgotPassword,
            handleCreateAccount
        } = this.props;

        return (
            <>
                <Form
                  key="sign-in"
                  onSubmit={ onSignInAttempt }
                  onSubmitSuccess={ onSignInSuccess }
                  onSubmitError={ onFormError }
                >
                    <Field
                      type="text"
                      label={ __('Login or Email') }
                      id="email"
                      name="email"
                      validation={ ['notEmpty', 'email'] }
                    />
                    <Field
                      type="password"
                      label={ __('Password') }
                      id="password"
                      name="password"
                      validation={ ['notEmpty', 'password'] }
                    />
                    <div block="MyAccountOverlay" elem="Buttons">
                        <button block="Button">{ __('Sign in') }</button>
                    </div>
                    <button
                      block="Button"
                      mods={ { likeLink: true } }
                      onClick={ handleForgotPassword }
                    >
                        { __('Forgot password?') }
                    </button>
                    <div block="MyAccountOverlay" elem="SocialButtons">
                        { this.getSocialLogins() }
                    </div>
                </Form>
                <article block="MyAccountOverlay" elem="Additional" mods={ { state } }>
                    <section>
                        <h4 id="forgot-password-label">{ __('New to Netnutri?') }</h4>
                        <button
                          block="Button"
                          onClick={ handleCreateAccount }
                        >
                            { __('Create an account') }
                        </button>
                    </section>
                </article>
            </>
        );
    }
}

export default withRouter(MyAccountOverlay);
