import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {UseToken} from './Src/Utilities/StoreData';
import {useDispatch} from 'react-redux';
import {clearStorage, retrieveUserSession} from './Src/Utilities/SecureStorage';
import {COLORS, PERMISSION_KEY, userLoginKey} from './Src/Utilities/Constants';
import Loader from './Src/Components/Loader';
import instance from './Src/Services/Axios';
import CustomStatusBar from './Src/Components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  StoreRememberData,
  StoreToken,
  StoreUserDetails,
} from './Src/Store/Slices/LoginSlice';
import Toast from './Src/Components/Toast';
import MainStackNavigator from './Src/Stacks/MainStackNavigator';
import AuthStackNavigator from './Src/Stacks/AuthStackNavigator';
import {handleStorePermissions} from './Src/Store/Slices/AccessPermissionSlice';
import {baseUrl} from './Src/Services/ServiceConstatnts';

import {deepLink} from './Src/Utilities/DeepLinking';

function App(): React.JSX.Element {
  const token = UseToken();
  const dispatch = useDispatch();
  const Stack = createNativeStackNavigator();
  const [isFetchingToken, setisFetchingToken] = useState(false);

  useEffect(() => {
    handleStoreUserDetails();
    handleStoreUserPermissions();
  }, []);

  const handleStoreUserPermissions = async () => {
    try {
      const permissions = await retrieveUserSession(PERMISSION_KEY);

      if (permissions) {
        dispatch(handleStorePermissions(permissions));
      }
    } catch (error) {}
  };

  const handleStoreUserDetails = async () => {
    setisFetchingToken(true);
    try {
      const userRes = await retrieveUserSession(userLoginKey);

      if (userRes) {
        dispatch(StoreUserDetails(userRes));
        dispatch(StoreToken(userRes?.token));
        dispatch(StoreRememberData(userRes));
      }
      if (userRes?.base_url) {
        instance.defaults.baseURL = `${userRes?.base_url}/`;
      } else {
        instance.defaults.baseURL = baseUrl;
      }
    } catch (error) {
    } finally {
      setisFetchingToken(false);
    }
  };

  instance.interceptors.response.use(async response => {
    if (response?.data?.status === -1) {
      Toast.error(response?.data?.msg);
      instance.defaults.baseURL = baseUrl;
      clearStorage();
      dispatch(StoreToken(null));
      dispatch(StoreUserDetails(null));
    }

    return response;
  });

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <CustomStatusBar
        backgroundColor={token ? COLORS.white : COLORS.secondary}
        isContentLight={false}
      />
      {isFetchingToken ? (
        <Loader
          isVisible
          color={COLORS.primary}
          backgroundColor="rgba(0,0,0,0.1)"
        />
      ) : (
        <NavigationContainer linking={deepLink}>
          {token ? (
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName="mainStack">
              <Stack.Screen name="mainStack" component={MainStackNavigator} />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="Auth" component={AuthStackNavigator} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}

export default App;
