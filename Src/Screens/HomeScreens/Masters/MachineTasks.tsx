import {useEffect, useState} from 'react';
import {COLORS, FONTSIZES} from '../../../Utilities/Constants';
import HOCView from '../../../Components/HOCView';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomButton from '../../../Components/CustomButton';
import {CommonStyles} from '../../../Utilities/CommonStyles';
import SegmentedControl from '../../../Components/SegmentedControl';
import {UseToken} from '../../../Utilities/StoreData';
import {
  deleteMachineMappedTasksService,
  MachineMappingListService,
} from '../../../Services/Services';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  AddEditModalScreenProsp,
  ApiResponse,
  DeleteApiResposneProps,
} from '../../../@types/Global';
import {
  MachinesTaskMappingListDataProps,
  taskMappingResponseDatas,
} from '../../../@types/api';
import Toast from '../../../Components/Toast';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
import StyledText from '../../../Components/StyledText';
import GlobaModal from '../../../Components/GlobalModal';
import AddEditMachineTasksModal from '../../../Modals/ModifyModals/AddEditMachineTasksModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TableView from '../../../Components/TableView';
import CheckBox from '../../../Components/CheckBox';
import SVGIcon from '../../../Components/SVGIcon';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import {TaskDurationList} from '../../../Utilities/StaticDropdownOptions';
import {ICONS} from '../../../Utilities/Icons';
import CustomImageBox from '../../../Components/CustomImageBox';
import {FONTS} from '../../../Utilities/Fonts';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

export default function MachineTasks({route}: any) {
  const navigation = useNavigation();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [permissionLoader, setPermissionLoader] = useState(false);
  // let CurrentIndex = 0;
  const [selectedTaskList, setSelectedTaskList] = useState<number[]>([]);
  const {bottom} = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const token = UseToken();
  const focused = useIsFocused();
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const {item} = route.params || {};
  const [isShowDelete, setIsShowDelete] = useState({
    status: false,
  });
  const [taskSettingDatas, setTaskSettingDatas] =
    useState<taskMappingResponseDatas | null>(null);
  const [machineTaskList, setMachineTaskList] = useState<
    MachinesTaskMappingListDataProps[]
  >([]);
  const [addEditMachineTask, setAddEditMachineTask] = useState<
    AddEditModalScreenProsp<MachinesTaskMappingListDataProps>
  >({
    type: '',
    lineData: null,
    show: false,
  });

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;

    if (token) {
      getTasksList(1, 1);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, focused]);

  const getTasksList = (index = 1, page = 1) => {
    let formData = new FormData();
    formData.append('token', token);
    formData.append('category', index);
    formData.append('machine_id', item?.machine_id);

    MachineMappingListService(formData, page)
      .then(res => {
        const response: ApiResponse<MachinesTaskMappingListDataProps> =
          res.data;
        setSelectedTaskList([]);
        // @ts-ignore
        setTaskSettingDatas(response?.data);

        if (response.status === 1) {
          if (page === 1) {
            totalPages = response.data?.total_page || 1;

            setMachineTaskList(response.data?.items || []);
          } else {
            setMachineTaskList(prev => [...prev, ...response.data?.items]);
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
      getTasksList(currentIndex + 1, currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    getTasksList(currentIndex + 1, 1);
  };

  const closeTaskModal = () => {
    if (isMount) {
      setAddEditMachineTask({
        lineData: null,
        show: false,
        type: '',
      });
    }
  };

  const handleSelectTask = (id: number) => {
    const isPresent = [...selectedTaskList]?.find(ele => ele === id);
    if (isPresent) {
      setSelectedTaskList(pre => [...pre]?.filter(ele => ele !== id));
      return;
    }
    setSelectedTaskList(pre => [...pre, id]);
  };

  const renderCardItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          handleSelectTask(item?.task_id);
        }}
        style={{
          ...styles.itemContainer,
        }}>
        <CheckBox
          checked={selectedTaskList?.includes(item?.task_id)}
          label={item?.task_name || ''}
          onChange={() => {
            handleSelectTask(item?.task_id);
          }}
        />
      </TouchableOpacity>
    );
  };
  const handleCloseDelete = () => {
    setIsShowDelete(pre => ({...pre, status: false}));
  };

  const handleDeleteMappedTask = () => {
    handleCloseDelete();
    if (isMount) {
      setisLoading(true);
    }
    let finalObj = {
      token: token,
      master_task_map_id: taskSettingDatas?.master_task_map_id,
      tasks: selectedTaskList?.map(id => ({task_id: id})),
    };

    deleteMachineMappedTasksService(finalObj)
      .then(res => {
        const response: DeleteApiResposneProps = res.data;

        if (response.status === 1) {
          if (isMount) {
            getTasksList(currentIndex + 1, 1);
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

  return (
    <>
      <HOCView
        isListLoading={isListLoader}
        secondaryHeaderTitle={item.machine_name || 'Machine'}
        isShowSecondaryHeaderBtn={!taskSettingDatas?.is_exist}
        secondaryBtnTextStyle={{fontSize: FONTSIZES.small}}
        onHeaderBtnPress={() => {
          // handleCheckAccessToAdd();
          setAddEditMachineTask({
            type: taskSettingDatas?.master_task_map_id ? 'Update' : 'Create',
            lineData: null,
            show: true,
          });
        }}
        headerProps={{
          headerTitle: 'Machine Tasks',
          isEnableMenu: false,
          onBackPress() {
            navigation.goBack();
          },
        }}
        secondaryBtnTitle={taskSettingDatas?.is_exist ? 'Settings' : 'Add Task'}
        isLoading={isLoading}
        isBtnLoading={permissionLoader}
        isShowIconGroups={taskSettingDatas?.is_exist ? true : false}
        onPressSettingIcon={() => {
          setAddEditMachineTask({
            type: 'settings',
            lineData: null,
            show: true,
          });
        }}
        onPressTimeIcon={() => {
          setAddEditMachineTask({
            type: 'time',
            lineData: null,
            show: true,
          });
        }}>
        <View
          style={[
            CommonStyles.flexRow,
            {
              justifyContent: 'space-between',
              marginVertical: 5,
              marginBottom: 10,
            },
          ]}>
          <StyledText style={{fontFamily: FONTS.poppins.medium}}>
            Periodic Checks In {TaskDurationList[currentIndex]?.name}
          </StyledText>

          {taskSettingDatas?.is_exist ? (
            <CustomButton
              textStyle={{fontSize: FONTSIZES.small}}
              isDisabled={false}
              onPress={() => {
                setAddEditMachineTask({
                  show: true,
                  type: 'Assigntask',
                  lineData: null,
                });
              }}
              style={[{width: 100}]}>
              {permissionLoader ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                'Update Task'
              )}
            </CustomButton>
          ) : (
            <View style={{marginVertical: 20}}></View>
          )}
        </View>

        <SegmentedControl
          tabs={TaskDurationList}
          onChange={index => {
            if (currentIndex !== index) {
              setSelectedTaskList([]);
              setCurrentIndex(index);
              getTasksList(index + 1);
            }
          }}
          currentIndex={currentIndex}
        />
        <View style={{marginBottom: bottom, marginTop: 20, flex: 1}}>
          {machineTaskList?.length > 0 && (
            <View style={[styles.itemContainer, styles.rowStyle]}>
              <CheckBox
                checked={
                  machineTaskList?.every(item =>
                    selectedTaskList.includes(item?.task_id),
                  )
                    ? true
                    : false
                }
                containerStyle={{maxWidth: '50%'}}
                label="Select All"
                onChange={() => {
                  if (
                    machineTaskList?.every(item =>
                      selectedTaskList.includes(item?.task_id),
                    )
                  ) {
                    setSelectedTaskList([]);
                  } else {
                    setSelectedTaskList(
                      machineTaskList?.map(ele => ele?.task_id),
                    );
                  }
                }}
              />

              {selectedTaskList?.length > 0 && (
                <StyledText
                  style={{
                    color: COLORS.red,
                    fontFamily: FONTS.poppins.regular,
                  }}>
                  Delete
                </StyledText>
                // <SVGIcon
                //   icon="deleteIcon"
                //   width={18}
                //   height={18}
                //   isButton
                //   onPress={() => {
                //     setIsShowDelete({
                //       status: true,
                //     });
                //   }}
                // />
              )}
            </View>
          )}
          <TableView
            rowData={[]}
            dataList={[...machineTaskList]?.map(ele => ({
              ...ele,
            }))}
            listEmptyText="No Tasks Found"
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            isEndRefresh={isEndRefreshing}
            isRefreshing={isRefreshing}
            isActionAvailable
            customRenderer={renderCardItem}
          />
        </View>

        <GlobaModal
          title={`${
            addEditMachineTask?.type === 'Assigntask'
              ? 'Update'
              : addEditMachineTask?.type === 'settings'
              ? 'Update Setting for'
              : addEditMachineTask?.type === 'time'
              ? 'Update Time for'
              : 'Create'
          } ${TaskDurationList[currentIndex].title} Tasks`}
          visible={addEditMachineTask?.show}
          onClose={closeTaskModal}>
          <AddEditMachineTasksModal
            // @ts-ignore
            lineData={taskSettingDatas || null}
            type={addEditMachineTask?.type}
            onApplyChanges={() => {
              getTasksList(currentIndex + 1, 1);
            }}
            onClose={closeTaskModal}
            category={currentIndex}
          />
        </GlobaModal>
        {isShowDelete?.status && (
          <GlobaModal
            visible={isShowDelete?.status}
            onClose={handleCloseDelete}>
            <ConfirmationModal
              onClose={handleCloseDelete}
              visible={isShowDelete?.status}
              msg="Are you sure want to delete this Task?"
              onConfirmPress={() => {
                handleDeleteMappedTask();
              }}
            />
          </GlobaModal>
        )}
      </HOCView>
    </>
  );
}
const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    // borderTopColor: COLORS.DEEP_BLUE,
    // borderRightColor: COLORS.DEEP_BLUE,

    // borderWidth: 0.4,
    // borderBottomColor: COLORS.orange,
    // borderLeftColor: COLORS.orange,

    marginBottom: 10,
    elevation: 1,
    borderRadius: 5,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
