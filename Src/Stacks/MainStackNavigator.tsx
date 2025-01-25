import {Linking, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {COLORS, IS_IOS} from '../Utilities/Constants';
import DrawerNavigation from '../Navigations/DrawerNavigation';
import {MainStackParamList} from '../@types/navigation';
import {getProfileService} from '../Services/Services';
import {JSONtoformdata} from '../Utilities/Methods';
import {StoreUserProfileData} from '../Store/Slices/LoginSlice';
import {useDispatch} from 'react-redux';
import {GetDeepLinkData, UseToken} from '../Utilities/StoreData';
import {setDeepLinkData} from '../Store/Slices/UtilitySlice';

const Stack = createNativeStackNavigator<MainStackParamList>();
const MainStackNavigator = () => {
  const token = UseToken();
  const dispatch = useDispatch();
  const deepLinkData = GetDeepLinkData();
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (!IS_IOS) {
      StatusBar.setBackgroundColor(COLORS.primary);
    }
  }, []);
  useEffect(() => {
    if (token) {
      handleGetProfile();
    }
  }, [token]);

  useEffect(() => {
    if (deepLinkData) {
      if (deepLinkData?.request_id) {
        const screenUrl = 'ServiceRequest';

        handlePushNotificationNavigation(
          `${screenUrl}/${deepLinkData?.request_id}`,
        );
        return;
      } else if (deepLinkData?.preventive_id) {
        const screenUrl = 'PreventiveSR';

        handlePushNotificationNavigation(
          `${screenUrl}/${deepLinkData?.request_id}`,
        );
      }
    }
  }, [deepLinkData]);

  const handlePushNotificationNavigation = (screen: string) => {
    const url = IS_IOS
      ? `mservice://${screen}`
      : `mconnect_maintenance://${screen}`;
    Linking.openURL(url)
      .then(res => {
        dispatch(setDeepLinkData(undefined));
      })
      .catch(e => {})
      .finally(() => {
        dispatch(setDeepLinkData(undefined));
      });
  };

  const handleGetProfile = () => {
    const data = {
      token: token,
    };
    getProfileService(JSONtoformdata(data)).then(response => {
      if (response?.data?.status === 1) {
        dispatch(StoreUserProfileData(response.data.data));
      }
    });
  };
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;

const styles = StyleSheet.create({});
