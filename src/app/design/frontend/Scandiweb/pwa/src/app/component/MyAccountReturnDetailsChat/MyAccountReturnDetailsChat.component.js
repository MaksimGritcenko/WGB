import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountReturnDetailsChatMessages from 'Component/MyAccountReturnDetailsChatMessages';
import Field from 'Component/Field';
import Loader from 'Component/Loader';
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
        isSendDisabled: true
    }

    handleTextAreaChange = ({ target: { value } }) => {
        const { isSendDisabled } = this.state;

        if (value && isSendDisabled) this.setState({ isSendDisabled: false });
        if (!value && !isSendDisabled) this.setState({ isSendDisabled: true });
    }

    handleSendMessageClick = () => {
        const { sendMessageClick } = this.props;

        sendMessageClick();
        this.setState({ isSendDisabled: true });
    }

    handleAttachClick = () => {
        const { fileFormRef } = this.props;

        fileFormRef.current.click();
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
            </div>
        );
    }

    renderSOme() {
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
        const {
            onFileAttach,
            fileFormRef,
            sendMessageClick,
            isButtonDisabled,
            messageAreaRef
        } = this.props;

        return (
            <div block="MyAccountReturnDetailsChat">
                { this.renderSOme() }
                <div
                  block="amrma-attach-file"
                >
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.gif"
                      multiple
                      block="amrma-attach"
                      onChange={ onFileAttach }
                      ref={ fileFormRef }
                    />
                </div>
            </div>
        );
    }
}

export default MyAccountReturnDetailsChat;
