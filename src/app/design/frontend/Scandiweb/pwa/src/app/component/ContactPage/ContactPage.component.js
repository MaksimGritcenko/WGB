import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CmsBlock from 'Component/CmsBlock';
import ContactForm from 'Component/ContactForm';
import ContactExpandableContent from 'Component/ContactExpandableContent';

import './ContactPage.style';

class ContactPage extends PureComponent {
    static propTypes = {
        ContactInfo: PropTypes.shape({
            store_email: PropTypes.string,
            store_phone: PropTypes.string,
            store_working_hours: PropTypes.string
        }).isRequired,
        updateBreadcrumbs: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired
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
            name: 'FAVORITES',
            title: null
        });
    }

    render() {
        const { ContactInfo: { store_email, store_phone, store_working_hours } } = this.props;
        return (
            <div block="ContactPage">
                 <div block="ContactPage" elem="Title">
                { __('GET IN TOUCH WITH VGB') }
                 </div>
                <div block="ContactPage" elem="Group">
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
                </div>
                <div block="ContactPage" elem="Group">
                    <ContactExpandableContent
                      heading={ __('STAY SOCIAL') }
                      mix={ { block: 'Social' } }
                    >
                        <CmsBlock identifiers={ ['contact-us-social'] } />
                    </ContactExpandableContent>
                    <ContactExpandableContent
                      heading={ __('FORM APPLICATION') }
                      mix={ { block: 'Form' } }
                    >
                    <ContactForm />
                    </ContactExpandableContent>
                </div>
            </div>
        );
    }
}

export default ContactPage;
