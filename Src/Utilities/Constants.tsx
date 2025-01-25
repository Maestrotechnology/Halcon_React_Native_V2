import {Dimensions, Platform, TextInputProps} from 'react-native';

export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const WINDOW_WIDTH = Dimensions.get('window').width;

// Keys
export const userLoginKey = 'maintenance_login';
export const creadentialKey = 'userCredentials';
export const ongoing = 'ongoing';
export const PERMISSION_KEY = 'maintenance_permissions';

export const imageFileType = ['xlsx', 'xls'];

export const NOTIFICATION_CHANNEL_ID = 'fcm_fallback_notification_channel';

export const IS_IOS = Platform.OS === 'ios';

export const activeOpacityValue = 0.8;

export const COLORS = {
  orange: '#F25922',
  white: '#FFF9F8',
  black: '#262626',
  gray: '#3E4751',
  blue: '#0E69B1',
  darkBlue: '#1A2C41',
  backgroundColor: '#F7E4DD',
  lightWhite: '#D1CBCE',
  hashColor: '#878484',
  green: 'green',
  red: 'red',
  borderColor: 'rgba(0, 0, 0, 0.39)',
  placeHolderColor: '#595959',
  transparentDimColor: 'rgba(0,0,0,0.5)',
  lightOrange: '#FEEAE3',
  disabledColor: 'rgba(0,0,0,0.1)',
  grey: '#D9D9D9',
  dangerColor: '#FD4D4D',
  lightBlack: 'rgba(29, 29, 29, 0.05)',
  lightGreen: '#16A085',
  taskPriorityHigh: '#FC0000',
  taskPriorityMedium: '#FFB142',
  taskPriorityLow: '#16A085',
  primary: '#FF875C',
  primaryDimColor: '#DE6C71',
  secondary: '#F6EDE9',
  secondaryDimColor: '#91949A',
  transparent: 'transparent',
  dimColor: 'rgba(207, 32, 39, 0.2)',
  authBg: '#f5f5f6',
  textSecondary: '#1A2C41',
};

export const BOX_SHADOW = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3,
  elevation: 3,
};

export const FONTSIZES = {
  extraTiny: 10,
  tiny: 12,
  small: 14,
  medium: 16,
  big: 18,
  large: 20,
  extra: 25,
};

export const outlineButtonStyle = {
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: COLORS.blue,
};

export const bigInputBoxStyle: TextInputProps = {
  maxLength: 500,
  multiline: true,
  textAlignVertical: 'top',
  style: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 15,
    color: COLORS.black,
  },
};

// Regex

export const NAME_NUMBER_REGEX = /^[A-Za-z_0-9 ]+$/;
export const SPECIAL_CHARACTER_REGEX = /^[A-Za-z_0-9.&,$@#() -  ]+$/;
export const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const NAME_REGEX = /^[A-Za-z_ ]+$/;
export const NUMBER_REGEX = /^[0-9]*$/;
export const PHONE_NUMBER_REGEX = /^[6,7,8,9]{1}[0-9]{9}$/;

//  Year
export const year = [
  'Januray',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'Augest',
  'September',
  'October',
  'November',
  'December',
];
