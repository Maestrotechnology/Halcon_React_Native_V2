import {StyleSheet, Text, View} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {UseToken} from '../../../Utilities/StoreData';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import TableView from '../../../Components/TableView';
import moment from 'moment';
import {
  deletePreventiveTaskServices,
  preventiveTaskListService,
} from '../../../Services/Services';
import Toast from '../../../Components/Toast';
import {
  PreventiveTaskListApiProps,
  PreventiveTaskListProps,
} from '../../../@types/api';
import {JSONtoformdata} from '../../../Utilities/Methods';
import GlobaModal from '../../../Components/GlobalModal';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
import {openLoader} from '../../../Store/Slices/LoaderSlice';

let isMount = true;
let currentPage = 1;
let totalPages = 1;
const TaskDetails = forwardRef(function TaskDetails(
  {
    reqId,
    onViewPress,
    onEditPress,
    isView,
  }: {
    reqId: string;
    onViewPress: (value: PreventiveTaskListProps) => void;
    onEditPress: (value: PreventiveTaskListProps) => void;
    isView: boolean;
  },
  ref,
) {
  useImperativeHandle(
    ref,
    () => {
      return {
        updateTaskList() {
          handleGetPreventiveTaskServiceList();
        },
      };
    },
    [],
  );
  const token = UseToken();
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const [taskList, settaskList] = useState<PreventiveTaskListProps[]>([]);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    status: false,
    id: -1,
  });
  useEffect(() => {
    isMount = true;
    return () => {
      let isMount = false;
      let currentPage = 1;
      let totalPages = 1;
    };
  }, []);

  useEffect(() => {
    if (token && reqId) {
      // dispatch(openLoader(true));
      setIsLoading(true);
      handleGetPreventiveTaskServiceList();
    }
  }, [token, reqId]);

  const handleGetPreventiveTaskServiceList = (page = 1, size = 10) => {
    const data = {
      token: token,
      preventiveRequestId: reqId,
    };

    preventiveTaskListService(JSONtoformdata(data), page, size)
      .then(res => {
        const response: PreventiveTaskListApiProps = res.data;
        if (response.status === 1) {
          totalPages = response.data.total_page;
          if (currentPage === 1) {
            if (isMount) {
              settaskList([...response.data.items]);
            }
          } else {
            if (isMount) {
              settaskList(prev => [...prev, ...response.data.items]);
              currentPage = response.data.page;
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
        setisEndRefreshing(false);
        setIsLoadMore(false);
        setIsRefreshing(false);
        setIsLoading(false);
      });
  };

  const deletePreventiveTask = () => {
    handleClose();
    dispatch(openLoader(true));
    const data = {
      token: token,
      preventiveTaskId: confirmationModal?.id,
    };
    deletePreventiveTaskServices(JSONtoformdata(data))
      .then(res => {
        if (res?.data?.status) {
          Toast.success(res?.data?.msg);
          handleGetPreventiveTaskServiceList();
        }
      })
      .catch(err => getCatchMessage(err))
      .finally(() => {
        dispatch(openLoader(false));
      });
  };
  // const gettaskList = () => {
  //   return [...taskList]?.map(ele => ({
  //     ...ele,
  //     req_date: moment(ele?.req_date).format('YYYY-MM-DD hh:mm A'),
  //   }));
  // };

  // const onEndReached = () => {
  //   if (currentPage < totalPages) {
  //     setIsLoadMore(true);
  //     handleGetPreventiveTaskServiceList(currentPage + 1);
  //   }
  // };

  const onEndReached = () => {
    currentPage = currentPage + 1;
    if (currentPage <= totalPages) {
      if (isMount) {
        setisEndRefreshing(true);
      }
      handleGetPreventiveTaskServiceList(currentPage);
    }
  };
  const onRefresh = () => {
    totalPages = 1;
    currentPage = 1;
    if (isMount) {
      setIsRefreshing(true);
    }
    handleGetPreventiveTaskServiceList(1);
  };

  const gettaskList = () => {
    return taskList && taskList?.length > 0
      ? taskList?.map(ele => ({
          ...ele,
          created_at: moment(ele?.created_at).format('MM-DD-YYYY hh:mm A'),
          updated_at: moment(ele?.updated_at).format('MM-DD-YYYY hh:mm A'),
          // service_status: ele?.service_status
          //   ? ele?.service_status === 2
          //     ? 'On Going'
          //     : 'Completed'
          //   : '-',
        }))
      : [];
  };

  const handleClose = () => {
    setConfirmationModal(pre => ({...pre, status: false}));
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <TableView
        rowData={[
          {key: 'task_name', label: 'Task Name'},
          {key: 'created_at', label: 'Start Date'},
          {key: 'updated_at', label: 'End Date'},
        ]}
        dataList={[...gettaskList()]}
        headingList={[
          'Start Date',
          'End Date',
          'Preventive Status',
          'Total Hours',
          'Technician',
        ]}
        itemKeysList={[
          {key: 'startDatetime'},
          {key: 'endDatetime'},
          {key: 'service_status'},
          {
            key: 'totalDuration',
          },
          {
            key: 'technicianName',
          },
        ]}
        isActionAvailable
        viewPortColumnDivisionCount={4.5}
        // viewAction
        onEndReached={onEndReached}
        isEndRefresh={isEndRefreshing}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        actionsList={[
          {
            id: 1,
            name: 'viewIcon',
            width: 20,
          },
          {
            id: 2,
            name: 'editIcon',
            isShow: !isView,
            width: 16,
          },
          {
            id: 3,
            name: 'deleteIcon',
            isShow: !isView,
            width: 14,
          },
        ]}
        onActionPress={(type: number, val: PreventiveTaskListProps) => {
          if (type === 1) {
            onViewPress(val);
            return;
          }
          if (type === 2) {
            onEditPress(val);
            return;
          }
          setConfirmationModal({
            status: true,
            id: val?.task_id,
          });
        }}
      />
      {confirmationModal.status && (
        <GlobaModal visible={confirmationModal.status} onClose={handleClose}>
          <ConfirmationModal
            onClose={handleClose}
            visible={confirmationModal.status}
            onConfirmPress={deletePreventiveTask}
            msg="Are you sure you want to delete this preventive task?"
          />
        </GlobaModal>
      )}
    </View>
  );
});
export default TaskDetails;

const styles = StyleSheet.create({});
