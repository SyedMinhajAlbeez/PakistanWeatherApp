import { Platform } from 'react-native';

// Runtime require to pick the correct platform implementation
const impl: any = Platform.OS === 'web'
  ? require('./PlatformMapView.web')
  : require('./PlatformMapView.native');

const MapView = impl.default;
const Marker = impl.Marker;

export default MapView;
export { Marker };
