import {Platform, PermissionsAndroid} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from '../Components/Toast';
import {IS_IOS} from './Constants';

const handleFileName = (url: string) => {
  return url.split('/').pop() || 'downloaded_file';
};

const requestStoragePermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  return true;
};

// const downloadDocument = async (
//   url: string,
//   fileName: string,
//   onDownloaded: any,
// ) => {
//   const {config, fs} = RNFetchBlob;
//   const downloadDir = IS_IOS ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
//   const filePath = `${downloadDir}/Halcon_Documents/${Date.now()}_${fileName}`;

//   try {
//     // Ensure directory exists
//     await fs.mkdir(`${downloadDir}/Halcon_Documents`).catch(() => {});

//     // Download file manually
//     const res = await config({
//       fileCache: true,
//       path: filePath, // Save the file in storage
//     }).fetch('GET', url);

//     Toast.success('Downloaded successfully');

//     if (Platform.OS === 'ios') {
//       setTimeout(() => RNFetchBlob.ios.openDocument(res.path()), 100);
//     }

//     onDownloaded(true);
//   } catch (error) {
//     console.error('Download error:', error);
//     Toast.error('Download failed');
//     onDownloaded(false);
//   }
// };
const downloadDocument = async (
  url: string,
  fileName: string,
  onDownloaded: any,
) => {
  const {config, fs} = RNFetchBlob;
  const downloadDir = IS_IOS ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
  const filePath = `${downloadDir}/Halcon_Documents/${Date.now()}_${fileName}`;

  try {
    if (!IS_IOS) {
      await fs.mkdir(`${downloadDir}/Halcon_Documents`).catch(() => {});
    }

    const res = await config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true, // ✅ Enables Android Download Manager
        notification: true, // ✅ Show download notification
        title: fileName,
        description: 'Downloading document...',
        mime: 'application/pdf', // Change MIME type based on file type
        mediaScannable: true,
        path: filePath,
      },
    }).fetch('GET', url);

    Toast.success('Downloaded successfully');

    if (Platform.OS === 'ios') {
      setTimeout(() => RNFetchBlob.ios.openDocument(res.path()), 100);
    }

    onDownloaded(true);
  } catch (error) {
    console.error('Download error:', error);
    Toast.error('Download failed');
    onDownloaded(false);
  }
};

export const HandleDownload = async (url: string, onDownloaded: any) => {
  const fileName = handleFileName(url);
  if (!fileName) {
    Toast.error('Invalid file URL');
    return;
  }

  if (IS_IOS) {
    downloadDocument(url, fileName, onDownloaded);
    return;
  }

  const hasPermission = await requestStoragePermission();
  if (hasPermission) {
    downloadDocument(url, fileName, onDownloaded);
  } else {
    Toast.error('Storage Permission Denied');
    onDownloaded(false);
  }
};
