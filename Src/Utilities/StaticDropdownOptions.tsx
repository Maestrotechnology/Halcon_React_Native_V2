import {IconType} from './Icons';

export type DeviceStatusProps = {
  id: number;
  name: string;
};

export type CameraOptionsprops = {
  id: number;
  icon: IconType;
  name: string;
};

export const deviceStatusOptions: DeviceStatusProps[] = [
  {
    id: 1,
    name: 'Operational',
  },
  {
    id: 2,
    name: 'Partially Operational',
  },
  {
    id: 3,
    name: 'Not Operational',
  },
];

export const priorityLevelOptions: DeviceStatusProps[] = [
  {
    id: 1,
    name: 'Low',
  },
  {
    id: 2,
    name: 'Medium',
  },
  {
    id: 3,
    name: 'High',
  },
];
export const priorityLevelOptions1: DeviceStatusProps[] = [
  {
    id: 1,
    name: 'Critical',
  },
  {
    id: 2,
    name: 'Non Critical',
  },
];
export const RequiringProblemsList: DeviceStatusProps[] = [
  {
    name: 'Yes',
    id: 1,
  },
  {
    name: 'No',
    id: 2,
  },
  {
    name: 'N/A',
    id: 3,
  },
];

export const requestStatusOptions: DeviceStatusProps[] = [
  {
    id: 1,
    name: 'Created',
  },
  {
    id: 2,
    name: 'On Going',
  },
  {
    id: 3,
    name: 'Completed',
  },
];

export const SHIFT_OPTIONS: DeviceStatusProps[] = [
  {
    id: 1,
    name: 'Day',
  },
  {
    id: 2,
    name: 'Night',
  },
];

export const MACHINE_WORK_STATUS: DeviceStatusProps[] = [
  {
    id: 1,
    name: 'Machining',
  },
  {
    id: 2,
    name: 'Pallet Change',
  },
  {
    id: 3,
    name: 'Tool Change',
  },
  {
    id: 4,
    name: 'Warm up',
  },
  {
    id: 5,
    name: 'Collision',
  },
  {
    id: 6,
    name: 'Others',
  },
];

export const TASK_DONE_BY_OPTIONS = [
  {
    id: 1,
    name: 'External',
  },
  {
    id: 2,
    name: 'Internal',
  },
];
export const SORT_OPTIONS = [
  {
    id: 1,
    name: 'Requested Date',
  },
  {
    id: 2,
    name: 'Error Occurred',
  },
];
export const APPROVAL_STATUS_OPTIONS = [
  {
    id: 1,
    name: 'Approved',
  },
  {
    id: 2,
    name: 'Rejected',
  },
];
export const cameraOptions: CameraOptionsprops[] = [
  {id: 1, icon: 'profile_option_camera', name: 'Camera'},
  {id: 2, icon: 'profile_option_gallery', name: 'Gallery'},
];

export const LIST_TYPE_MAP = {
  deviceStatusOptions: deviceStatusOptions,
  TASK_DONE_BY_OPTIONS: TASK_DONE_BY_OPTIONS,
  APPROVAL_STATUS_OPTIONS: APPROVAL_STATUS_OPTIONS,
};
export const MonthList = [
  {id: 1, name: 'JAN'},
  {id: 2, name: 'FEB'},
  {id: 3, name: 'MAR'},
  {id: 4, name: 'APR'},
  {id: 5, name: 'MAY'},
  {id: 6, name: 'JUN'},
  {id: 7, name: 'JUL'},
  {id: 8, name: 'AUG'},
  {id: 9, name: 'SEP'},
  {id: 10, name: 'OCT'},
  {id: 11, name: 'NOV'},
  {id: 12, name: 'DEC'},
];
export const MttrReportTabs = [
  {
    name: 'Year',
    id: 1,
  },
  {
    name: 'Month',
    id: 2,
  },
];
