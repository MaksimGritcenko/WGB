import React from 'react';
import SourceMyAccountOverlay from 'SourceComponent/MyAccountOverlay/MyAccountOverlay.component';
import Form from 'Component/Form';
import Field from 'Component/Field';
import { withRouter } from 'react-router-dom';
import 'SourceComponent/MyAccountOverlay/MyAccountOverlay.style.scss';
import './MyAccountOverlay.extended.style.scss';

export * from 'SourceComponent/MyAccountOverlay/MyAccountOverlay.component';


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
                <a href={ url } block="MyAccountOverlay" elem={ provider }>
                    <p>{ provider }</p>
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
                <div block="MyAccountOverlay" elem="Header">
                    <h2>{ __('SIGN IN / SIGN UP') }</h2>
                </div>
                <div block="MyAccountOverlay" elem="Form">
                    <h4 block="Form" elem="Header">
                        { __('I’m already a member of VGB family') }
                    </h4>
                </div>
                <Form
                  key="sign-in"
                  onSubmit={ onSignInAttempt }
                  onSubmitSuccess={ onSignInSuccess }
                  onSubmitError={ onFormError }
                >
                    <Field
                      type="text"
                      placeholder={ __('Email*') }
                      id="email"
                      name="email"
                      validation={ ['notEmpty', 'email'] }
                    />
                    <Field
                      type="password"
                      placeholder={ __('Password*') }
                      id="password"
                      name="password"
                      validation={ ['notEmpty', 'password'] }
                    />
                    <button
                      block="Button"
                      elem="Forgot"
                      mods={ { likeLink: true } }
                      onClick={ handleForgotPassword }
                    >
                        { __('Did you forget your password?') }
                    </button>
                    <div block="MyAccountOverlay" elem="Buttons">
                        <button block="Button">{ __('Sign in') }</button>
                    </div>
                </Form>
                <article block="MyAccountOverlay" elem="Additional" mods={ { state } }>
                    <section>
                        <h4 id="forgot-password-label">{ __('New User') }</h4>
                        <button
                          block="Button"
                          onClick={ handleCreateAccount }
                        >
                            { __('Create an account') }
                        </button>
                    </section>
                </article>
                <div block="MyAccountOverlay" elem="Social">
                    <h4 id="social-login">{ __('Or sign in using') }</h4>
                    { this.getSocialLogins() }
                </div>
            </>
        );
    }
}

export default withRouter(MyAccountOverlay);
