import SourceMyAccountDashboard from 'SourceComponent/MyAccountDashboard/MyAccountDashboard.component';

class MyAccountDashboard extends SourceMyAccountDashboard {
    renderNoDefaultAddressConfigured(name) {
        return (
            <div key={ name }>
                <p block="MyAccountDashboard" elem="Info">{ __('No default %s address configured.', name) }</p>
                { this.renderLinkToAddressBook() }
            </div>
        );
    }
}

export default MyAccountDashboard;
