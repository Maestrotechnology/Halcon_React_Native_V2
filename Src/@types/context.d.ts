import {FormikErrors, FormikTouched} from 'formik';
import React from 'react';
import {
  MachineDropdownListDataProps,
  PreventiveViewApiDataProps,
  PreventiveViewSelectedTaskProps,
  UserDropdownListDataProps,
} from './api';
import {DeviceStatusProps} from '../Utilities/StaticDropdownOptions';
import {ImageProps} from './general';
import {number} from 'yup';

export type ServiceRequestFormikDataProps = {
  machine: MachineDropdownListDataProps | null;
  dateOfErrorOccured: string;
  dateOfReq: string;
  scheduleDate: string;
  serviceStartedDate: string;
  deviceStatus: DeviceStatusProps | null;
  priorityLevel: number | null;
  reqStatus: DeviceStatusProps | null;
  machineStatusWhileAlarm: DeviceStatusProps | null;
  expectedCompletedDate: string;
  shift?: DeviceStatusProps | null;
  msgOnDisplay: string;
  comments: string;
  deviceFailureFileName: string;
  serviceCompletedDate: string;
  operatorName: string;
  operatorId: string;
  service_team_commments: string;
  report_no: string;
  employee: UserDropdownListDataProps | null;
  problem_description: string;
  pending_reason: string;
  relevant_details?: string;
  recurring_problem?: DeviceStatusProps | null;
  problem_status: number | null;
  problem_description: string;
  material_list: addMeterialProps[] | [];
  efmea_status: any;
  efmea_date: any;
  machine_limitations: string;
  why: string;
};
export type addMeterialProps = {
  material_id: MaterialListProps | null;
  quantity: number | string;
};
export type MaterialListProps = {
  request_id?: number;
  material_id: number | null;
  quantity: number | string;
  material_map_id?: number;
  material_name?: '';
};
export type ServiceRequestCreationContextProps = {
  values: ServiceRequestFormikDataProps;
  errors: FormikErrors;
  touched: FormikTouched;
  isSubmitting: boolean;
  routeData: any;

  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | React.ChangeEvent<any>>(
      field: T_1,
    ): T_1 extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  setSubmitting: (isSubmitting: boolean) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean,
  ) => Promise<FormikErrors<ServiceRequestFormikDataProps>> | Promise<void>;
  setValues: (
    values: React.SetStateAction<any>,
    shouldValidate?: boolean,
  ) => Promise<FormikErrors<any>> | Promise<void>;
  setactiveTab: Dispatch<SetStateAction<number>>;
  isCreate: boolean;
  isUpdate: boolean;
  isView: boolean;
  setdeviceFailureFiles: Dispatch<SetStateAction<ImageProps[]>>;
  deviceFailureFiles: ImageProps[];
  serviceReqId: number | null;
  isServiceUpdate: boolean;
  activeTab: number;
  settaskDetailsFiles: Dispatch<SetStateAction<ImageProps[]>>;
  taskDetailsFiles: ImageProps[];
};

export type PreventiveRequestFormikDataProps = {
  machine: MachineDropdownListDataProps | null;
  dateOfReq: string;
  requestStatus: DeviceStatusProps | null;
  scheduleDate: string;
  expectedCompletionDate: string;
  completedDate: string;
  comments: string;
  selected_tasks: PreventiveViewSelectedTaskProps[];
};

// export type PreventiveRequestUpdateContextProps = {
//   values: PreventiveRequestFormikDataProps;
//   errors: FormikErrors;
//   touched: FormikTouched;
//   isSubmitting: boolean;
//   handleChange: {
//     (e: React.ChangeEvent<any>): void;
//     <T_1 = string | React.ChangeEvent<any>>(
//       field: T_1,
//     ): T_1 extends React.ChangeEvent<any>
//       ? void
//       : (e: string | React.ChangeEvent<any>) => void;
//   };
//   setSubmitting: (isSubmitting: boolean) => void;
//   handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
//   setFieldValue: (
//     field: string,
//     value: any,
//     shouldValidate?: boolean,
//   ) => Promise<FormikErrors<ServiceRequestFormikDataProps>> | Promise<void>;
//   setValues: (
//     values: React.SetStateAction<any>,
//     shouldValidate?: boolean,
//   ) => Promise<FormikErrors<any>> | Promise<void>;
//   setactiveTab: Dispatch<SetStateAction<number>>;
//   isUpdate: boolean;
//   isView: boolean;
// };

export type PreventiveRequestUpdateContextProps = {
  preventiveViewData: PreventiveViewApiDataProps | null;
  setPreventiveViewData: Dispatch<
    SetStateAction<PreventiveViewApiDataProps | null>
  >;
  type: number;
  selectedId: number | null;
  setselectedId: Dispatch<SetStateAction<number | null>>;
  isView: boolean;

  setIsView: Dispatch<SetStateAction<boolean>>;
  values: PreventiveRequestFormikDataProps;
  errors: FormikErrors<PreventiveRequestFormikDataProps>;
  touched: FormikTouched<PreventiveRequestFormikDataProps>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean,
  ) => Promise<FormikErrors<PreventiveRequestFormikDataProps>> | Promise<void>;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  setValues: (
    values: React.SetStateAction<PreventiveRequestFormikDataProps>,
    shouldValidate?: boolean,
  ) => Promise<FormikErrors<PreventiveRequestFormikDataProps>> | Promise<void>;
};
