import Toast from '../Components/Toast';
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import {AlertBoxProps} from '../@types/general';
import {IS_IOS, REGEX} from './Constants';
import RNFetchBlob, {RNFetchBlobConfig} from 'rn-fetch-blob';
import {getCatchMsgType} from './Types';
import moment from 'moment';

type DownloadTypeProps = 'latest_app' | 'pdf_download';

export const getCatchMessage = (err: any) => {
  try {
    let errorMsg = '';
    if (err?.response?.data?.detail) {
      errorMsg = Array.isArray(err?.response?.data?.detail)
        ? err?.response?.data?.detail?.[0]?.msg
        : err?.response?.data?.detail;
    } else {
      errorMsg = 'Network Error';
    }
    Toast.error(errorMsg);
  } catch (error) {}
};

export const getTrimedText = (str: string, len: number = 20) => {
  if (str) {
    return str.length > len ? str.substring(0, len) + '...' : str;
  }
  return '';
};

export const cancelApi = (controller: AbortController | null) => {
  if (controller) {
    controller.abort();
  }
};

export const handleOpenPlayStore = () => {
  const appStoreUrl = 'market://details?id=com.rkecran';
  Linking.openURL(appStoreUrl)
    .then(data => {})
    .catch(error => {});
};

export const secureVerifyText = (text: string) => {
  return text
    ? `${text?.slice(0, 2)}.....${
        text?.includes('@') ? '@gmail.com' : text?.slice(-3)
      }`
    : '';
};

export const AlertBox = ({
  title = '',
  alertMsg = 'Are you sure want to logout?',
  positiveBtnText = 'Ok',
  negativeBtntext = 'Cancel',
  onPressPositiveButton,
  onPressNegativeButton,
}: AlertBoxProps) => {
  Alert.alert(title, alertMsg, [
    {
      text: negativeBtntext,
      onPress: onPressNegativeButton,
    },
    {
      text: positiveBtnText,
      onPress: onPressPositiveButton,
    },
  ]);
};

export const getFileNameFromUrl = (url: string = '') => {
  if (url) {
    return url.split('/').pop() ?? '';
  }
  return '';
};

export const generateUniqueId = () => {
  return Math.floor(Math.random() * 100);
};

const downloadDocument = async (
  url: string,
  fileName: string,
  download_type: DownloadTypeProps,
  setisLoading: (val: boolean) => void,
) => {
  Toast.normal(`${fileName} Downloading...`);
  const {config, fs} = RNFetchBlob;
  let downloadDir = IS_IOS ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
  let downloadDirName =
    download_type === 'latest_app' ? 'Maestro Apps' : 'Maestro Documents';
  let options: RNFetchBlobConfig = {
    fileCache: true,
    path: downloadDir + `/${downloadDirName}/` + fileName,
    addAndroidDownloads: {
      //Related to the Android only
      useDownloadManager: true,
      notification: true,
      path: downloadDir + `/${downloadDirName}/` + fileName,
      description: `${
        download_type === 'latest_app' ? 'App' : 'Document'
      } Download`,
    },
  };

  config(options)
    .fetch('GET', url)
    .then((res: any) => {
      if (download_type === 'latest_app') {
        // RNExitApp.exitApp();
      }
      if (IS_IOS) {
        RNFetchBlob.ios.openDocument(
          downloadDir + '/Maestro ERP Documents/' + fileName,
        );
      }
      Toast.success('Download Successfully');
    })
    .catch(e => {
      Toast.error(e.message);
    })
    .finally(() => {
      if (setisLoading) setisLoading(false);
    });
};

export const downloadPdf = (
  url: string,
  fileName: string,
  download_type: DownloadTypeProps = 'pdf_download',
  setisLoading: (val: boolean) => void,
) => {
  if (IS_IOS) {
    downloadDocument(url, fileName, download_type, setisLoading);
  } else {
    try {
      if (IS_IOS || (Platform.OS === 'android' && Platform.Version >= 33)) {
        downloadDocument(url, fileName, download_type, setisLoading);
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'Maestro ERP needs storage access to download files.',
            buttonPositive: 'Allow',
            buttonNegative: 'Denied',
          },
        )
          .then(granted => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              downloadDocument(url, fileName, download_type, setisLoading);
            } else {
              Toast.error('Storage Permission Denied');
            }
          })
          .catch(e => {
            Toast.error(e.message);
          });
      }
    } catch (err: any) {
      Toast.error(err.message);
    }
  }
};

const isValidContent = (value: any) => {
  const type = typeof value;

  const unprocessableEntries = [
    null,
    undefined,
    '',
    'false',
    false,
    'undefined',
    'null',
  ];
  switch (type) {
    case 'object':
      return Array.isArray(value)
        ? value?.length > 0
        : Object.keys(value)?.length > 0;
    default:
      const val = type === 'string' ? value?.trim() : value;
      return !unprocessableEntries.includes(val);
  }
};
export const cleanFormData = (formData: any) => {
  const cleanedFormData: any = new FormData();

  // Check if the formData has _parts
  if (formData?._parts) {
    for (const [key, value] of formData._parts) {
      // Check if the value is not empty
      if (isValidContent(value)) {
        cleanedFormData.append(
          key,
          typeof value === 'string' ? value?.trim() : value,
        );
      }
    }
  }

  return cleanedFormData?._parts?.length ? cleanedFormData : undefined;
};

export function getCatchMsg(error: getCatchMsgType) {
  if (error?.response?.data) {
    if (typeof error?.response?.data?.detail === 'string') {
      Toast.error(error?.response?.data?.detail);
    } else if (error?.response?.data?.detail) {
      if (Array.isArray(error?.response?.data?.detail)) {
        Toast.error(error?.response?.data?.detail?.[0]?.msg);
      } else {
        Toast.error(error?.response?.data?.detail?.msg);
      }
    }
  } else if (error.response) {
    if (error.response.status === 404) {
      Toast.error('The requested resource does not exist or has been deleted');
    } else if (error.response.status === 401) {
      Toast.error('Please login to access this resource!');
    } else if (error.response.status === 500) {
      Toast.error('Internal Server Error !');
    } else {
      Toast.error('An error occurred');
    }
  } else {
    Toast.error('Something went wrong!');
  }
}

export const CHAR_AND_SPACE = (data: string): string => {
  return data.replace(REGEX.NAME_REGEX, '');
};
export const PREVENT_EMOJI = (data: string) => {
  return data.replace(
    /([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g,
    '',
  );
};
export const removeNonAlphanumeric = (str: string) => {
  const regex = /[^a-zA-Z0-9]/g;
  return str.replace(regex, ''); // Replaces all non-alphanumeric characters
};
export const NUMBER_VALIDATION = (value: string) => {
  return value.replace(REGEX.NUMBER_REGEX, '');
};
export const RESTRICKT_SPACE = (data: string): string => {
  return data.trim();
};
export const converttoHours = (timeInHour: any) => {
  return Math.round(timeInHour / 60);
};
export const converttoMinutes = (timeInHour: any) => {
  return Math.floor(timeInHour * 60);
};
export const getMonthName = () => {
  const date = new Date();
  return {
    current: date.toLocaleString('default', {month: 'long'}),
    previous: new Date(date.setMonth(date.getMonth() - 1)).toLocaleString(
      'default',
      {month: 'long'},
    ),
  };
};

export const extractIds = (data: any, filteredIds: any) => {
  data.forEach((item: any) => {
    if (item.status === 1) {
      filteredIds.push(item.id);
    }
    if (item.child) {
      extractIds(item.child, filteredIds);
    }
  });
};

export const getCurrentMonthDates = () => {
  return {
    start_date: moment()
      .subtract(1, 'month')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss'),
    end_date: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  };
};
