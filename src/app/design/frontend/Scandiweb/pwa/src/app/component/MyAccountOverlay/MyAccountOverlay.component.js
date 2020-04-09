import React from 'react';
import SourceMyAccountOverlay from 'SourceComponent/MyAccountOverlay/MyAccountOverlay.component';
import Form from 'Component/Form';
import Field from 'Component/Field';
import { withRouter } from 'react-router-dom';
import 'SourceComponent/MyAccountOverlay/MyAccountOverlay.style.scss';
import './MyAccountOverlay.extended.style.scss';

import Loader from 'Component/Loader';

export * from 'SourceComponent/MyAccountOverlay/MyAccountOverlay.component';

export const STATE_SIGN_IN = 'signIn';
export const STATE_FORGOT_PASSWORD = 'forgotPassword';
export const STATE_FORGOT_PASSWORD_SUCCESS = 'forgotPasswordSuccess';
export const STATE_CREATE_ACCOUNT = 'createAccount';
export const STATE_LOGGED_IN = 'loggedIn';
export const STATE_CONFIRM_EMAIL = 'confirmEmail';

const SOCIAL_LOGIN_PROVIDERS = {
    facebook: 'FACEBOOK',
    google: 'GOOGLE ACCOUNT'
};

export class MyAccountOverlay extends SourceMyAccountOverlay.WrappedComponent {
    componentDidUpdate(prevProps) {
        const { state, updateMeta } = this.props;
        const { state: prevState } = prevProps;

        if (state !== prevState) {
            const title = this.getTitle(state);
            updateMeta({ title });
        }
    }

    getTitle(state) {
        switch (state) {
        case STATE_SIGN_IN:
            return 'Sign In';
        case STATE_FORGOT_PASSWORD:
            return 'Forgot Password';
        case STATE_FORGOT_PASSWORD_SUCCESS:
            return 'Forgot Password Success';
        case STATE_CREATE_ACCOUNT:
            return 'Create Account';
        case STATE_LOGGED_IN:
            return 'Logged In';
        case STATE_CONFIRM_EMAIL:
            return 'Confirm Email';
        default:
            return 'Sign In';
        }
    }
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
                    <p>{ SOCIAL_LOGIN_PROVIDERS[provider] }</p>
                </a>
            </div>
        ));
    }

    renderMap = {
        [STATE_SIGN_IN]: {
            render: () => this.renderSignIn(),
            title: null
        },
        [STATE_FORGOT_PASSWORD]: {
            render: () => this.renderForgotPassword(),
            title: null
        },
        [STATE_FORGOT_PASSWORD_SUCCESS]: {
            render: () => this.renderForgotPasswordSuccess()
        },
        [STATE_CREATE_ACCOUNT]: {
            render: () => this.renderCreateAccount()
        },
        [STATE_LOGGED_IN]: {
            render: () => {}
        },
        [STATE_CONFIRM_EMAIL]: {
            render: () => this.renderConfirmEmail()
        }
    };

    renderNewUser() {
        const {
            state,
            handleCreateAccount
        } = this.props;

        return (
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
        );
    }

    renderSignInForm() {
        const {
            onSignInAttempt,
            onSignInSuccess,
            onFormError,
            handleForgotPassword
        } = this.props;

        return (
             <Form
               key="sign-in"
               onSubmit={ onSignInAttempt }
               onSubmitSuccess={ onSignInSuccess }
               onSubmitError={ onFormError }
             >
                   <h4 block="MyAccountOverlay" elem="SubHeader">
                     { __('I’m already a member of VGB family') }
                   </h4>
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
                  type="Button"
                  mods={ { likeLink: true } }
                  onClick={ handleForgotPassword }
                >
                    { __('Did you forget your password?') }
                </button>
                <div block="MyAccountOverlay" elem="Buttons">
                    <button block="Button">{ __('Sign in') }</button>
                </div>
             </Form>
        );
    }

    renderCreateAccountForm() {
        const {
            onCreateAccountAttempt,
            onCreateAccountSuccess
        } = this.props;

        return (
            <Form
              key="create-account"
              onSubmit={ onCreateAccountAttempt }
              onSubmitSuccess={ onCreateAccountSuccess }
              onSubmitError={ onCreateAccountAttempt }
            >
              <fieldset block="MyAccountOverlay" elem="Legend">
                  <Field
                    type="text"
                    placeholder={ __('Name*') }
                    id="firstname"
                    name="firstname"
                    validation={ ['notEmpty'] }
                  />
                  <Field
                    type="text"
                    placeholder={ __('Surname*') }
                    id="lastname"
                    name="lastname"
                    validation={ ['notEmpty'] }
                  />
                  <Field
                    type="text"
                    placeholder="Email*"
                    id="email"
                    name="email"
                    validation={ ['notEmpty', 'email'] }
                  />
              </fieldset>
              <fieldset block="MyAccountOverlay" elem="Legend">
                  <Field
                    type="password"
                    placeholder={ __('Password*') }
                    id="password"
                    name="password"
                    validation={ ['notEmpty', 'password'] }
                  />
                  <Field
                    type="password"
                    placeholder={ __('Confirm password*') }
                    id="confirm_password"
                    name="confirm_password"
                    validation={ ['notEmpty', 'password', 'password_match'] }
                  />
                    <Field
                      type="checkbox"
                      value="is_subscribed"
                      label={ __('I want to receive personalized commercial communications from Vagabond Studio') }
                      id="is_subscribed"
                      mix={ { block: 'MyAccountOverlay', elem: 'Checkbox' } }
                      name="is_subscribed"
                    />
              </fieldset>
              <p block="MyAccountOverlay" elem="Confirm">
                        { __('* I have read and understand the ') }
                    <a href="/page/privacy-policy-cookie-restriction-mode">Privacy and Cookies Policy</a>
              </p>
              <div block="MyAccountOverlay" elem="Buttons">
                  <button
                    block="Button"
                    type="submit"
                  >
                      { __('Sign up') }
                  </button>
              </div>
            </Form>
        );
    }

    renderCreateAccount() {
        return (
            <>
                <div block="MyAccountOverlay" elem="Header">
                    { this.renderBackToSignIn() }
                    <h1>{ __('CREATE AN ACCOUNT') }</h1>
                </div>
                <div block="MyAccountOverlay" elem="Column">
                    <div block="MyAccountOverlay" elem="Column_left">
                    { this.renderCreateAccountForm() }
                    </div>
                </div>
                <div block="MyAccountOverlay" elem="Column">
                    <div block="MyAccountOverlay" elem="Column_right">
                        { this.renderAlreadyMember() }
                    </div>
                </div>
            </>
        );
    }

    renderAlreadyMember() {
        const {
            handleSignIn
        } = this.props;

        return (
            <article block="MyAccountOverlay" elem="Additional">
                <section>
                    <h4>{ __('I’m already a member of VGB family') }</h4>
                    <button
                      block="Button"
                      onClick={ handleSignIn }
                    >
                        { __('Sign in here') }
                    </button>
                </section>
            </article>
        );
    }

    renderBackToSignIn() {
        const {
            handleSignIn
        } = this.props;

        return (
            <article block="MyAccountOverlay" elem="Back">
                <section>
                    <button
                      block="Button"
                      onClick={ handleSignIn }
                    />
                </section>
            </article>
        );
    }

    renderSignIn() {
        return (
            <>
                <div block="MyAccountOverlay" elem="Header">
                    <h1>{ __('SIGN IN / SIGN UP') }</h1>
                </div>
                <div block="MyAccountOverlay" elem="Column">
                    <div block="MyAccountOverlay" elem="Column_left">
                        { this.renderSignInForm() }
                        { this.renderNewUser() }
                        <div block="MyAccountOverlay" elem="Social">
                            <h4 id="social-login">{ __('Or sign in using') }</h4>
                            { this.getSocialLogins() }
                        </div>
                    </div>
                </div>
                <div block="MyAccountOverlay" elem="Column">
                    <div block="MyAccountOverlay" elem="Column_right">
                        { this.renderNewUser() }
                    </div>
                </div>
            </>
        );
    }

    renderForgotPassword() {
        return (
            <div block="MyAccountOverlay" elem="ForgotPassword">
                <div block="MyAccountOverlay" elem="Header">
                    <h1>{ __('FORGOT PASSWORD') }</h1>
                </div>
                <div block="MyAccountOverlay" elem="Column">
                    { this.renderForgotPasswordForm() }
                </div>
                <div block="MyAccountOverlay" elem="Column">
                    { this.renderForgotPasswordAdditional() }
                </div>
            </div>
        );
    }

    renderForgotPasswordForm() {
        const {
            onForgotPasswordAttempt,
            onForgotPasswordSuccess,
            onFormError
        } = this.props;

        return (
            <Form
              key="forgot-password"
              onSubmit={ onForgotPasswordAttempt }
              onSubmitSuccess={ onForgotPasswordSuccess }
              onSubmitError={ onFormError }
            >
            <Field type="text" id="email" name="email" placeholder="Email*" validation={ ['notEmpty', 'email'] } />
            <div block="MyAccountOverlay" elem="Buttons">
              <button block="Button" type="submit">
                  { __('Send reset link') }
              </button>
            </div>
            </Form>
        );
    }

    renderForgotPasswordAdditional() {
        const {
            handleSignIn,
            handleCreateAccount
        } = this.props;

        return (
            <div block="MyAccountOverlay" elem="ForgotPasswordAdditional">
                <div block="MyAccountOverlay" elem="Member">
                    <h4>{ __('I’m already a member of VGB family') }</h4>
                    <button
                      block="Button"
                      onClick={ handleSignIn }
                    >
                    { __('Sign in here') }
                    </button>
                </div>
                <div block="MyAccountOverlay" elem="NewUser">
                    <h4 id="forgot-password-label">{ __('New User') }</h4>
                    <button
                      block="Button"
                      onClick={ handleCreateAccount }
                    >
                        { __('Create an account') }
                    </button>
                </div>
            </div>
        );
    }

    renderMyAccount() {
        const { state } = this.props;
        const { render, title } = this.renderMap[state];

        return (
            <div block="MyAccountOverlay" elem="Action" mods={ { state } }>
                <p block="MyAccountOverlay" elem="Heading">{ title }</p>
                { render() }
            </div>
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <div block="MyAccountOverlay" elem="Content">
            <Loader isLoading={ isLoading } />
                { this.renderMyAccount() }
            </div>
        );
    }
}

export default withRouter(MyAccountOverlay);
