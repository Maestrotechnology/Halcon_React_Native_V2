import {StyleSheet} from 'react-native';
import ToastMessage from 'react-native-toast-message';

const hideToast = () => {
  ToastMessage.hide();
};

const toastMessage = (
  message?: string,
  toastType?: 'success' | 'error' | 'normal',
  visibilityTime?: number,
) => {
  ToastMessage.show({
    type: 'tomatoToast',
    text1: message,
    visibilityTime: visibilityTime ?? 3000,
    props: {toastType},
  });
};

const Toast = {
  success: (message = '', visibilityTime = 3000) =>
    toastMessage(message, 'success', visibilityTime),
  error: (message = '', visibilityTime = 3000) =>
    toastMessage(message, 'error', visibilityTime),
  normal: (message = '', visibilityTime = 3000) =>
    toastMessage(message, 'normal', visibilityTime),
};

export default Toast;

const styles = StyleSheet.create({});
