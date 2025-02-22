import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useServiceRequestDetails} from '../../../../Utilities/Contexts';
import {UseToken} from '../../../../Utilities/StoreData';
import {
  deleteTaskDetailService,
  getTaskDetailsListService,
} from '../../../../Services/Services';
import Toast from '../../../../Components/Toast';
import {
  DeleteTaskDetailApiResposneProps,
  TaskDetailsDataItemsProps,
  TaskDetailsListApiResponseProps,
} from '../../../../@types/api';
import HOCView from '../../../../Components/HOCView';
import {FONTSIZES} from '../../../../Utilities/Constants';
import StyledText from '../../../../Components/StyledText';
import TableView from '../../../../Components/TableView';
import {ItemKeyListProps, actionListProps} from '../../../../Components/types';
import {ServiceRequestCreationScreensNavigationProps} from '../../../../@types/navigation';
import {AlertBox} from '../../../../Utilities/GeneralUtilities';
import moment from 'moment';
import CustomButton from '../../../../Components/CustomButton';
import GlobaModal from '../../../../Components/GlobalModal';
import ConfirmationModal from '../../../../Modals/ConfirmationModal';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const itemHeaderList = [
  'Start Date',
  'End Date',
  'Machine Status Before',
  'Machine Status After',
  'Total Hours',
  'Technician',
];
const itemKeyList: ItemKeyListProps[] = [
  {key: 'startDatetime'},
  {key: 'endDatetime'},
  {key: 'deviceStatusBefore'},
  {key: 'deviceStatusAfter'},
  {key: 'totalDuration'},
  {key: 'technicianName'},
];

const TaskDetails = ({
  navigation,
}: ServiceRequestCreationScreensNavigationProps) => {
  const token = UseToken();
  const focused = useIsFocused();
  const {setactiveTab, serviceReqId, isView, values} =
    useServiceRequestDetails();
  const [isListLoading, setisListLoading] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [taskDetailsList, settaskDetailsList] = useState<
    TaskDetailsDataItemsProps[]
  >([]);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [confirmationModal, setConfirmationModal] = useState({
    status: false,
    id: 0,
  });
  const actionsList: actionListProps[] = [
    // {
    //   id: 1,
    //   name: 'viewIcon',
    //   width: 22,
    // },
    {
      id: 3,
      name: 'deleteIcon',
      // isDisabled: isView || values.serviceCompletedDate !== '',
    },
    {
      id: 2,
      name: 'editIcon',
      // isDisabled: isView || values.serviceCompletedDate !== '',
    },
  ];
  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;
    handleGetTaskDetailsList(1);
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, []);

  useEffect(() => {
    if (focused) {
      setactiveTab(3);
    }
  }, [focused]);

  const handleGetTaskDetailsList = (page = 1) => {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('request_id', serviceReqId);
    getTaskDetailsListService(formData, page)
      .then(res => {
        const response: TaskDetailsListApiResponseProps = res.data;

        if (response.status === 1) {
          let tempList = [...response.data.items].map(ele => {
            return {
              ...ele,
              startDatetime: moment(ele.startDatetime).format(
                'YYYY-MM-DD HH:mm A',
              ),
              endDatetime: moment(ele.endDatetime).format('YYYY-MM-DD HH:mm A'),
            };
          });
          if (page === 1) {
            totalPages = response.data.total_page;
            if (isMount) {
              settaskDetailsList([...tempList]);
            }
          } else {
            if (isMount) {
              settaskDetailsList(prev => [...prev, ...tempList]);
            }
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisListLoading(false);
          setisEndRefreshing(false);
          setisRefreshing(false);
        }
      });
  };

  const onEndReached = () => {
    currentPage = currentPage + 1;
    if (currentPage <= totalPages) {
      if (isMount) {
        setisEndRefreshing(true);
      }
      handleGetTaskDetailsList(currentPage);
    }
  };

  const onRefresh = () => {
    totalPages = 1;
    currentPage = 1;
    if (isMount) {
      setisRefreshing(true);
    }
    handleGetTaskDetailsList(1);
  };

  const handleDeleteTaskDetail = (taskId: number) => {
    if (isMount) {
      setisLoading(true);
    }
    const formData = new FormData();
    formData.append('token', token);
    formData.append('report_id', taskId);
    deleteTaskDetailService(formData)
      .then(res => {
        const response: DeleteTaskDetailApiResposneProps = res.data;
        if (response.status === 1) {
          if (isMount) {
            settaskDetailsList(prev =>
              [...prev].filter(ele => ele.report_id !== taskId),
            );
          }
          Toast.success(response.msg);
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisLoading(false);
        }
      });
  };

  const handleClose = () =>
    setConfirmationModal(pre => ({...pre, status: false}));

  return (
    <HOCView
      isListLoading={isListLoading}
      isLoading={isLoading}
      secondaryHeaderTitle="Task Details"
      isShowSecondaryHeaderBtn={!isView && !values.serviceCompletedDate}
      secondaryBtnTextStyle={{fontSize: FONTSIZES.small}}
      onHeaderBtnPress={() => {
        navigation.navigate('CreateTask', {
          isCreate: true,
        });
      }}
      headerProps={{
        onBackPress() {
          navigation.goBack();
        },
        isEnableMenu: false,
        isRightIconEnable: false,
        headerTitle: 'Task Details',
      }}
      secondaryBtnTitle="Add Service Task">
      <TableView
        dataList={[...taskDetailsList]}
        rowData={[
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
        ]}
        onEndReached={onEndReached}
        viewPortColumnDivisionCount={3.8}
        onRefresh={onRefresh}
        isEndRefresh={isEndRefreshing}
        isRefreshing={isRefreshing}
        isActionAvailable
        actionsList={isView ? [] : actionsList}
        onActionPress={(actionType: number, val: TaskDetailsDataItemsProps) => {
          if (actionType === 10) {
            navigation.navigate('CreateTask', {
              isView: true,
              taskItemData: val,
            });
          } else if (actionType === 2) {
            navigation.navigate('CreateTask', {
              isUpdate: true,
              taskItemData: val,
            });
          } else {
            // AlertBox({
            //   alertMsg: 'Are you sure want to delete this task?',
            //   onPressPositiveButton() {
            //     handleDeleteTaskDetail(val.taskId);
            //   },
            // });
            setConfirmationModal({
              status: true,
              id: val.report_id,
            });
          }
        }}
      />
      {/* {taskDetailsList.length > 0 && ( */}
      <CustomButton
        style={{marginBottom: 20}}
        onPress={() => {
          setactiveTab(5);
          navigation.navigate('ProblemDetails', {
            isFrom: 'TaskDetails',
          });
        }}>
        Next
      </CustomButton>
      {/* )} */}
      {confirmationModal.status && (
        <GlobaModal visible={confirmationModal.status} onClose={handleClose}>
          <ConfirmationModal
            onClose={handleClose}
            visible={confirmationModal.status}
            onConfirmPress={() => {
              handleDeleteTaskDetail(confirmationModal.id);
              handleClose();
            }}
            msg="Are you sure you want to delete this service task?"
          />
        </GlobaModal>
      )}
    </HOCView>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({});
