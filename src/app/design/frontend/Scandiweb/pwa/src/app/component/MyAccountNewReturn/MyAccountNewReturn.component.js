import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountNewReturnCustomerTable from 'Component/MyAccountNewReturnCustomerTable';
import MyAccountNewReturnAddressTable from 'Component/MyAccountNewReturnAddressTable';
import MyAccountNewReturnItemSelect from 'Component/MyAccountNewReturnItemSelect';
import Loader from 'Component/Loader';
import Field from 'Component/Field';
import Link from 'Component/Link';

import './MyAccountNewReturn.style';
import './MyAccountNewReturnPolicy.style';

export default class MyAccountNewReturn extends PureComponent {
    static propTypes = {
        reasonData: PropTypes.object.isRequired,
        onNewRequestSubmit: PropTypes.func.isRequired,
        orderId: PropTypes.string.isRequired,
        history: PropTypes.object.isRequired,
        isLoading: PropTypes.bool.isRequired,
        items: PropTypes.array.isRequired,
        customFields: PropTypes.object.isRequired,
        renderPageTitle: PropTypes.func.isRequired,
        contactData: PropTypes.object.isRequired,
        createdAt: PropTypes.string.isRequired,
        policy: PropTypes.object.isRequired
    };

    state = {
        bankDetails: {},
        selectedItems: {},
        hasItemsError: false,
        policy_is_checked: false
    };

    handleBankDetailFieldChange = (value, id) => {
        const { bankDetails } = this.state;

        this.setState({ bankDetails: { ...bankDetails, [id]: value } });
    };

    handleSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };

    handleRequestSubmitPress = () => {
        const { orderId, onNewRequestSubmit } = this.props;
        const { selectedItems, bankDetails } = this.state;

        if (!Object.keys(selectedItems).length) return;

        const isAllFilled = !Object.values(selectedItems).find(selectedItem => (
            Object.values(selectedItem).find(item => !item) !== undefined
        ));

        if (!isAllFilled) {
            this.setState({ hasItemsError: true });

            return;
        }

        const custom_fields = Object.entries(bankDetails).map(([code, value]) => ({ code, value }));

        onNewRequestSubmit({
            items: selectedItems,
            order_id: orderId,
            custom_fields
        });
    };

    handleBackPress = () => {
        const { history } = this.props;

        history.goBack();
    };

    setPolicyChecked = () => {
        const { policy_is_checked } = this.state;
        if (!policy_is_checked) {
            this.setState({ policy_is_checked: true });
        } else {
            this.setState({ policy_is_checked: false });
        }
    };

    renderBankDetailField = ({ code, label }) => {
        const { bankDetails: { [code]: value } } = this.state;

        return (
            <Field
              type="text"
              placeholder={ label }
              id={ code }
              name={ code }
              mix={ {
                  block: 'MyAccountNewReturn',
                  elem: 'BankDetailField'
              } }
              onChange={ value => this.handleBankDetailFieldChange(value, code) }
              value={ value }
              validation={ ['notEmpty'] }
            />
        );
    };

    isButtonEnabled() {
        const { selectedItems } = this.state;
        const isSubmitDisabled = !Object.keys(selectedItems).length;
        const { policy_is_checked } = this.state;
        const { policy } = this.props;

        if (!policy.policy_status) {
            if (!isSubmitDisabled) {
                return false;
            }
        }

        if (isSubmitDisabled || !policy_is_checked) {
            return true;
        }

        return false;
    }

    renderBankDetailFields() {
        const { customFields: { fields = [], label } } = this.props;

        if (!fields.length) return null;

        return (
            <div>
                <h4
                  block="MyAccountNewReturn"
                  elem="BankDetailTitle"
                >
                    { label }
                </h4>
                { fields.map(this.renderBankDetailField) }
            </div>
        );
    }

    renderPolicy() {
        const { policy } = this.props;
        if (policy.policy_status) {
            return (
                <div block="MyAccountNewReturnPolicy">
                <Field
                  id="Policy"
                  name="Policy"
                  value="Policy"
                  type="checkbox"
                  mix={ {
                      block: 'MyAccountNewReturnPolicy'
                  } }
                  checked={ this.setPolicyChecked }
                  onChange={ this.setPolicyChecked }
                />
                    <div block="MyAccountNewReturnPolicy" elem="Text">
                        <p>I have read and understand the&nbsp;</p>
                        <Link to={ policy.policy_page_url }>Return Policy*</Link>
                    </div>
                </div>
            );
        }

        return (<></>);
    }

    renderActions() {
        return (
            <div
              block="MyAccountNewReturn"
              elem="Actions"
            >
                <button
                  block="Button"
                  onClick={ this.handleRequestSubmitPress }
                  disabled={ this.isButtonEnabled() }
                >
                    { __('SUBMIT REQUEST') }
                </button>
                <button
                  block="Button"
                  mods={ { isHollow: true } }
                  onClick={ this.handleBackPress }
                >
                    { __('CANCEL') }
                </button>
            </div>
        );
    }

    renderLoader() {
        const { isLoading } = this.props;
        return <Loader isLoading={ isLoading } />;
    }

    render() {
        const {
            reasonData,
            items,
            renderPageTitle,
            contactData,
            createdAt,
            orderId = ''
        } = this.props;
        const { hasItemsError } = this.state;

        return (
            <div block="MyAccountNewReturn">
                { this.renderLoader() }
                { renderPageTitle(orderId) }
                <div
                  block="MyAccountNewReturn"
                  elem="CustomerAndAddressBlocks"
                >
                    <MyAccountNewReturnCustomerTable />
                    <MyAccountNewReturnAddressTable />
                </div>
                <MyAccountNewReturnItemSelect
                  onItemChange={ this.handleSelectedItemsChange }
                  reasonData={ reasonData }
                  items={ items }
                  hasError={ hasItemsError }
                  contactData={ contactData }
                  createdAt={ createdAt }
                />
                { this.renderBankDetailFields() }
                { this.renderPolicy() }
                { this.renderActions() }
            </div>
        );
    }
}
