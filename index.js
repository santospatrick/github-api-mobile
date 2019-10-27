import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src';
import { name as appName } from './app.json';

if (__DEV__) {
    import('./src/config/ReactotronConfig').then(() =>
        console.log('Reactotron Configured')
    );
}

AppRegistry.registerComponent(appName, () => App);
