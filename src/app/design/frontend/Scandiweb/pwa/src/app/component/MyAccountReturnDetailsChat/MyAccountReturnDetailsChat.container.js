import { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history } from 'Route';

import { showNotification } from 'Store/Notification';
import { ReturnDispatcher } from 'Store/Return'
import { ProductReturnQuery } from 'Query';
import { fetchMutation } from 'Util/Request';
import MyAccountReturnDetailsChat from './MyAccountReturnDetailsChat.component';

export const mapStateToProps = state => ({  });

export const mapDispatchToProps = dispatch => ({
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    sendMessage: (requestId, messageText, messageFiles) => ReturnDispatcher.sendMessage(requestId, messageText, messageFiles, dispatch),
    updateMessageList: () => ReturnDispatcher.updateMessageList(requestId, dispatch)
});

export const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});

export const encodeFormFiles = async (filesFromForm) => {
    return Object.values(filesFromForm).reduce(
        async (previousPromise, file) => {
            const acc = await previousPromise;
            acc.push({
                name: file.name,
                encoded_file: await fileToBase64(file)
            });

            return acc;
        }, Promise.resolve([])
    )
}

export class MyAccountReturnDetailsChatContainer extends PureComponent {
    static propTypes = {
        showNotification: PropTypes.func.isRequired,
        sendMessage: PropTypes.func.isRequired
    };

    state = {
        isSendButtonDisabled: true,
        isChatLoading: false,
        chatMessages: []
    };

    componentDidMount() {
        this.requestChat();
    }

    requestChat() {
        const { location: { pathname } } = history;

        this.setState({ isChatLoading: true });

        const returnId = pathname
            .split('/')[3]
            .split('&')[1]
            .split('=')[1];

        const mutation = ProductReturnQuery.getRmaChat(`${ returnId }`);

        return fetchMutation(mutation).then(
            ({ getRmaChatForRequest: { messages } }) => {
                this.setState({
                    isChatLoading: false,
                    chatMessages: messages
                });
            },
            this.onError
        );
    }

    onFileAttach() {
        const filesFromForm = this.fileFormRef.current.files || [];
        const { max_file_size } = this.props;
        console.log(max_file_size);

        Object.entries(filesFromForm).forEach(
            /** @param {File} file */
            ([index, file]) => {
                // Handle file size more than max allowed
                if (file.size > max_file_size) {
                    this.setState(() => ({ isSendButtonDisabled: true }));
                    showNotification('error', __(
                        'File %s has exceeded the maximum file size limit of %s KB',
                        file.name,
                        max_file_size
                    ));
                }
            }
        );
    }

    onMessageSuccess = () => {
        // this.fileFormRef.current.files = new FileList();
        this.messageAreaRef.current.value = "";
        this.requestChat();
    }

    sendMessageClick = async () => {
        const { requestId, sendMessage } = this.props;
        const filesFromForm = this.fileFormRef.current.files || [];
        const messageText = this.messageAreaRef.current.value;
        const messageFiles = await encodeFormFiles(filesFromForm);

        try {
            sendMessage(requestId, messageText, messageFiles);
        } catch (e) {
            showNotification('error', 'Error sending message!', e);
            return;
        }

        this.onMessageSuccess();
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
        const { chatMessages, isChatLoading } = this.state;

        return (
            <MyAccountReturnDetailsChat
              { ...this.props }
              { ...this.containerFunctions() }
              { ...this.containerProps() }
              chatMessages={ chatMessages }
              isChatLoading={ isChatLoading }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnDetailsChatContainer);
