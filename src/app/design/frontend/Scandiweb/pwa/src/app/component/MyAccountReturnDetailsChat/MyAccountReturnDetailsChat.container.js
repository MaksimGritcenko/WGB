import { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showNotification } from 'Store/Notification';
import ReturnDispatcher from 'Store/Return/Return.dispatcher';
import MyAccountReturnDetailsChat from './MyAccountReturnDetailsChat.component';

// TODO implement retrieval with RMA config
const MAX_FILE_SIZE = 1000; // KB

export const mapStateToProps = state => ({  });

export const mapDispatchToProps = dispatch => ({
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    sendMessage: (requestId, messageText, messageFiles) => ReturnDispatcher.sendMessage(requestId, messageText, messageFiles, dispatch),
    updateMessageList: () => ReturnDispatcher.updateMessageList(requestId, dispatch)
});

export class MyAccountReturnDetailsChatContainer extends PureComponent {
    static propTypes = {
        showNotification: PropTypes.func.isRequired,
        sendMessage: PropTypes.func.isRequired
    };

    state = {
        isSendButtonDisabled: true
    };

    onFileAttach() {
        const filesFromForm = this.fileFormRef.current.files || [];

        Object.entries(filesFromForm).forEach(
            /** @param {File} file */
            ([index, file]) => {
                // Handle file size more than max allowed
                if (file.size > MAX_FILE_SIZE) {
                    this.setState(() => ({ isSendButtonDisabled: true }));
                    showNotification('error', __(
                        'File %s has exceeded the maximum file size limit of %s KB',
                        file.name,
                        MAX_FILE_SIZE
                    ));
                }
            }
        );
    }

    onMessageSuccess = () => {
        const { updateMessageList } = this.props;

        this.fileFormRef.current.files = new FileList();
        this.messageAreaRef.current.value = "";
        updateMessageList();
    }

    sendMessageClick = () => {
        const { requestId, sendMessage } = this.props;
        const filesFromForm = this.fileFormRef.current.files || [];
        const messageText = this.messageAreaRef.current.value;

        const messageFiles = Object.entries(filesFromForm).reduce(
            (acc, [index, file]) => {
                acc.push({
                    // Key names matter
                    name: file.name.substr(0, file.name.lastIndexOf('.')),
                    encoded_file: btoa(file) // base 64 encoding
                });

                return acc;
            }, []
        );

        sendMessage(requestId, messageText, messageFiles)
            .then(
                onMessageSuccess,
                e => showNotification('error', 'Error sending message!', e)
            );
    }

    constructor(props) {
        super(props);

        this.fileFormRef = createRef();
        this.messageAreaRef = createRef();
    }

    containerFunctions = () => ({
        onFileAttach: this.onFileAttach.bind(this),
        sendMessageClick: this.sendMessageClick.bind(this)
    });

    containerProps = () => ({
        fileFormRef: this.fileFormRef,
        messageAreaRef: this.messageAreaRef
    });

    render() {
        return (
            <MyAccountReturnDetailsChat
              { ...this.props }
              { ...this.containerFunctions() }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnDetailsChatContainer);
