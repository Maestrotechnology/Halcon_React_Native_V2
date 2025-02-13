import moment from 'moment';
import {ObjectType} from '../Components/types';
import store from '../Store/Store/Index';
import {openLoader} from '../Store/Slices/LoaderSlice';

export const ConvertJSONtoFormData = (obj: ObjectType, isFilter = true) => {
  const formData = new FormData();
  for (const key in obj) {
    const value = obj[key];
    if (
      !isFilter ||
      (value !== undefined && value !== null && value !== '' && value)
    ) {
      formData.append(key, typeof value === 'string' ? value.trim() : value);
    }
  }

  return formData;
};
export const secondsToMinutesAndSeconds = (millis: number) => {
  var minutes = Math.floor(millis / 60);
  var seconds = (millis % 60).toFixed(0);
  return minutes + ':' + (parseInt(seconds) < 10 ? '0' : '') + seconds;
};

export const secondsToHourMinutes = (time: string) => {
  const hours = Math.floor(moment.duration(time, 'seconds').asHours());
  const minutes = moment.duration(time, 'seconds').get('minutes');

  return {
    hours: hours?.toString()?.padStart(2, '0'),
    minutes: minutes?.toString()?.padStart(2, '0'),
  };
};
export const FilterValidObj = (obj: ObjectType) => {
  const finalObj: ObjectType = {};
  for (const key in obj) {
    const value = obj[key];

    if (value !== undefined && value !== null && value !== '') {
      finalObj[key] = typeof value === 'string' ? value.trim() : value;
    }
  }
  return finalObj;
};
export const isLoading = (isLoading: boolean) => {
  return store.dispatch(openLoader(isLoading));
};
