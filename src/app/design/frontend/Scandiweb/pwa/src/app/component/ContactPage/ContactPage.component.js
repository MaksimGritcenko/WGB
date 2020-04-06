import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'Component/Loader';
import CmsBlock from 'Component/CmsBlock';
import ContactForm from 'Component/ContactForm';
import ContactExpandableContent from 'Component/ContactExpandableContent';
import { WHITE } from 'Component/Header';

import './ContactPage.style';

class ContactPage extends PureComponent {
    static propTypes = {
        ContactInfo: PropTypes.shape({
            store_email: PropTypes.string,
            store_phone: PropTypes.string,
            store_working_hours: PropTypes.string
        }).isRequired,
        updateBreadcrumbs: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
        isLoading: PropTypes.bool
    };

    static defaultProps = {
        isLoading: false
    };

    componentDidMount() {
        this.updateBreadcrumbs();
        this.updateHeaderMod();
    }

    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const breadcrumbs = [
            {
                url: '/contact-us',
                name: __('Contact Us')
            },
            {
                url: '/',
                name: __('Home')
            }
        ];

        updateBreadcrumbs(breadcrumbs);
    }

    updateHeaderMod() {
        const { setHeaderState } = this.props;

        setHeaderState({
            name: WHITE,
            title: null
        });
    }

    renderPhone() {
        const { ContactInfo: { store_phone, store_working_hours } } = this.props;
        return (
            <ContactExpandableContent
              heading={ __('CALL CENTER VAGABOND') }
              mix={ { block: 'Phone' } }
            >
            <p block="ContactExpandableContent" elem="SubContent">
                { store_phone }
            </p>
                <p block="ContactExpandableContent" elem="SubContent">
                { store_working_hours }
                </p>
            </ContactExpandableContent>
        );
    }

    renderEmail() {
        const { ContactInfo: { store_email } } = this.props;
        return (
            <ContactExpandableContent
              heading={ __('E-MAIL SUPPORT') }
              mix={ { block: 'Email' } }
            >
            <p block="ContactExpandableContent" elem="SubContent">
                Send us an e-mail and we will contact you ASAP
            </p>
            <p block="ContactExpandableContent" elem="MainContent">
                { store_email }
            </p>
            </ContactExpandableContent>
        );
    }

    renderSocial() {
        return (
            <ContactExpandableContent
              heading={ __('STAY SOCIAL') }
              mix={ { block: 'Social' } }
            >
              <p block="ContactExpandableContent" elem="SubContent">
              { __('Find us here:') }
              </p>
              <CmsBlock identifiers={ ['contact-us-social'] } />
            </ContactExpandableContent>
        );
    }

    renderForm() {
        return (
            <ContactExpandableContent
              heading={ __('FORM APPLICATION') }
              mix={ { block: 'Form' } }
            >
            <p block="ContactExpandableContent" elem="SubContent">
                Complete the form and we will contact you ASAP:
            </p>
            <ContactForm />
            </ContactExpandableContent>
        );
    }

    render() {
        const { isLoading } = this.props;
        return (
            <div block="ContactPage">
                <Loader isLoading={ isLoading } />
                <div block="ContactPage" elem="Title">
                   { __('GET IN TOUCH WITH VGB') }
                </div>
                <div block="ContactPage" elem="Group">
                    { this.renderPhone() }
                    { this.renderEmail() }
                </div>
                <div block="ContactPage" elem="Group">
                    { this.renderSocial() }
                    { this.renderForm() }
                </div>
            </div>
        );
    }
}

export default ContactPage;
