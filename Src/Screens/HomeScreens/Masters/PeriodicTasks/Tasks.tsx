import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UseToken} from '../../../../Utilities/StoreData';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import {
  ApiResponse,
  DeleteUserApiResposneProps,
  UserRequestListDataProps,
} from '../../../../@types/api';
import {actionListProps} from '../../../../Components/types';
import {TaskListFilterProps} from '../../../../@types/modals';
import {
  deleteTasksService,
  listTasksService,
} from '../../../../Services/Services';
import {getCatchMessage} from '../../../../Utilities/GeneralUtilities';
import Toast from '../../../../Components/Toast';
import HOCView from '../../../../Components/HOCView';
import {FONTSIZES} from '../../../../Utilities/Constants';
import {CommonStyles} from '../../../../Utilities/CommonStyles';
import CustomButton from '../../../../Components/CustomButton';
import TableView from '../../../../Components/TableView';
import GlobaModal from '../../../../Components/GlobalModal';
import ConfirmationModal from '../../../../Modals/ConfirmationModal';
import TaskListFilterModal from '../../../../Modals/Filter/TaskListFilterModal';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const TasksList = ({navigation, route}: any) => {
  const token = UseToken();
  const {bottom} = useSafeAreaInsets();
  const focused = useIsFocused();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [modifyModal, setModifyModal] = useState({
    show: false,
    lineData: null,
    type: '',
  });
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [TasksList, setTasksList] = useState<UserRequestListDataProps[]>([]);
  const [actionsList, setActionList] = useState<actionListProps[]>([
    {
      id: 1,
      name: 'deleteIcon',
      // isShow: ServiceRequestPermissions.delete ? true : false,
      isShow: true,
    },
    {
      id: 2,
      name: 'editIcon',
      // isShow: ServiceRequestPermissions.edit ? true : false,
      isShow: true,
      disableKey: 'disableEditIcon',
    },
  ]);
  const [filterData, setfilterData] = useState<TaskListFilterProps | null>({
    task_name: '',
  });
  const [isShowFilter, setisShowFilter] = useState<boolean>(false);
  const [isShowDelete, setIsShowDelete] = useState({
    id: -1,
    status: false,
  });

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;

    if (token) {
      handleGetTasksList(1);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, route, focused]);

  const handleGetTasksList = (
    page: number = 1,
    filter: TaskListFilterProps | null = filterData,
  ) => {
    const formData = new FormData();
    formData.append('token', token);

    if (filter?.task_name) {
      formData.append('task_name', filter?.task_name);
    }

    listTasksService(formData, page)
      .then(res => {
        const response: ApiResponse<UserRequestListDataProps> = res.data;

        if (response.status === 1) {
          if (page === 1) {
            totalPages = response.data?.total_page || 1;

            setTasksList(response.data?.items || []);
          } else {
            setTasksList(prev => [...prev, ...response.data?.items]);
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => {
        if (isMount) {
          setisListLoader(false);
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

      handleGetTasksList(currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    handleGetTasksList(1);
  };

  const handleDeleteServiceRequest = (user_id: number) => {
    handleCloseDelete();
    if (isMount) {
      setisLoading(true);
    }
    let formData = new FormData();
    formData.append('token', token);
    formData.append('user_id', user_id);
    deleteTasksService(formData)
      .then(res => {
        const response: DeleteUserApiResposneProps = res.data;

        if (response.status === 1) {
          if (isMount) {
            setTasksList(prev =>
              [...prev].filter(ele => ele.user_id !== user_id),
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

  const handleCheckAccessToAdd = () => {
    setModifyModal({show: true, type: 'Create', lineData: null});
  };

  const onApplyFilter = (data: TaskListFilterProps | null) => {
    if (isMount) {
      setisListLoader(true);
      setfilterData(data);
    }

    currentPage = 1;
    totalPages = 1;
    handleGetTasksList(1, data);
  };

  const closeFilterModal = () => {
    if (isMount) {
      setisShowFilter(false);
    }
  };

  const handleCloseDelete = () => {
    setIsShowDelete(pre => ({...pre, status: false}));
  };

  return (
    <HOCView
      isListLoading={isListLoader}
      secondaryHeaderTitle="Task"
      isShowSecondaryHeaderBtn
      secondaryBtnTextStyle={{fontSize: FONTSIZES.small}}
      onHeaderBtnPress={() => {
        handleCheckAccessToAdd();
      }}
      headerProps={{
        headerTitle: 'Task',
      }}
      secondaryBtnTitle="Add Task"
      isLoading={isLoading}
      isBtnLoading={permissionLoader}>
      {/* {TasksList?.length > 0 ? ( */}
      <View style={CommonStyles.flexRow}>
        <CustomButton
          onPress={() => {
            setisShowFilter(true);
          }}
          type="secondary"
          style={{width: '30%', marginVertical: 8}}>
          Filter
        </CustomButton>
      </View>
      {/* ) : null} */}
      <View style={{marginBottom: bottom, flex: 1}}>
        <TableView
          rowData={[
            {key: 'task_name', label: 'Task Name'},
            {key: 'control_key', label: 'Control Key'},
          ]}
          dataList={[...TasksList]?.map(ele => ({
            ...ele,
            // disableEditIcon: ele?.request_status === 3 ? true : false,
            // disableUpdateIcon: ele?.request_status === 3 ? true : false,
          }))}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          isActionAvailable
          actionsList={actionsList}
          onActionPress={(
            actionType: number,
            val: UserRequestListDataProps,
          ) => {
            if (actionType === 1) {
              setIsShowDelete({
                id: val.user_id,
                status: true,
              });
            } else if (actionType === 2) {
              navigation.navigate('AddEditUser', {
                type: 'Update',
                lineData: val,
              });
            } else if (actionType === 3) {
              navigation.navigate('AddEditUser', {type: 'View'});
            } else if (actionType === 4) {
              navigation.navigate('AddEditUser', {type: 'View', lineData: val});
            }
          }}
        />
      </View>
      {isShowFilter && (
        <GlobaModal
          title="Task Filter"
          visible={isShowFilter}
          onClose={closeFilterModal}>
          <TaskListFilterModal
            filterData={filterData}
            onApplyFilter={onApplyFilter}
            onClose={closeFilterModal}
          />
        </GlobaModal>
      )}

      {isShowDelete?.status && (
        <GlobaModal visible={isShowDelete?.status} onClose={handleCloseDelete}>
          <ConfirmationModal
            onClose={handleCloseDelete}
            visible={isShowDelete?.status}
            msg="Are you sure want to delete this Task?"
            onConfirmPress={() => {
              handleDeleteServiceRequest(isShowDelete?.id);
            }}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
};

export default TasksList;

const styles = StyleSheet.create({});
