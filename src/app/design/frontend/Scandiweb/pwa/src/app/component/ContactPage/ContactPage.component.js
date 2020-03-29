import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './ContactPage.style';

import CmsBlock from 'Component/CmsBlock';
import ContactForm from 'Component/ContactForm';
import Accordion from 'Component/Accordion';
import ExpandableContent from 'Component/ExpandableContent';


class ContactPage extends PureComponent {
    static propTypes = {
        ContactInfo: PropTypes.shape({
            store_email: PropTypes.string,
            store_phone: PropTypes.string,
            store_working_hours: PropTypes.string
        }).isRequired
    };

    render() {
        const { ContactInfo: { store_email, store_phone, store_working_hours } } = this.props;
        return (
            <div block="ContactPage">
                <Accordion>
                    <div label="STAY SOCIAL">
                    <CmsBlock identifiers={ ['contact-us-social'] } />
                    </div>
                    <div label="FORM APPLICATION">
                        <ContactForm />
                    </div>
                </Accordion>
                <ExpandableContent
                  heading={ __('FORM APPLICATION') }
                  mix={ {
                      block: 'Accordion',
                      elem: 'Form'
                  } }
                >
                 <ContactForm />
                </ExpandableContent>
            </div>
        );
    }
}

export default ContactPage;
