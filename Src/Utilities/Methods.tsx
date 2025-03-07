import moment from 'moment';
import {ObjectType} from '../Components/types';
import store from '../Store/Store/Index';
import {openLoader} from '../Store/Slices/LoaderSlice';
import StyledText from '../Components/StyledText';
import {COLORS, FONTSIZES} from './Constants';

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

export const FormateDate = (date: Date, type: 'date' | 'datetime' | 'time') => {
  const formatMap: Record<typeof type, string> = {
    date: 'YYYY-MM-DD',
    datetime: 'YYYY-MM-DD HH:mm:ss',
    time: 'HH:mm:ss',
  };

  return moment(date).format(formatMap[type]);
};

export const RemoveSpace = (value: any) => {
  return value.split(' ').join('');
};

export const ConvertNumbertoString = (value: any) => {
  return value ? (typeof value === 'number' ? value?.toString() : value) : '';
};

export const AlertMessageBox = () => {
  return (
    <StyledText
      style={{
        backgroundColor: '#fffbe6',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        fontSize: FONTSIZES.tiny,
        borderWidth: 1,
        borderColor: '#ffe58f',
        marginBottom: 5,
      }}>
      Change Request status to Ongoing for Update this request
    </StyledText>
  );
};

export const selectPeriodicCategory = (value: number) => {
  switch (value) {
    case 0:
      return 'Days';
    case 1:
      return 'Weeks';
    case 2:
      return 'Months';
    default:
      return '';
  }
};
