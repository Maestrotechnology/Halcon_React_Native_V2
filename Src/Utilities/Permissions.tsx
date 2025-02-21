import {Linking, PermissionsAndroid, Platform} from 'react-native';
import {IS_IOS} from './Constants';
import Toast from '../Components/Toast';
// import messaging from "@react-native-firebase/messaging";

export async function androidCameraAccessPermission() {
  if (IS_IOS) {
    return true;
  }
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Maestro Maintenance App Camera Permission',
        message: 'Maestro Maintenance App needs access to your camera',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Toast.error('Camera permission denied');
      return false;
    }
  } catch (err) {
    return false;
  }
}

export async function getIsGrantedGalleryPermission() {
  try {
    if (Platform.OS === 'ios') {
      return true; // No need to request permissions for iOS & Android 13+
    }

    const permissions = [
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ];

    const grantedPermissions = await PermissionsAndroid.requestMultiple(
      permissions,
    );

    if (
      grantedPermissions[
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      ] === 'granted' &&
      grantedPermissions[
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ] === 'granted'
    ) {
      return true;
    }

    // Handle "never_ask_again" scenario
    if (
      grantedPermissions[
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ] === 'never_ask_again'
    ) {
      console.warn(
        'Permission permanently denied. Please enable it from settings.',
      );
      Linking.openSettings(); // Open device settings for the user
    }

    return false;
  } catch (error) {
    console.error('Error requesting gallery permissions:', error);
    return false;
  }
}

export const getIsGrantedNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
        .then(res => {
          if (res === 'granted') {
            return true;
          } else {
            return false;
          }
        })
        .catch(err => {
          return false;
        });
    } catch (error) {}
  } else {
    // const authStatus = await messaging().requestPermission();
    // const enabled =
    // authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    // authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    // if (enabled) {
    //   return true;
    // }
    return false;
  }
};
