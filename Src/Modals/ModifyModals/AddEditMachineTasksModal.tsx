import {View} from 'react-native';
import {AddEditModalProps} from '../../@types/Global';
import {MachinesTaskMappingListDataProps} from '../../@types/api';
import DropdownBox from '../../Components/DropdownBox';
import {useFormik} from 'formik';
import {ConvertJSONtoFormData, isLoading} from '../../Utilities/Methods';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';
import TextInputBox from '../../Components/TextInputBox';
import * as Yup from 'yup';
import DateTimePicker from '../../Components/DateTimePicker';
import CustomButton from '../../Components/CustomButton';
import {UseToken} from '../../Utilities/StoreData';
import {MachineTasksFilterprops} from '../../@types/modals';
import {
  AddNewTasksMappingService,
  CreateTasksMachineService,
  UpdateTaskMappingService,
} from '../../Services/Services';
import Toast from '../../Components/Toast';
import {getCatchMessage} from '../../Utilities/GeneralUtilities';
import {useEffect} from 'react';
import {
  HoursList,
  TaskDurationList,
} from '../../Utilities/StaticDropdownOptions';
import StyledText from '../../Components/StyledText';
import {useRoute} from '@react-navigation/native';
import TimePickerComponent from '../../Components/TimePIcker';
import moment from 'moment';

const validationSchema = Yup.object().shape({
  duration: Yup.number()
    .min(1, 'Duration must be greater tha zero')
    .required('Duration is required'),
  starting_date: Yup.string().required('Start Date is required'),
  starting_time: Yup.mixed().required('Start Time is required'),
});

export default function AddEditMachineTasksModal({
  lineData,
  type,
  onApplyChanges,
  onClose,
  category = 1,
}: AddEditModalProps<MachinesTaskMappingListDataProps>) {
  const token = UseToken();
  const route: any = useRoute();
  const {item} = route.params || {};
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
    resetForm,
    initialValues,
  } = useFormik<MachineTasksFilterprops>({
    initialValues: {
      starting_date: '',
      starting_time: null,
      duration: '',
      tasks: [],
    },
    validationSchema,
    onSubmit: () => {
      if (type === 'Create') {
        handleAddTasks(values);
      } else if (type === 'settings' || type === 'time') {
        handleUpdateTasks(values);
      } else if (type === 'Assigntask') {
        handleAddMachineTasks(values);
      }
    },
  });

  const handleAddMachineTasks = (values: MachineTasksFilterprops) => {
    isLoading(false);
    let finalObj = {
      token: token,
      machine_id: item?.machine_id,
      master_task_map_id: lineData?.master_task_map_id,
      tasks: values.tasks?.map((ele: MachinesTaskMappingListDataProps) => {
        return {task_id: ele?.task_id};
      }),
    };
    AddNewTasksMappingService(finalObj)
      .then(response => {
        if (response.data.status === 1) {
          Toast.success(response?.data?.msg);
          onApplyChanges();
          onClose();
        } else {
          Toast.error(response.data.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => isLoading(false));
  };

  const handleAddTasks = (values: MachineTasksFilterprops) => {
    isLoading(true);

    let finalObj = {
      token: token,
      duration: values.duration,
      starting_date: values.starting_date,
      starting_time: values.starting_time?.id
        ? `${
            values.starting_time.id < 10
              ? `0${values.starting_time.id}`
              : values.starting_time.id
          }:00:00`
        : '',

      machine_id: item?.machine_id,
      category: category + 1,
      tasks: values.tasks?.map((ele: MachinesTaskMappingListDataProps) => {
        return {task_id: ele?.task_id};
      }),
    };

    CreateTasksMachineService(finalObj)
      .then(async res => {
        if (res.data.status === 1) {
          Toast.success(res?.data?.msg);
          onApplyChanges();
          onClose();
        } else {
          Toast.error(res.data.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => isLoading(false));
  };
  const handleUpdateTasks = (values: MachineTasksFilterprops) => {
    isLoading(true);

    let finalObj = {
      token: token,
      duration: values.duration,
      master_task_id: lineData?.master_task_map_id,
      starting_date: values.starting_date,
      starting_time: values.starting_time?.id
        ? `${
            values.starting_time.id < 10
              ? `0${values.starting_time.id}`
              : values.starting_time.id
          }:00:00`
        : '',

      status: type === 'settings' ? 0 : 3,
    };
    console.log(finalObj, 'finalObj');

    UpdateTaskMappingService(ConvertJSONtoFormData(finalObj))
      .then(async res => {
        if (res.data.status === 1) {
          Toast.success(res?.data?.msg);
          onApplyChanges();
          onClose();
        } else {
          Toast.error(res.data.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (lineData) {
      let timeValue = lineData.starting_time
        ? parseInt(lineData?.starting_time?.split(':')[0])
        : null;
      setValues({
        tasks: null,
        duration: lineData.duration ? lineData.duration?.toString() : '',
        starting_date: lineData.starting_date,
        starting_time: timeValue ? {id: timeValue, name: timeValue} : null,
      });
    }
  }, []);

  console.log(errors, 'LINE');

  return (
    <>
      <View>
        <StyledText>
          Interval Selector : {TaskDurationList[category]?.name}
        </StyledText>

        {type !== 'Assigntask' && (
          <>
            {type !== 'time' && (
              <TextInputBox
                value={values?.duration}
                onChangeText={(val: string) => {
                  setFieldValue('duration', val > '0' || val === '' ? '' : val);
                }}
                customInputBoxContainerStyle={{
                  borderColor: COLORS.primary,
                }}
                validationType="NUMBER"
                keyboardType="number-pad"
                textInputProps={{
                  maxLength: INPUT_SIZE.Duration,
                }}
                isRequired
                placeHolder="Enter Duration"
                title={`Timeframe In ${TaskDurationList[category]?.name}`}
                isEditable={type !== 'View'}
                errorText={
                  errors?.duration && touched?.duration ? errors?.duration : ''
                }
              />
            )}
            {type === 'Create' || type === 'time' ? (
              <>
                <DateTimePicker
                  mode="date"
                  format="YYYY-MM-DD"
                  title="Starting Date"
                  placeHolder="Select Date"
                  value={values.starting_date}
                  onSelect={date => {
                    setFieldValue('starting_date', date);
                  }}
                  errorText={
                    errors?.starting_date && touched.starting_date
                      ? errors?.starting_date
                      : ''
                  }
                  containerStyle={{width: '100%'}}
                  minimumDate={new Date()}
                />
                <DropdownBox
                  title="Starting Time"
                  value={values.starting_time ? values.starting_time : ''}
                  placeHolder="Select Starting Time"
                  onSelect={val => {
                    console.log(val, 'VAL+==');

                    setFieldValue('starting_time', val);
                  }}
                  options={HoursList}
                  isEnableRightIcon={false}
                  isRequired
                  uniqueKey="task_id"
                  type="miniList"
                  fieldName="name"
                  searchFieldName="name"
                />
                {/* <TimePickerComponent
                  mode="time"
                  format="hh:mm"
                  date={values?.starting_date}
                  title="Starting Time"
                  placeHolder="Select Time"
                  value={values.starting_time}
                  onSelect={date => {
                    setFieldValue('starting_time', date);
                  }}
                  errorText={
                    errors?.starting_time && touched.starting_time
                      ? errors?.starting_time
                      : ''
                  }
                  containerStyle={{width: '100%'}}
                  minimumDate={new Date()}
                /> */}
                {/* <DateTimePicker
                  mode="time"
                  format="hh:mm"
                  title="Starting Time"
                  placeHolder="Select Time"
                  value={values.starting_time}
                  onSelect={date => {
                    setFieldValue('starting_time', date);
                  }}
                  errorText={
                    errors?.starting_time && touched.starting_time
                      ? errors?.starting_time
                      : ''
                  }
                  containerStyle={{width: '100%'}}
                  minimumDate={new Date()}
                /> */}
              </>
            ) : null}
          </>
        )}

        {type === 'Create' || type === 'Assigntask' ? (
          <DropdownBox
            title="Tasks"
            value={values.tasks?.length ? values.tasks : ''}
            placeHolder="Select Tasks"
            apiType="TaskList"
            onMultipleSelect={val => {
              setFieldValue('tasks', val);
            }}
            apiFilters={{
              machine_id: item?.machine_id,
              non_assigned_task: 1,
              category: category + 1,
            }}
            multiSelect
            isEnableRightIcon={false}
            isRequired
            uniqueKey="task_id"
            type="search"
            fieldName="task_name"
            isLocalSearch
            searchFieldName="task_name"
          />
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <CustomButton
            style={{width: '45%'}}
            type="secondary"
            onPress={() => {
              resetForm({
                values: {
                  ...initialValues,
                },
              });
              onClose();
            }}>
            Close
          </CustomButton>
          <CustomButton style={{width: '45%'}} onPress={handleSubmit}>
            {!lineData?.master_task_map_id ? 'Create' : 'Update'}
          </CustomButton>
        </View>
      </View>
    </>
  );
}
