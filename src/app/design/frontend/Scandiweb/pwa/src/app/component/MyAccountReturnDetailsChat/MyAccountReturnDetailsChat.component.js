import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountReturnDetailsChatMessages from 'Component/MyAccountReturnDetailsChatMessages';
import Field from 'Component/Field';
import Loader from 'Component/Loader';
import { closeIcon } from 'Component/Header/Header.config';
import { attachmentIcon } from './MyAccountReturnDetailsChat.config';
import './MyAccountReturnDetailsChat.style';

const ENTER_KEY_CODE = 13;

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
        // Functions
        handleTextAreaChange: PropTypes.func.isRequired,
        handleSendMessageClick: PropTypes.func.isRequired,
        handleAttachFile: PropTypes.func.isRequired,
        handleRemoveFile: PropTypes.func.isRequired,
        // other
        chatMessages: PropTypes.array.isRequired,
        isChatLoading: PropTypes.bool.isRequired,
        isSendDisabled: PropTypes.bool.isRequired,
    };

    onKeyEnterDown = (event) => {
        const { handleSendMessageClick } = this.props;

        if (event.keyCode === ENTER_KEY_CODE) {
            handleSendMessageClick();
        }
    }

    renderInputTextArea() {
        const {
            messageAreaRef,
            handleTextAreaChange
        } = this.props;

        return (
            <input
              mix={ { block: 'MyAccountReturnDetailsChat', elem: 'InputSectionTextArea' } }
              placeholder={ __('Message') }
              onChange={ handleTextAreaChange }
              onKeyDown={ this.onKeyEnterDown }
              ref={ messageAreaRef }
            />
        )
    }

    handleAttachClick = () => {
        const { fileFormRef } = this.props;

        fileFormRef.current.click();
    }

    renderInputSection() {
        const {
            isSendDisabled,
            handleSendMessageClick
        } = this.props;

        return (
            <div
              block="MyAccountReturnDetailsChat"
              elem="InputSectionWrapper"
            >
                <button
                  block="MyAccountReturnDetailsChat"
                  elem="AttachmentButton"
                  onClick={ this.handleAttachClick }
                >
                    { attachmentIcon }
                </button>
                { this.renderInputTextArea() }
                <button
                  block="Button"
                  onClick={ handleSendMessageClick }
                  disabled={ isSendDisabled }
                >
                    Send
                </button>
            </div>
        );
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
        const { fileFormRef, handleAttachFile } = this.props;

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
                      onChange={ handleAttachFile }
                      ref={ fileFormRef }
                    />
                </div>
            </div>
        );
    }
}

export default MyAccountReturnDetailsChat;
