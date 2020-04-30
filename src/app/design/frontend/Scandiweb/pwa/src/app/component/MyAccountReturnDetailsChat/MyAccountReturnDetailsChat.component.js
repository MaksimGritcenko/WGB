import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountReturnDetailsChatMessages from 'Component/MyAccountReturnDetailsChatMessages';
import Field from 'Component/Field';
import Loader from 'Component/Loader';
import { closeIcon } from 'Component/Header/Header.config';
import { attachmentIcon } from './MyAccountReturnDetailsChat.config';
import './MyAccountReturnDetailsChat.style';

class MyAccountReturnDetailsChat extends PureComponent {
    static propTypes = {
        // Refs
        fileFormRef: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.shape({ current: PropTypes.instanceOf(Element) })
        ]).isRequired,
        messageAreaRef: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.shape({ current: PropTypes.instanceOf(Element) })
        ]).isRequired,
        // Other
        onFileAttach: PropTypes.func.isRequired,
        sendMessageClick: PropTypes.func.isRequired,
        sendMessage: PropTypes.func.isRequired,
        chatMessages: PropTypes.array.isRequired,
        isChatLoading: PropTypes.bool.isRequired,
    };

    static defaultProps = {
    };

    state = {
        isSendDisabled: true,
        fileNames: {}
    }

    handleTextAreaChange = ({ target: { value } }) => {
        const { isSendDisabled } = this.state;

        if (value && isSendDisabled) this.setState({ isSendDisabled: false });
        if (!value && !isSendDisabled) this.setState({ isSendDisabled: true });
    }

    handleSendMessageClick = () => {
        const { sendMessageClick } = this.props;

        sendMessageClick();
        this.setState({ isSendDisabled: true, fileNames: {} });
    }

    handleAttachClick = () => {
        const { fileFormRef } = this.props;

        fileFormRef.current.click();
    }

    handleFileChange = () => {
        const { onFileAttach, fileFormRef: { current: { files } } } = this.props;
        const { length } = files;

        const fileNames = {};

        for (let i = 0; i < length; i++ ) {
            fileNames[i] = files[i].name;
        }

        onFileAttach();
        this.setState({ fileNames, isSendDisabled: !length });
    }

    renderInputTextArea() {
        const {
            messageAreaRef
        } = this.props;

        return (
            <textarea
              cols="30"
              rows="1"
              mix={ { block: 'MyAccountReturnDetailsChat', elem: 'InputSectionTextArea' } }
              placeholder={ __('Message') }
              onChange={ this.handleTextAreaChange }
              ref={ messageAreaRef }
            />
        )
    }

    renderInputSection() {
        const { isSendDisabled } = this.state;

        return (
            <div
              block="MyAccountReturnDetailsChat"
              elem="InputSectionWrapper"
            >
                <button
                  onClick={ this.handleAttachClick }
                >
                    { attachmentIcon }
                </button>
                { this.renderInputTextArea() }
                <button
                  block="Button"
                  onClick={ this.handleSendMessageClick }
                  disabled={ isSendDisabled }
                >
                    Send
                </button>
            </div>
        );
    }

    renderAttachment = (name, index) => {
        return (
            <div key={ index }>
                <span
                  block="MyAccountReturnDetailsChat"
                  elem="Attachment"
                >
                    { name }
                </span>
                <button
                  block="MyAccountReturnDetailsChat"
                  elem="AttachmentRemoveButton"
                >
                    { closeIcon }
                </button>
            </div>
        );
    };

    renderAttachments() {
        const { fileNames } = this.state;

        if (!Object.keys(fileNames).length) return null;

        return (
            <div
              block="MyAccountReturnDetailsChat"
              elem="AttachmentWrapper"
            >
                { attachmentIcon }
                { Object.values(fileNames).map(this.renderAttachment) }
            </div>
        )
    }

    renderContent() {
        const { chatMessages, isChatLoading } = this.props;

        return (
            <div
              block="MyAccountReturnDetailsChat"
              elem="ContentWrapper"
            >
                <Loader isLoading={ isChatLoading } />
                <MyAccountReturnDetailsChatMessages
                    chatMessages={ chatMessages }
                />
                { this.renderInputSection() }
                { this.renderAttachments() }
            </div>
        );
    }

    renderChat() {
        return (
            <>
                <h4
                  block="MyAccountReturnDetailsChat"
                  elem="Title"
                >
                    Chat
                </h4>
                { this.renderContent() }
            </>
        );
    }

    render() {
        const { fileFormRef } = this.props;

        return (
            <div block="MyAccountReturnDetailsChat">
                { this.renderChat() }
                <div
                  block="amrma-attach-file"
                >
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.gif"
                      multiple
                      block="amrma-attach"
                      onChange={ this.handleFileChange }
                      ref={ fileFormRef }
                    />
                </div>
            </div>
        );
    }
}

export default MyAccountReturnDetailsChat;
