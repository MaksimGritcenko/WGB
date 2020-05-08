import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountNewReturnCustomerTable from 'Component/MyAccountNewReturnCustomerTable';
import MyAccountNewReturnAddressTable from 'Component/MyAccountNewReturnAddressTable';
import MyAccountNewReturnItemSelect from 'Component/MyAccountNewReturnItemSelect';
import Loader from 'Component/Loader';
import { closeIcon } from 'Component/Header/Header.config';
import Field from 'Component/Field';
import { encodeFormFiles } from 'Component/MyAccountReturnDetailsChat/MyAccountReturnDetailsChat.container'
import { attachmentIcon } from 'Component/MyAccountReturnDetailsChat/MyAccountReturnDetailsChat.config';

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
        shippingCover: PropTypes.object.isRequired,
        policy: PropTypes.object.isRequired
    };

    state = {
        bankDetails: {},
        selectedItems: {},
        hasItemsError: false,
        policy_is_checked: false,
        messageText: ''
    };

    handleBankDetailFieldChange = (value, id) => {
        const { bankDetails } = this.state;

        this.setState({ bankDetails: { ...bankDetails, [id]: value } });
    };

    handleSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };

    handleRequestSubmitPress = async () => {
        const { orderId, onNewRequestSubmit, fileFormRef } = this.props;
        const { selectedItems, bankDetails, messageText } = this.state;

        if (!Object.keys(selectedItems).length) return;

        const isAllFilled = !Object.values(selectedItems).find(selectedItem => (
            Object.values(selectedItem).find(item => !item) !== undefined
        ));

        if (!isAllFilled) {
            this.setState({ hasItemsError: true });
            return;
        }

        const custom_fields = Object.entries(bankDetails).map(
            ([code, value]) => ({ code, value })
        );

        const message = {
            message_text: messageText
        }

        onNewRequestSubmit({
            items: selectedItems,
            order_id: orderId,
            custom_fields,
            message
        });
    };

    handleBackPress = () => {
        const { history } = this.props;

        history.goBack();
    };

    handleTextAreaChange = (value) => {
        this.setState({ messageText: value });
    }

    setPolicyChecked = () => {
        const { policy_is_checked } = this.state;
        if (!policy_is_checked) {
            this.setState({ policy_is_checked: true });
        } else {
            this.setState({ policy_is_checked: false });
        }
    };

    renderBankDetailField = ({ code, label }, index) => {
        const { bankDetails: { [code]: value } } = this.state;

        return (
            <Field
              key={ index }
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
        const { selectedItems, policy_is_checked } = this.state;
        const isSubmitDisabled = !Object.keys(selectedItems).length;
        const { policy } = this.props;

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
        const { policy: { policy_status, policy_page_url} } = this.props;

        if (!policy_status) {
            return null;
        }

        return (
            <div block="MyAccountNewReturnPolicy">
                <Field
                  id="Policy"
                  key="Policy"
                  name="Policy"
                  value="Policy"
                  type="checkbox"
                  mix={ {
                      block: 'MyAccountNewReturnPolicy'
                  } }
                  onChange={ this.setPolicyChecked }
                />
                <div block="MyAccountNewReturnPolicy" elem="Text">
                    <p>I have read and understand the&nbsp;</p>
                    <a href={ policy_page_url }>Return Policy*</a>
                </div>
            </div>
        );
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

    renderMessageTextArea() {
        const { messageText } = this.state;

        return (
            <Field
              type="textarea"
              placeholder="Please describe your issue in details."
              id="message"
              name="message"
              mix={ {
                  block: 'MyAccountNewReturn',
                  elem: 'MessageTextArea'
              } }
              value={ messageText }
              onChange={ this.handleTextAreaChange }
            />
        )
    }

    renderAttachment = (name, index) => {
        const { handleRemoveFile } = this.props;

        return (
            <div key={ index }>
                <span
                  block="MyAccountReturnDetailsChat"
                  elem="AttachmentName"
                >
                    { name }
                </span>
                <button
                  block="MyAccountReturnDetailsChat"
                  elem="AttachmentRemoveButton"
                  onClick={ () => handleRemoveFile(name) }
                >
                    { closeIcon }
                </button>
            </div>
        );
    };

    renderAttachments() {
        const { files } = this.props;

        if (!files.length) return null;

        return (
            <div
              block="MyAccountReturnDetailsChat"
              elem="AttachmentWrapper"
            >
                { attachmentIcon }
                <div
                  block="MyAccountReturnDetailsChat"
                  elem="Attachment"
                >
                { files.map((file, index) => this.renderAttachment(file.name, index)) }
                </div>
            </div>
        )
    }

    renderMessageSection() {
        const {
            fileFormRef,
            onFileAttach
        } = this.props;

        return (
            <div>
                <h4
                  block="MyAccountNewReturn"
                  elem="MessageTitle"
                >
                    Message:
                </h4>
                <p
                  block="MyAccountNewReturn"
                  elem="MessageAdditionalInfo"
                >
                    Please do not forget to take a picture of the goods from all sides. Request without such photos may not be approved.
                </p>
                { this.renderMessageTextArea() }
                <button
                    block="MyAccountNewReturn"
                    elem="MessageAttachmentButton"
                    onClick={ this.handleAttachClick }
                >
                    { attachmentIcon }
                    Attach File
                </button>
                <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.gif"
                    multiple
                    block="amrma-attach"
                    onChange={ onFileAttach }
                    ref={ fileFormRef }
                />
                { this.renderAttachments() }
            </div>
        )
    }

    handleAttachClick = () => {
        const { fileFormRef } = this.props;

        fileFormRef.current.click();
    }

    render() {
        const {
            reasonData,
            items,
            renderPageTitle,
            contactData,
            createdAt,
            orderId = '',
            shippingCover
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
                  shippingCover={ shippingCover }
                />
                { this.renderBankDetailFields() }
                { this.renderMessageSection() }
                { this.renderPolicy() }
                { this.renderActions() }
            </div>
        );
    }
}
