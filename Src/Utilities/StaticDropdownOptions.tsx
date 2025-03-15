import {getMonthName} from './GeneralUtilities';
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
    name: 'Pending',
  },
  {
    id: 2,
    name: 'On Going',
  },
  {
    id: 3,
    name: 'Completed',
  },
  {
    id: 4,
    name: 'Over Due',
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
export const TaskDurationList = [
  {
    name: 'Days',
    id: 1,
    title: 'Daily',
  },
  {
    name: 'Weeks',
    id: 2,
    title: 'Weekly',
  },
  {
    name: 'Months',
    id: 3,
    title: 'Monthly',
  },
];

export const ReportLegentOptions = [
  {
    label: 'Total',
    color: '#017efa',
  },
  {
    label: 'Completed',
    color: '#4ab58e',
  },
  {
    label: 'Ongoing',
    color: '#fab101',
  },
];
export const HoursList = new Array(24)
  .fill('')
  ?.map((ele, index) => ({name: index + 1, id: index + 1}));

export const DivisionListRowData = [
  {key: 'description', label: 'Division Name'},
  {key: 'created_at', label: 'Created at', type: 'date'},
];

export const HolidayListRowData = [
  {key: 'holiday_date', label: 'Date'},
  {key: 'reason', label: 'Reason'},
];

export const MachineListRowData = [
  {key: 'equipment_id', label: 'Machine ID'},
  {key: 'machine_name', label: 'Machine Name'},
  {key: 'division_description', label: 'Division'},
];

export const TaskListRowData = [
  {key: 'task_name', label: 'Task Name'},
  {key: 'control_key', label: 'Control Key'},
];

export const WorkCenterListRowData = [
  {key: 'name', label: 'Work Center Name'},
  {key: 'created_at', label: 'Created at', type: 'date'},
];

export const MeterialListRowData = [
  {key: 'name', label: 'Name'},
  {key: 'description', label: 'Description'},
  {key: 'unit_id', label: 'Unit'},
  {key: 'created_at', label: 'Start Date'},
];

export const ApprovalStatusListRowData = [
  {key: 'role_name', label: 'Role Id'},
  {
    key: 'action',
    label: 'Status',
    ListType: 'APPROVAL_STATUS_OPTIONS',
  },
  {key: 'updated_by', label: 'Updated By'},
  {key: 'comment', label: 'Comment'},
];

export const AssignTaskListRowData = [
  {
    key: 'task_name',
    label: '',
  },
];

export const PreventiveListRowData = [
  {key: 'equipment_id', label: 'Machine Id'},
  {key: 'machine_name', label: 'Machine Name'},
  {key: 'work_center_name', label: 'Work Center'},
  {key: 'division_description', label: 'Division Id'},
  {key: 'schedule_date', label: 'Request Date'},
  {key: 'request_status_name', label: 'Request Status'},
];

export const PreventiveTaskRowData = [{key: 'task_name', label: 'Task Name'}];

export const TaskDetailsRowData = [
  {key: 'task_name', label: 'Task Name'},
  {key: 'created_at', label: 'Start Date'},
  {key: 'updated_at', label: 'End Date'},
];

export const SpindleReportRowData = [
  {key: 'machine_id', label: 'Machine Id'},
  {key: 'machine_name', label: 'Machine Name'},
  {key: 'work_center_name', label: 'Work Center'},
  {key: 'division_description', label: 'Division'},
  {
    key: 'previous_month_consumed_hour',
    label: `${getMonthName()?.previous} Running Hours`,
    type: 'converttoHours',
  },
  {
    key: 'previous_month_spindle_hr',
    label: `${getMonthName()?.previous} Total Running Hours`,
    type: 'converttoHours',
  },
  {
    key: 'current_month_spindle_hr',
    label: `${getMonthName()?.current} Total Running Hours`,
    type: 'converttoHours',
  },
];

export const DowntimeSrRowData = [
  {key: 'equipment_id', label: 'Machine Id'},
  {key: 'machine_name', label: 'Machine Name'},
  {key: 'division_description', label: 'Division Id'},
  {key: 'machine_status_name', label: 'Machine Status'},
  {key: 'date_of_error_occur', label: 'Error Occurred At'},
  {key: 'requested_date', label: 'Request Date', type: 'date'},
  {key: 'completed_date', label: 'Completed Date'},
  {key: 'request_status_name', label: 'Request Status'},
];

export const DownTimeTaskDetailsRowData = [
  {key: 'intervention_start_date', label: 'Intervention Start Date'},
  {key: 'intervention_end_date', label: 'Intervention End Date'},
  {
    key: 'start_status',
    label: 'Machine Status at Task Start',
    ListType: 'deviceStatusOptions',
  },
  {
    key: 'end_status',
    label: 'Machine Status at Task End',
    ListType: 'deviceStatusOptions',
  },
  {
    key: 'task_done_by',
    label: 'Task Done By',
    ListType: 'TASK_DONE_BY_OPTIONS',
  },
];

export const AccessRoleListRowData = [
  {key: 'role_name', label: 'Role Name'},
  {key: 'role_description', label: 'Description'},
];

export const UserListRowData = [
  {key: 'holiday_date', label: 'Date'},
  {key: 'reason', label: 'Reason'},
];

export const TableRowDatas = {
  DIVISION: DivisionListRowData,
  HOLIDAY: HolidayListRowData,
  MACHINE: MachineListRowData,
  TASK: TaskListRowData,
  WORK_CENTER: WorkCenterListRowData,
  METERIAL: MeterialListRowData,
  APPROVAL_STATUS: ApprovalStatusListRowData,
  PREVENTIVE_SR: PreventiveListRowData,
};
