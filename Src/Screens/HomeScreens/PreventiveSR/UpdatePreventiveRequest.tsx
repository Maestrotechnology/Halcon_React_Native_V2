import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import HOCView from '../../../Components/HOCView';
import {LoaderStatus, UseToken} from '../../../Utilities/StoreData';
import {
  addPreventiveRequestService,
  updatePreventiveTaskService,
  viewPreventiveSRService,
} from '../../../Services/Services';
import {JSONtoformdata} from '../../../Utilities/Methods';
import {
  PreventiveSRListApiProps,
  PreventiveTaskListProps,
  PreventiveViewApiDataProps,
  PreventiveViewApiProps,
  PreventiveViewSelectedTaskProps,
} from '../../../@types/api';
import Toast from '../../../Components/Toast';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
import TableView, {TableItemProps} from '../../../Components/TableView';
import TaskDetails from './TaskDetails';
import DropdownBox from '../../../Components/DropdownBox';
import DateTimePicker from '../../../Components/DateTimePicker';
import {useFormik} from 'formik';
import moment from 'moment';
import {
  deviceStatusOptions,
  priorityLevelOptions,
  requestStatusOptions,
} from '../../../Utilities/StaticDropdownOptions';
import TextInputBox from '../../../Components/TextInputBox';
import {
  COLORS,
  WINDOW_WIDTH,
  bigInputBoxStyle,
} from '../../../Utilities/Constants';
import TextField from '../../../Components/TextField';
import {PreventiveRequestFormikDataProps} from '../../../@types/context';
import CustomButton from '../../../Components/CustomButton';
import GlobaModal from '../../../Components/GlobalModal';
import AddPreventiveModal from '../../../Modals/AddPreventiveModal';
import {useDispatch} from 'react-redux';
import {openLoader} from '../../../Store/Slices/LoaderSlice';
import {
  TaskDetailsRefProp,
  preventiveModalProps,
} from './@types/preventiveTypes';
import SVGIcon from '../../../Components/SVGIcon';
import {ICONS} from '../../../Utilities/Icons';
import StyledText from '../../../Components/StyledText';
import {FONTS} from '../../../Utilities/Fonts';
import {CommonStyles} from '../../../Utilities/CommonStyles';
import * as yup from 'yup';
import CheckBox from '../../../Components/CheckBox';
import {usePreventiveRequestContext} from '../../../Utilities/Contexts';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const UpdatePreventiveRequest = ({route, navigation}: any) => {
  const {
    preventiveViewData,
    setPreventiveViewData,
    selectedId,
    errors,
    handleSubmit,
    setFieldValue,
    setselectedId,
    touched,
    values,
    setValues,
  } = usePreventiveRequestContext();

  const isAdd = route?.params?.type === 4;
  const isView = route?.params?.type === 1;
  const token = UseToken();
  const taskDetailsRef = useRef<TaskDetailsRefProp | null>(null);
  const dispatch = useDispatch();
  const loading = LoaderStatus();

  const [isLoading, setIsLoading] = useState(false);
  // const [selectedTasks, setSelectedTasks] = useState<
  //   PreventiveViewSelectedTaskProps[]
  // >([]);
  const [preventiveTaskModal, setPreventiveTaskModal] =
    useState<preventiveModalProps>({
      status: false,
      data: null,
      isView: false,
    });

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;

    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, []);

  useEffect(() => {
    if (token && route?.params?.data) {
      setIsLoading(true);
      handleGetViewPreventiveList(1);
    }
  }, [token, route]);

  const handleAddPreventiveRequest = () => {
    dispatch(openLoader(true));
    const data = {
      token,
      machine_id: values?.machine?.machine_id || 0,
      req_date: values?.dateOfReq
        ? moment(values?.dateOfReq, 'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss')
        : '',
      comments: '',
      schedule_date: values?.scheduleDate
        ? moment(values?.scheduleDate, 'YYYY-MM-DD hh:mm A').format(
            'YYYY-MM-DD HH:mm:ss',
          )
        : null,
      expected_completion_date: values?.expectedCompletionDate
        ? moment(values?.expectedCompletionDate, 'YYYY-MM-DD hh:mm A').format(
            'YYYY-MM-DD HH:mm:ss',
          )
        : null,
      task_list: [],
    };

    addPreventiveRequestService(data)
      .then(res => {
        if (res?.data?.status) {
          Toast.success(res?.data?.msg);
          navigation.replace('PreventiveSR');
        } else {
          Toast.error(res?.data?.msg);
        }
      })
      .catch(err => getCatchMessage(err))
      .finally(() => {
        dispatch(openLoader(false));
      });
  };

  const handleGetViewPreventiveList = (page = 1, size = 10) => {
    const data = {
      token: token,
      request_id: route?.params?.data,
    };

    viewPreventiveSRService(JSONtoformdata(data), page, size)
      .then(res => {
        const response: PreventiveViewApiProps = res?.data;
        if (res?.data?.status) {
          setPreventiveViewData(response.data);
          // setSelectedTasks(response?.data?.selected_task || []);
          setFieldValue(
            'selected_tasks',
            response?.data?.selected_task?.map(ele => ({
              ...ele,
              start_date: ele?.start_date
                ? moment(ele?.start_date).format('YYYY-MM-DD hh:mm A')
                : '',
              end_date: ele?.end_date
                ? moment(ele?.end_date).format('YYYY-MM-DD hh:mm A')
                : '',
            })) || [],
          );
          updateData(response.data);
        } else {
          Toast.error(res?.data?.msg);
        }
      })
      .catch(err => getCatchMessage(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateData = (data: PreventiveViewApiDataProps) => {
    setValues(pre => ({
      ...pre,
      machine: {
        machine_name: data?.machine_name,
        machine_id: data?.machine_id,
      },
      requestStatus: {
        id: data?.request_status,
        name: data?.request_status_name,
      },
      dateOfReq: data?.req_date
        ? moment(data?.req_date).format('YYYY-MM-DD')
        : '-',
      scheduleDate: data?.schedule_date
        ? moment(data?.schedule_date).format('YYYY-MM-DD hh:mm A')
        : '-',
      expectedCompletionDate: data?.expected_completion_date
        ? moment(data?.expected_completion_date, 'YYYY-MM-DD HH:mm:ss').format(
            'YYYY-MM-DD hh:mm A',
          )
        : '',
      completedDate: data?.completed_date
        ? moment(data?.completed_date, 'YYYY-MM-DD HH:mm:ss').format(
            'YYYY-MM-DD hh:mm A',
          )
        : '',
      comments: data?.comments ? data?.comments : '',
    }));
  };

  const handleCloseModal = () =>
    setPreventiveTaskModal(pre => ({
      status: false,
      data: null,
      isView: false,
    }));

  return (
    <HOCView
      isEnableKeyboardAware
      isListLoading={isLoading}
      headerProps={{
        isEnableMenu: false,
        isRightIconEnable: false,
        headerTitle: `${
          isAdd ? 'Add' : route?.params?.type === 1 ? 'View' : 'Update'
        } Preventive SR`,
        onBackPress() {
          navigation.goBack();
        },
      }}
      isLoading={loading}>
      <View
        style={{
          paddingBottom: 25,
        }}>
        <View>
          <DropdownBox
            title="Machine"
            value={values.machine}
            placeHolder="Select machine"
            apiType="machineList"
            onSelect={val => {
              setFieldValue('machine', val);
            }}
            type="search"
            fieldName="machine_name"
            searchFieldName="machine_name"
            onIconPress={() => {
              setFieldValue('machine', null);
            }}
            isEnableRightIcon={isAdd}
            isDisabled={!isAdd}
            errorText={errors.machine && touched.machine ? errors.machine : ''}
          />

          <DateTimePicker
            title="Date of request"
            value={values.dateOfReq}
            onSelect={date => {
              setFieldValue('dateOfReq', date);
            }}
            isDisabled
          />
          {!isAdd && (
            <DropdownBox
              title="Request Status"
              isRequired
              options={[...requestStatusOptions]}
              value={values.requestStatus}
              placeHolder="Select request status"
              onSelect={val => {
                setFieldValue('requestStatus', val);
              }}
              type="miniList"
              fieldName="name"
              onIconPress={() => {
                setFieldValue('requestStatus', null);
              }}
              errorText={
                errors.requestStatus && touched.requestStatus
                  ? errors.requestStatus
                  : ''
              }
              isEnableRightIcon={false}
              isDisabled={isView}
            />
          )}
          {/* <DateTimePicker
            mode="datetime"
            format="YYYY-MM-DD hh:mm A"
            title="Schedule Date"
            value={values.scheduleDate}
            onSelect={date => {
              setFieldValue('scheduleDate', date);
            }}
            isDisabled={!isAdd}
          /> */}
          <DateTimePicker
            mode="datetime"
            format="YYYY-MM-DD hh:mm A"
            title="Expected Completed Date"
            value={values.expectedCompletionDate}
            onSelect={date => {
              setFieldValue('expectedCompletionDate', date);
            }}
            isDisabled={isView}
            minimumDate={new Date(values?.dateOfReq)}
          />
          {!isAdd && (
            <DateTimePicker
              mode="datetime"
              format="YYYY-MM-DD hh:mm A"
              title="Completed Date"
              value={values.completedDate}
              onSelect={date => {
                setFieldValue('completedDate', date);
              }}
              isDisabled={isView}
              minimumDate={new Date(values?.dateOfReq)}
            />
          )}

          {!isAdd && (
            <TextInputBox
              title="Service Comments"
              value={values.comments}
              placeHolder="Service Comments"
              onChangeText={val => {
                setFieldValue('comments', val);
              }}
              textInputProps={{
                ...bigInputBoxStyle,
              }}
              customInputBoxContainerStyle={{
                height: 130,
                backgroundColor: COLORS.white,
                borderColor: !isView ? COLORS.primary : COLORS.secondary,
              }}
              isEditable={!isView}
            />
          )}
        </View>

        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate('PreventiveFileUpload', {
              preventiveId: route?.params?.data,
              isView:
                route?.params?.type === 1 ||
                preventiveViewData?.request_status === 3,
            });
          }}
          style={styles.uploadContainer}>
          <StyledText style={styles.uploadText}>
            {route?.params?.type === 1 ||
            preventiveViewData?.request_status === 3
              ? 'Uploaded Files'
              : 'File Upload'}
          </StyledText>
          <View style={styles.uploadImgContainer}>
            <ICONS.uploadIcon />
          </View>
        </TouchableOpacity> */}

        {/* <TaskDetails
          onViewPress={value => {
            setPreventiveTaskModal(pre => ({
              ...pre,
              data: value,
              isView: true,
              status: true,
            }));
          }}
          onEditPress={value => {
            setPreventiveTaskModal(pre => ({
              ...pre,
              data: value,
              isView: false,
              status: true,
            }));
          }}
          ref={taskDetailsRef}
          reqId={route?.params?.data}
          isView={
            route?.params?.type === 1 ||
            preventiveViewData?.request_status === 3
          }
        /> */}

        {/* {route?.params?.type !== 1 &&
          preventiveViewData?.request_status !== 3 &&
           ( */}
        <CustomButton
          onPress={() => {
            if (!isAdd) {
              navigation.navigate('PreventiveTasks');
              return;
            }
            handleAddPreventiveRequest();
          }}>
          {!isAdd ? 'Next' : 'Submit'}
        </CustomButton>
        {/* )} */}
      </View>

      {preventiveTaskModal.status && (
        <GlobaModal
          title={`${
            preventiveTaskModal?.isView
              ? ''
              : preventiveTaskModal?.data
              ? 'Update Preventive Task'
              : 'Add Preventive Task'
          }`}
          visible={preventiveTaskModal.status}
          onClose={handleCloseModal}>
          <AddPreventiveModal
            onClose={handleCloseModal}
            preventive_request_id={route?.params?.data}
            updateData={() => {
              if (taskDetailsRef.current) {
                taskDetailsRef.current.updateTaskList();
              }
            }}
            data={preventiveTaskModal.data}
            isView={preventiveTaskModal.isView}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
};

export default UpdatePreventiveRequest;

const styles = StyleSheet.create({
  uploadImgContainer: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginBottom: 10,
  },
  uploadContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  uploadText: {
    paddingRight: 8,
    fontSize: 15,
    fontFamily: FONTS.poppins.semibold,
  },
});
