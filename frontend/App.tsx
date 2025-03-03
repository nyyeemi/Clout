import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './src/redux/store/store';
import {RootNavigation} from './src/navigation/RootNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Platform, StatusBar} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

const App = (): React.JSX.Element => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      SystemNavigationBar.setNavigationColor('transparent');
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
      StatusBar.setBarStyle('dark-content');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <RootNavigation />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
