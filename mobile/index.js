/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {registerNotificationHandlers} from './src/utils/registerNotificationHandlers';

registerNotificationHandlers();

AppRegistry.registerComponent(appName, () => App);
