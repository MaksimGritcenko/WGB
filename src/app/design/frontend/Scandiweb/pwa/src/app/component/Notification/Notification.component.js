import SourceNotification, {
    ANIMATION_DURATION,
    ERROR_NOTIFICATION_LIFETIME,
    ERROR_TYPE
} from 'SourceComponent/Notification/Notification.component';
import CSS from 'Util/CSS';

export const NOTIFICATION_LIFETIME = 2500;
export default class Notification extends SourceNotification {
    componentDidMount() {
        const { notification: { msgType } } = this.props;

        if (msgType.toLowerCase() === ERROR_TYPE) {
            this.hideTimeout = setTimeout(() => this.hideNotification(), ERROR_NOTIFICATION_LIFETIME);
        } else {
            this.hideTimeout = setTimeout(() => this.hideNotification(), NOTIFICATION_LIFETIME);
        }

        CSS.setVariable(this.notification, 'animation-duration', `${ANIMATION_DURATION}ms`);
    }
}
