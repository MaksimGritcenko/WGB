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
        isButtonDisabled: PropTypes.bool,
        chatMessages: PropTypes.array.isRequired,
        isChatLoading: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        isButtonDisabled: false
    };

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
              ref={ messageAreaRef }
            />
        )
    }

    renderInputSection() {
        const {
            sendMessageClick,
            isButtonDisabled
        } = this.props;

        return (
            <div
              block="MyAccountReturnDetailsChat"
              elem="InputSectionWrapper"
            >
                <button>
                    { attachmentIcon }
                </button>
                { this.renderInputTextArea() }
                <button
                  block="Button"
                  onClick={ sendMessageClick }
                  disabled={ isButtonDisabled }
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
                <h3>Message</h3>
                <div
                  block="amrma-attach-file"
                >
                    <label
                      htmlFor="amrma-attach"
                      block="amrma-label"
                    >
                        { __('Attach File') }
                    </label>
                    <input
                      type="file"
                      id="amrma-attach"
                      accept=".pdf,.png,.jpg,.jpeg,.gif"
                      multiple
                      block="amrma-attach"
                      onChange={ onFileAttach }
                      ref={ fileFormRef }
                    />
                    <input type="hidden" name="attach-files" id="amrma-attached-files" data-amrma-js="file-input"/>
                </div>
            </div>
        );
    }
}

export default MyAccountReturnDetailsChat;
