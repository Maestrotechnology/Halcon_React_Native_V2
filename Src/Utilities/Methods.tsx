import moment from 'moment';

export const JSONtoformdata = (object: any) => {
  const formData = new FormData();
  for (const key in object) {
    if (object[key] !== '') {
      formData.append(
        key,
        typeof object[key] === 'string' ? object[key]?.trim() : object[key],
      );
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
