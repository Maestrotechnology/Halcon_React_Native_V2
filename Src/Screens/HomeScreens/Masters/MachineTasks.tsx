import {useEffect, useState} from 'react';
import {COLORS, FONTSIZES} from '../../../Utilities/Constants';
import HOCView from '../../../Components/HOCView';
import {ActivityIndicator, View} from 'react-native';
import CustomButton from '../../../Components/CustomButton';
import {CommonStyles} from '../../../Utilities/CommonStyles';
import SegmentedControl from '../../../Components/SegmentedControl';
import {UseToken} from '../../../Utilities/StoreData';
import {ConvertJSONtoFormData} from '../../../Utilities/Methods';
import {MachineMappingListService} from '../../../Services/Services';
import {useIsFocused} from '@react-navigation/native';
import {AddEditModalScreenProsp, ApiResponse} from '../../../@types/Global';
import {MachinesTaskMappingListDataProps} from '../../../@types/api';
import Toast from '../../../Components/Toast';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
import StyledText from '../../../Components/StyledText';
import GlobaModal from '../../../Components/GlobalModal';
import AddEditMachineTasksModal from '../../../Modals/ModifyModals/AddEditMachineTasksModal';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

export default function MachineTasks({navigation, route}: any) {
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [permissionLoader, setPermissionLoader] = useState(false);
  // let CurrentIndex = 0;
  const [currentIndex, setCurrentIndex] = useState(0);
  const token = UseToken();
  const focused = useIsFocused();
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const {item} = route.params || {};
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

  const Tabs = [
    {
      name: 'Days',
    },
    {
      name: 'Weeks',
    },
    {
      name: 'Months',
    },
  ];

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;

    if (token) {
      getTasksList(0, 1);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, focused]);

  const getTasksList = (index = 0, page = 1) => {
    let formData = new FormData();
    formData.append('token', token);
    formData.append('category', index);
    formData.append('machine_id', item?.machine_id);

    MachineMappingListService(formData, page)
      .then(res => {
        const response: ApiResponse<MachinesTaskMappingListDataProps> =
          res.data;

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
      getTasksList(currentIndex, currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    getTasksList(currentIndex, 1);
  };

  const closeTaskModal = () => {
    if (isMount) {
      setAddEditMachineTask({lineData: null, show: false, type: ''});
    }
  };

  return (
    <>
      <HOCView
        isListLoading={isListLoader}
        secondaryHeaderTitle={item.machine_name || 'Machine'}
        isShowSecondaryHeaderBtn
        secondaryBtnTextStyle={{fontSize: FONTSIZES.small}}
        onHeaderBtnPress={() => {
          // handleCheckAccessToAdd();
          setAddEditMachineTask({
            type: 'Create',
            lineData: null,
            show: true,
          });
        }}
        headerProps={{
          headerTitle: 'Machine Tasks',
          isEnableMenu: false,
          onBackPress: () => {
            navigation.goBack();
          },
        }}
        secondaryBtnTitle={
          machineTaskList?.length > 0 ? 'Update Settings' : 'Add Task'
        }
        isLoading={isLoading}
        isBtnLoading={permissionLoader}>
        <View
          style={[
            CommonStyles.flexRow,
            {
              justifyContent: 'space-between',
              marginVertical: 5,
              marginBottom: 10,
            },
          ]}>
          <StyledText>Periodic Checks In</StyledText>

          {machineTaskList?.length > 0 ? (
            <CustomButton
              textStyle={{fontSize: FONTSIZES.small}}
              isDisabled={false}
              onPress={() => {}}
              style={[{width: '45%'}]}>
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
          tabs={Tabs}
          onChange={index => {
            setCurrentIndex(index);
            getTasksList(index);
          }}
          currentIndex={currentIndex}
        />

        <GlobaModal
          title={`${addEditMachineTask?.type} Machine`}
          visible={addEditMachineTask?.show}
          onClose={closeTaskModal}>
          <AddEditMachineTasksModal
            lineData={addEditMachineTask?.lineData || null}
            type={addEditMachineTask?.type}
            onApplyChanges={() => {
              getTasksList(currentIndex, 1);
            }}
            onClose={closeTaskModal}
            category={currentIndex}
          />
        </GlobaModal>
      </HOCView>
    </>
  );
}
