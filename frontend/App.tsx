import React, {useEffect} from 'react';
import {Platform, StatusBar, useColorScheme} from 'react-native';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';

import {NotificationListener} from './src/components/NotificationListener/NotificationListener';
import {toastConfig} from './src/components/NotificationListener/toastConfig';
import {MyDarkTheme} from './src/components/ui/themes';
import {RootNavigation} from './src/navigation/RootNavigation';
import store from './src/redux/store/store';

const App = (): React.JSX.Element => {
  const scheme = useColorScheme();
  useEffect(() => {
    if (Platform.OS === 'android') {
      SystemNavigationBar.setNavigationColor('transparent');
    }
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer
            theme={scheme === 'dark' ? MyDarkTheme : DefaultTheme}>
            <BottomSheetModalProvider>
              <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
              />
              <RootNavigation />
              <NotificationListener />
              <Toast config={toastConfig} />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
