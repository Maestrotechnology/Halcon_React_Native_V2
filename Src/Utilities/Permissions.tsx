import {PermissionsAndroid, Platform} from 'react-native';
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
    if (IS_IOS || (Platform.OS === 'android' && Platform.Version >= 33)) {
      return true;
    } else {
      const granted = await PermissionsAndroid.requestMultiple([
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
      ])
        .then(res => {
          if (
            res['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
            res['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
          ) {
            return true;
          } else {
            return false;
          }
        })
        .catch(err => {
          return false;
        });
      return granted;
    }
  } catch (error) {
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
