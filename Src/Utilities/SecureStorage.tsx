import EncryptedStorage from 'react-native-encrypted-storage';
import {PERMISSION_KEY, userLoginKey} from './Constants';
import {baseUrl} from '../Services/ServiceConstatnts';

export async function storeUserSession(key: string, payload: any) {
  try {
    const storeRes = await EncryptedStorage.setItem(
      key,
      typeof payload === 'string' || typeof payload === 'number'
        ? payload.toString()
        : JSON.stringify(payload),
    );

    return storeRes;
  } catch (error) {}
}

const isJsonString = (data: string) => {
  try {
    let response = data && JSON.parse(data);
    return true;
  } catch (err) {
    return false;
  }
};

export async function retrieveUserSession(key: string) {
  try {
    const session = await EncryptedStorage.getItem(key);
    if (session !== undefined && session !== null) {
      return isJsonString(session) ? JSON.parse(session) : session;
    }
  } catch (error) {}
}

export async function removeUserSession(key: string) {
  try {
    let removeRes = await EncryptedStorage.removeItem(key);
    return removeRes;
  } catch (error) {}
}

export async function clearStorage() {
  try {
    const userData = await retrieveUserSession(userLoginKey);
    await storeUserSession(userLoginKey, {
      ...userData,
      token: '',
      base_url: baseUrl,
    });
    await removeUserSession(PERMISSION_KEY);
    // await EncryptedStorage.clear();
    return true;
  } catch (error) {
    return false;
  }
}
