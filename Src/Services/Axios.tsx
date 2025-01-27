import axios from 'axios';
import {baseUrl} from './ServiceConstatnts';
import {cleanFormData} from '../Utilities/GeneralUtilities';

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const PrivateInstance = axios.create({
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

instance.interceptors.request.use(async request => {
  // Clean FormData by removing empty key-value pairs if data exists
  if (
    request.data &&
    request.data._parts &&
    Array.isArray(request.data._parts)
  ) {
    request.data = cleanFormData(request.data);
  }
  return request;
});

export default instance;
