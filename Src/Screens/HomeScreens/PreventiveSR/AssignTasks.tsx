import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HOCView from '../../../Components/HOCView';
import {LoaderStatus, UseToken} from '../../../Utilities/StoreData';
import TableView from '../../../Components/TableView';
import CustomButton from '../../../Components/CustomButton';
import StyledText from '../../../Components/StyledText';
import {
  createTaskMappingService,
  preventiveTaskListService,
} from '../../../Services/Services';
import {JSONtoformdata} from '../../../Utilities/Methods';
import {usePreventiveRequestContext} from '../../../Utilities/Contexts';
import Toast from '../../../Components/Toast';
import {useDispatch} from 'react-redux';
import {openLoader} from '../../../Store/Slices/LoaderSlice';
import {PreventiveTaskListProps} from '../../../@types/api';
import {COLORS} from '../../../Utilities/Constants';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';

let isMount = true;
let currentPage = 1;
let totalPages = 1;
const AssignTasks = ({navigation}: any) => {
  const loading = LoaderStatus();
  const token = UseToken();
  const dispatch = useDispatch();
  const {selectedId, preventiveViewData} = usePreventiveRequestContext();

  const [taskList, settaskList] = useState<PreventiveTaskListProps[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [selectedTaskList, seSelectedTaskList] = useState<number[]>([]);

  useEffect(() => {
    if (token) {
      handleGetPreventiveTaskServiceList();
    }
  }, [token]);

  const handleGetPreventiveTaskServiceList = (page = 1, size = 10) => {
    dispatch(openLoader(true));
    const data = {
      token: token,
      non_assigned_task: 1,
      machine_id: preventiveViewData?.machine_id,
    };

    preventiveTaskListService(JSONtoformdata(data), page, size)
      .then(res => {
        const response: any = res.data;
        if (response.status === 1) {
          totalPages = response.data.total_page;
          if (currentPage === 1) {
            if (isMount) {
              settaskList(response.data.items || []);
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
        dispatch(openLoader(false));
        setIsRefreshing(false);
        setisEndRefreshing(false);
      });
  };

  const createTaskMapping = () => {
    dispatch(openLoader(true));
    const data = {
      token,
      machine_id: preventiveViewData?.machine_id,
      tasks: selectedTaskList?.map(ele => ({
        task_id: ele,
      })),
    };
    createTaskMappingService(data)
      .then(res => {
        if (res?.data?.status) {
          navigation.navigate('PreventiveTasks');
          Toast.success(res?.data?.msg);
        } else {
          Toast.error(res?.data?.msg);
        }
      })
      .catch(err => getCatchMessage(err))
      .finally(() => {
        dispatch(openLoader(false));
      });
  };

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

  const renderCardItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onLongPress={() => {
          handleSelectTask(item?.task_id);
        }}
        onPress={() => {
          if (selectedTaskList?.length > 0) {
            handleSelectTask(item?.task_id);
          }
        }}
        style={{
          ...styles.itemContainer,
          backgroundColor: selectedTaskList?.includes(item?.task_id)
            ? COLORS.primary
            : COLORS.white,
        }}>
        <StyledText
          style={{
            color: selectedTaskList?.includes(item?.task_id)
              ? COLORS.white
              : COLORS.black,
          }}>
          {item?.task_name || ''}
        </StyledText>
      </TouchableOpacity>
    );
  };

  const handleSelectTask = (id: number) => {
    const isPresent = [...selectedTaskList]?.find(ele => ele === id);
    if (isPresent) {
      seSelectedTaskList(pre => [...pre]?.filter(ele => ele !== id));
      return;
    }
    seSelectedTaskList(pre => [...pre, id]);
  };

  return (
    <HOCView
      headerProps={{
        isEnableMenu: false,
        isRightIconEnable: false,
        headerTitle: `Assign Tasks`,
        onBackPress() {
          navigation.goBack();
        },
      }}
      isLoading={loading}>
      <View
        style={{
          flex: 1,
        }}>
        {/* {preventiveViewData && ( */}
        <TableView
          dataList={[...taskList]}
          rowData={[
            {
              key: 'task_name',
              label: '',
            },
          ]}
          viewPortColumnDivisionCount={2.3}
          showFullText
          onPressItem={val => {}}
          customRenderer={renderCardItem}
          onEndReached={onEndReached}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
        {/* )} */}
        <CustomButton
          onPress={() => {
            if (selectedTaskList?.length > 0) {
              createTaskMapping();
              return;
            }
            Toast.error('Please select atleast one task!');
          }}>
          Submit
        </CustomButton>
      </View>
    </HOCView>
  );
};

export default AssignTasks;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 10,
    elevation: 1,
  },
});
