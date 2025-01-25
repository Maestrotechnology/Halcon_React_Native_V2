import {StatusBar, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {COLORS, IS_IOS} from '../Utilities/Constants';
import Login from '../Screens/AuthScreens/Login';
import ForgotPassword from '../Screens/AuthScreens/ForgotPassword';
import OtpVerification from '../Screens/AuthScreens/OtpVerification';
import ResetPassword from '../Screens/AuthScreens/ResetPassword';

const AuthStackNavigator = () => {
  const Stack = createNativeStackNavigator();
  useEffect(() => {
    if (!IS_IOS) {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(COLORS.authBg);
    }
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;

const styles = StyleSheet.create({});
