import SourceCheckoutGuestForm from 'SourceComponent/CheckoutGuestForm/CheckoutGuestForm.component';

class CheckoutGuestForm extends SourceCheckoutGuestForm {
    get fieldMap() {
        const {
            handleEmailInput,
            handlePasswordInput,
            formId,
            isCreateUser
        } = this.props;

        const fields = {
            guest_email: {
                form: formId,
                placeholder: __('Email'),
                validation: ['notEmpty', 'email'],
                onChange: handleEmailInput,
                skipValue: true
            }
        };

        if (isCreateUser) {
            fields.guest_password = {
                form: formId,
                placeholder: __('Create Password'),
                onChange: handlePasswordInput,
                validation: ['notEmpty', 'password'],
                type: 'password',
                skipValue: true
            };
        }

        return fields;
    }
}

export default CheckoutGuestForm;
