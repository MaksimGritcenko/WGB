import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './ContactPage.style';

import ContactForm from 'Component/ContactForm';
import Accordion from 'Component/Accordion';

class ContactPage extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    render() {
        return (
            <div block="ContactPage">
                <Accordion>
                    <div label="FORM APPLICATION">
                        <ContactForm />
                    </div>
                    <div label="STAY SOCIAL">
                    <p>
                    Find us here:
                    </p>

                    </div>
                </Accordion>
            </div>
        );
    }
}

export default ContactPage;
