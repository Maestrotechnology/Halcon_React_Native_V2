/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider as StoreProvider} from 'react-redux';
import store from './Src/Store/Store/Index';
import ToastContainer from 'react-native-toast-message';
import ToastConfig from './Src/Utilities/ToastConfig';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const AppProvider = () => {
  return (
    <>
      <StoreProvider store={store}>
        <GestureHandlerRootView style={{flex: 1}}>
          <BottomSheetModalProvider>
            <App />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </StoreProvider>
      <ToastContainer
        visibilityTime={3000}
        config={ToastConfig}
        topOffset={40}
        bottomOffset={60}
      />
    </>
  );
};
AppRegistry.registerComponent(appName, () => AppProvider);
