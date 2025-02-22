import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HOCView from '../../../../Components/HOCView';
import StyledText from '../../../../Components/StyledText';
import {
  ServiceRequestCreationScreensNavigationProps,
  ServiceRequestCreationStackParamList,
} from '../../../../@types/navigation';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import {
  FilterValidObj,
  secondsToHourMinutes,
} from '../../../../Utilities/Methods';
import {CreateTaskFormikDataOProps} from '../../../../@types/general';
import DateTimePicker from '../../../../Components/DateTimePicker';
import TextInputBox from '../../../../Components/TextInputBox';
import DropdownBox from '../../../../Components/DropdownBox';
import {
  TASK_DONE_BY_OPTIONS,
  deviceStatusOptions,
} from '../../../../Utilities/StaticDropdownOptions';
import {COLORS, bigInputBoxStyle} from '../../../../Utilities/Constants';
import CustomButton from '../../../../Components/CustomButton';
import {RouteProp, useRoute} from '@react-navigation/native';
import {UseToken} from '../../../../Utilities/StoreData';
import {useServiceRequestDetails} from '../../../../Utilities/Contexts';
import {
  createTaskDetailService,
  updateTaskDetailService,
} from '../../../../Services/Services';
import Toast from '../../../../Components/Toast';
import {
  CreateTaskDetailApiResposneProps,
  TaskDetailsDataItemsProps,
} from '../../../../@types/api';
import {AxiosError} from 'axios';

var isMount = true;

const CreateTaskSchema = Yup.object().shape({
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string()
    .required('End date is required')
    .test('end Date', 'End date must be after start date', function (value) {
      const {startDate} = this.parent;
      if (startDate && value) {
        if (
          moment(startDate, 'YYYY-MM-DD hh:mm A')?.isAfter(
            moment(value, 'YYYY-MM-DD hh:mm A'),
          )
        ) {
          return false;
        }
        return true;
      }
      return true;
    }),
  deviceStatusBefore: Yup.object()
    .nullable()
    .required('Machine status before is required'),
  deviceStatusAfter: Yup.object()
    .nullable()
    .required('Machine status after is required'),
});

const CreateTask = ({
  navigation,
}: ServiceRequestCreationScreensNavigationProps) => {
  const route =
    useRoute<
      RouteProp<
        ServiceRequestCreationStackParamList,
        keyof ServiceRequestCreationStackParamList
      >
    >();
  const editData: TaskDetailsDataItemsProps | null =
    route.params?.taskItemData ?? null;

  const token = UseToken();
  const {serviceReqId} = useServiceRequestDetails();
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    isMount = true;

    return () => {
      isMount = false;
    };
  }, []);

  const getHoursMinutes = secondsToHourMinutes(
    (editData?.total_labor_hours || 0)?.toString(),
  );

  const {
    handleChange,
    setFieldValue,
    values,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    setSubmitting,
  } = useFormik<CreateTaskFormikDataOProps>({
    initialValues: {
      startDate: editData?.intervention_start_date
        ? moment(
            editData?.intervention_start_date,
            'YYYY-MM-DD HH:mm A',
          ).format('YYYY-MM-DD hh:mm A')
        : '',
      endDate: editData?.intervention_end_date
        ? moment(editData?.intervention_end_date, 'YYYY-MM-DD HH:mm A').format(
            'YYYY-MM-DD hh:mm A',
          )
        : '',
      totalHrs: `${getHoursMinutes?.hours} hours ${getHoursMinutes?.minutes} minutes`,

      deviceStatusBefore: editData?.start_status
        ? [...deviceStatusOptions]?.find(
            ele => ele?.id === editData?.start_status,
          ) || null
        : null,
      deviceStatusAfter: editData?.end_status
        ? [...deviceStatusOptions]?.find(
            ele => ele?.id === editData?.end_status,
          ) || null
        : null,
      description: editData?.task_description || '',
      comments: '',
      doneBy: editData?.task_done_by
        ? [...TASK_DONE_BY_OPTIONS]?.find(
            ele => ele?.id === editData?.task_done_by,
          ) || null
        : null,
      performedBy: editData?.intervention_by
        ? {
            name: editData?.intervention_by[0]?.name,
            user_id: editData?.intervention_by[0]?.user_id,
            user_type: editData?.intervention_by[0]?.user_type || 0,
          }
        : null,
    },
    validationSchema: CreateTaskSchema,
    onSubmit(values) {
      if (editData && !route.params?.isView) {
        handleUpdateTask(values);
      } else if (route.params?.isView) {
        navigation.goBack();
      } else {
        handleCreateTask(values);
      }
    },
  });

  useEffect(() => {
    if (values.startDate && values.endDate) {
      const getHoursMinutes = secondsToHourMinutes(
        (
          moment(values.endDate, 'YYYY-MM-DD hh:mm A').diff(
            moment(values.startDate, 'YYYY-MM-DD hh:mm A'),
            'minutes',
          ) * 60
        )?.toString(),
      );

      setFieldValue(
        'totalHrs',
        `${getHoursMinutes?.hours} hours ${getHoursMinutes?.minutes} minutes`,
      );
    } else {
      setFieldValue('totalHrs', '0 hours');
    }
  }, [values.startDate, values.endDate]);

  const getCreateOrUpdateFormData = (data: CreateTaskFormikDataOProps) => {
    const formData = new FormData();
    formData.append('token', token);
    if (editData) {
      formData.append('report_id', editData.report_id);
    } else {
      formData.append('request_id', serviceReqId);
    }
    formData.append(
      'intervention_start_date',
      data.startDate
        ? moment(data.startDate, 'YYYY-MM-DD hh:mm A').format(
            'YYYY-MM-DD HH:mm:ss',
          )
        : '',
    );
    formData.append(
      'intervention_end_date',
      data.endDate
        ? moment(data.endDate, 'YYYY-MM-DD hh:mm A').format(
            'YYYY-MM-DD HH:mm:ss',
          )
        : '',
    );
    formData.append('task_description', data.description);
    formData.append('comment', data.comments);
    formData.append(
      'total_labor_hours',
      data.totalHrs
        ? `${values.totalHrs?.split(' ')?.[0]}.${Math.floor(
            (parseInt(values.totalHrs?.split(' ')?.[2]) / 60) * 100,
          )}`
        : '',
    );
    formData.append('start_status', data.deviceStatusBefore?.id);
    formData.append('end_status', data.deviceStatusAfter?.id);
    formData.append('intervention_by', data?.performedBy || 0);
    formData.append('task_done_by', data?.doneBy?.id);

    return formData;
  };

  const handleCreateTask = (data: CreateTaskFormikDataOProps) => {
    if (isMount) {
      setisLoading(true);
    }

    const payload = {
      token: token,
      request_id: serviceReqId,
      intervention_start_date: data.startDate
        ? moment(data.startDate, 'YYYY-MM-DD hh:mm A').format(
            'YYYY-MM-DD HH:mm:ss',
          )
        : '',
      intervention_end_date: data.endDate
        ? moment(data.endDate, 'YYYY-MM-DD hh:mm A').format(
            'YYYY-MM-DD HH:mm:ss',
          )
        : '',
      total_labor_hours: data.totalHrs
        ? `${
            parseInt(values.totalHrs?.split(' ')?.[0] || '0') * 3600 +
            Math.floor((parseInt(values.totalHrs?.split(' ')?.[2]) || 0) * 60)
          }`
        : '',
      intervention_by: data?.performedBy
        ? [
            {
              name: data?.performedBy?.name,
              user_id: data?.performedBy?.user_id,
              user_type: data?.performedBy?.user_type || 0,
            },
          ]
        : [],
      task_done_by: data?.doneBy?.id,
      task_description: data?.description,
      start_status: data?.deviceStatusBefore?.id,
      end_status: data?.deviceStatusAfter?.id,
    };

    createTaskDetailService(FilterValidObj(payload))
      .then(res => {
        const response = res.data;
        if (response.status === 1) {
          Toast.success(response.msg);
          navigation.reset({
            routes: [
              {
                name: 'TaskDetails',
              },
            ],
          });
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        setSubmitting(false);
        if (isMount) {
          setisLoading(false);
        }
      });
  };

  const handleUpdateTask = (data: CreateTaskFormikDataOProps) => {
    if (isMount) {
      setisLoading(true);
    }

    const payload = {
      token: token,
      request_id: serviceReqId,
      report_id: editData?.report_id,
      intervention_start_date: data.startDate
        ? moment(data.startDate, 'YYYY-MM-DD hh:mm A').format(
            'YYYY-MM-DD HH:mm:ss',
          )
        : '',
      intervention_end_date: data.endDate
        ? moment(data.endDate, 'YYYY-MM-DD hh:mm A').format(
            'YYYY-MM-DD HH:mm:ss',
          )
        : '',
      total_labor_hours: data.totalHrs
        ? `${
            parseInt(values.totalHrs?.split(' ')?.[0] || '0') * 3600 +
            Math.floor((parseInt(values.totalHrs?.split(' ')?.[2]) || 0) * 60)
          }`
        : '',
      intervention_by: data?.performedBy
        ? [
            {
              name: data?.performedBy?.name,
              user_id: data?.performedBy?.user_id,
              user_type: data?.performedBy?.user_type || 0,
            },
          ]
        : [],
      task_done_by: data?.doneBy?.id,
      task_description: data?.description,
      start_status: data?.deviceStatusBefore?.id,
      end_status: data?.deviceStatusAfter?.id,
    };
    updateTaskDetailService(payload)
      .then(res => {
        const response: CreateTaskDetailApiResposneProps = res.data;
        if (response.status === 1) {
          Toast.success(response.msg);
          navigation.reset({
            routes: [
              {
                name: 'TaskDetails',
              },
            ],
          });
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch((err: AxiosError) => {
        Toast.error(err.message);
      })
      .finally(() => {
        setSubmitting(false);
        if (isMount) {
          setisLoading(false);
        }
      });
  };

  const getBtnTitle = () => {
    if (editData && !route.params?.isView) {
      return 'Update';
    } else if (route.params?.isView) {
      return 'Back';
    } else {
      return 'Submit';
    }
  };

  const getHeaderTitle = () => {
    if (editData && !route.params?.isView) {
      return 'Update Task Detail';
    } else if (route.params?.isView) {
      return 'Task Detail';
    } else {
      return 'Create TAsk Detail';
    }
  };

  return (
    <HOCView
      isLoading={isLoading}
      headerProps={{
        onBackPress() {
          navigation.goBack();
        },
        isEnableMenu: false,
        headerTitle: getHeaderTitle(),
        isRightIconEnable: false,
      }}
      isEnableKeyboardAware>
      <DateTimePicker
        mode="datetime"
        format="YYYY-MM-DD hh:mm A"
        title="Intervention Start Date"
        value={values.startDate}
        onSelect={date => {
          setFieldValue('startDate', date);
        }}
        errorText={
          errors?.startDate && touched.startDate ? errors?.startDate : ''
        }
        minimumDate={new Date()}
        isRequired
        isDisabled={route.params?.isView}
      />
      <DateTimePicker
        mode="datetime"
        format="YYYY-MM-DD hh:mm A"
        title="Intervention Finish Date"
        value={values.endDate}
        onSelect={date => {
          setFieldValue('endDate', date);
        }}
        errorText={errors?.endDate && touched.endDate ? errors?.endDate : ''}
        minimumDate={
          values.startDate
            ? new Date(
                moment(values.startDate, 'YYYY-MM-DD hh:mm A').format(
                  'YYYY-MM-DD',
                ),
              )
            : new Date()
        }
        isRequired
        isDisabled={route.params?.isView}
      />
      <TextInputBox
        title="Total Labour Hours"
        value={values.totalHrs}
        placeHolder="Total Labour hours"
        onChangeText={handleChange('totalHrs')}
        textInputProps={{
          readOnly: true,
        }}
        isEditable={!route.params?.isView}
      />
      <DropdownBox
        title="Intervention Performed By"
        value={values.performedBy}
        isRequired
        placeHolder="Intervention Performed By"
        apiType="assignedUsersList"
        onSelect={val => {
          setFieldValue('performedBy', val);
        }}
        type="search"
        fieldName="name"
        searchFieldName="name"
        onIconPress={() => {
          setFieldValue('performedBy', null);
        }}
        isDisabled={route.params?.isView}
        isEnableRightIcon={!route.params?.isView}
      />
      <DropdownBox
        title="Task Done By"
        isRequired
        options={[...TASK_DONE_BY_OPTIONS]}
        value={values.doneBy}
        placeHolder="Task Done By"
        onSelect={val => {
          setFieldValue('doneBy', val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue('doneBy', null);
        }}
        errorText={errors.doneBy && touched.doneBy ? errors.doneBy : ''}
        isDisabled={route.params?.isView}
        isEnableRightIcon={!route.params?.isView}
      />
      <DropdownBox
        title="Machine Status At Task Start"
        isRequired
        options={[...deviceStatusOptions]}
        value={values.deviceStatusBefore}
        placeHolder="Machine Status At Task Start"
        onSelect={val => {
          setFieldValue('deviceStatusBefore', val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue('deviceStatusBefore', null);
        }}
        errorText={
          errors.deviceStatusBefore && touched.deviceStatusBefore
            ? errors.deviceStatusBefore
            : ''
        }
        isDisabled={route.params?.isView}
        isEnableRightIcon={!route.params?.isView}
      />
      <DropdownBox
        title="Machine Status At Task End"
        isRequired
        options={[...deviceStatusOptions]}
        value={values.deviceStatusAfter}
        placeHolder="Machine Status At Task End"
        onSelect={val => {
          setFieldValue('deviceStatusAfter', val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue('deviceStatusAfter', null);
        }}
        errorText={
          errors.deviceStatusAfter && touched.deviceStatusAfter
            ? errors.deviceStatusAfter
            : ''
        }
        isDisabled={route.params?.isView}
        isEnableRightIcon={!route.params?.isView}
      />
      <TextInputBox
        title="Description"
        value={values.description}
        placeHolder="Enter description"
        onChangeText={handleChange('description')}
        textInputProps={bigInputBoxStyle}
        customInputBoxContainerStyle={{
          height: 110,
          backgroundColor: !route.params?.isView
            ? COLORS.white
            : COLORS.disabledColor,
        }}
        multiline
        isEditable={!route.params?.isView}
      />
      {/* <TextInputBox
        title="Comments"
        value={values.comments}
        placeHolder="Enter comments"
        onChangeText={handleChange('comments')}
        textInputProps={bigInputBoxStyle}
        customInputBoxContainerStyle={{
          height: 110,
          backgroundColor: !route.params?.isView
            ? COLORS.white
            : COLORS.disabledColor,
        }}
        isEditable={!route.params?.isView}
      /> */}
      <CustomButton
        style={{marginBottom: 20}}
        isDisabled={isSubmitting}
        onPress={handleSubmit}>
        {getBtnTitle()}
      </CustomButton>
    </HOCView>
  );
};

export default CreateTask;

const styles = StyleSheet.create({});
