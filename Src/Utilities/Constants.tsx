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
  // darkBlue: '#1a2c41',
  gray: '#3E4751',
  blue: '#0E69B1',
  darkBlue: '#1a2c41',
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
  webBlack: '#363543',
  darkNavy: '#1E1E2F',
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

// REGEX
export const REGEX = {
  NAME_REGEX: /^[A-Za-z_ ]+$/,
  NUMBER_REGEX: /[^0-9]/g,
  SPECIAL_CHARACTER_REGEX: /^[A-Za-z0-9 ]+$/,
  MOBILE_REGEX: /^[6-9]{1}[0-9]{9}$/,
  PASSWORD_REGEX: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/,
  AMOUNT: /^[0-9][0-9]*[.]?[0-9]{0,2}$/,
  SIGN_AMOUNT: /^[-+|0-9]{1}[0-9]*[.]?[0-9]{0,2}$/,
  PASSWORD: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/,
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export const JSONHeaderType = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const INPUT_SIZE = {
  INPUT_LENGTH: 100,
  Medium: 250,
  Long: 500,
  Fifty: 50,

  TEXT_AREA_LENGTH: 1000,
  INVOICE_NUMBER: 50,
  AMOUNT_LENGTH: 11,
  Opening_Balance: 11,
  Contact: 10,
  Description: 50,
  Name: 100,
  Material_Code: 100,
  Notes: 100,
  Unit: 100,
  Machine_ID: 12,
  Serial_Number: 12,
};

export const PolicyColorList = [
  {
    backgroundColor: '#ffe4cc',
    borderColor: '#ffb38a',
    color: '##dd763e',
  },
  {
    backgroundColor: '#d8ffdb',
    borderColor: '#93ffb0',
    color: '#008022',
  },
  {
    backgroundColor: '#d8f9ff',
    borderColor: '#83eeef',
    color: '#007071',
  },
];
export type ReqularDaysTypes = {
  label: string;
  holiday_id: number;
  name: string;
  status?: number;
};

export const ReqularDays = [
  {
    label: 'Monday',
    holiday_id: 0,
  },
  {
    label: 'Tuesday',
    holiday_id: 1,
  },
  {
    label: 'Wednesday',
    holiday_id: 2,
  },
  {
    label: 'Thursday',
    holiday_id: 3,
  },
  {
    label: 'Friday',
    holiday_id: 4,
  },
  {
    label: 'Saturday',
    holiday_id: 5,
  },
  {
    label: 'Sunday',
    holiday_id: 6,
  },
];

export const PeriodicCatgory = [
  {value: 0, label: 'Days'},
  {value: 1, label: 'Weeks'},
  {value: 2, label: 'Months'},
];
