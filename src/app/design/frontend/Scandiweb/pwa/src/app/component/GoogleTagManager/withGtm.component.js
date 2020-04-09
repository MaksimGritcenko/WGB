import GoogleTagManagerRouteWrapperComponent from './GoogleTagManagerRouteWrapper.component';

export default (WrappableComponent, gtmRoute) => props => (
    <GoogleTagManagerRouteWrapperComponent route={ gtmRoute }>
        <WrappableComponent { ...props } />
    </GoogleTagManagerRouteWrapperComponent>
);
