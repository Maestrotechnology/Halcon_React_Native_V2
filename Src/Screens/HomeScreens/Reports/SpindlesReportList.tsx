import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UseToken} from '../../../Utilities/StoreData';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import {TaskListDataProps} from '../../../@types/api';
import {actionListProps} from '../../../Components/types';
import {SpindleReportFilterProps} from '../../../@types/modals';
import {SpindleReportListService} from '../../../Services/Services';
import {
  getCatchMessage,
  getMonthName,
} from '../../../Utilities/GeneralUtilities';
import Toast from '../../../Components/Toast';
import HOCView from '../../../Components/HOCView';
import {CommonStyles} from '../../../Utilities/CommonStyles';
import CustomButton from '../../../Components/CustomButton';
import TableView from '../../../Components/TableView';
import GlobaModal from '../../../Components/GlobalModal';
import {AddEdittaskProps} from '../../../@types/general';
import {ReportStackNavigationProps} from '../../../@types/navigation';
import {ApiResponse} from '../../../@types/Global';
import EditSpindleReportModal from '../../../Modals/ModifyModals/EditSpindleReportModal';
import SpindleReportFilterModal from '../../../Modals/Filter/SpindleReportFilterModal';
import SVGIcon from '../../../Components/SVGIcon';
import {COLORS} from '../../../Utilities/Constants';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

export default function SpindlesReportList({
  navigation,
}: ReportStackNavigationProps) {
  const token = UseToken();
  const {bottom} = useSafeAreaInsets();
  const focused = useIsFocused();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [SpindleReportList, setSpindleReportList] = useState<
    TaskListDataProps[]
  >([]);
  const [actionsList, setActionList] = useState<actionListProps[]>([
    {
      id: 2,
      name: 'editIcon',
      // isShow: ServiceRequestPermissions.edit ? true : false,
      isShow: true,
      disableKey: 'disableEditIcon',
    },
  ]);
  const [filterData, setfilterData] = useState<SpindleReportFilterProps | null>(
    {
      division_id: null,
      work_center_id: null,
      machine_id: null,
    },
  );
  const [isShowFilter, setisShowFilter] = useState<boolean>(false);
  const [EditSpindleHours, setAddEditTask] = useState<AddEdittaskProps>({
    type: '',
    lineData: null,
    show: false,
  });

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;

    if (token) {
      handleGetSpindleReportList(1);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, focused]);

  const handleGetSpindleReportList = (
    page: number = 1,
    filter: SpindleReportFilterProps | null = filterData,
  ) => {
    const formData = new FormData();
    formData.append('token', token);
    if (filter?.division_id?.division_id) {
      formData.append('division_id', filter?.division_id?.division_id);
    }
    if (filter?.work_center_id?.work_center_id) {
      formData.append('work_center_id', filter?.work_center_id?.work_center_id);
    }
    if (filter?.machine_id?.machine_id) {
      formData.append('work_center_id', filter?.machine_id?.machine_id);
    }
    SpindleReportListService(formData, page)
      .then(res => {
        const response: ApiResponse<TaskListDataProps> = res.data;

        if (response.status === 1) {
          if (page === 1) {
            totalPages = response.data?.total_page || 1;

            setSpindleReportList(response.data?.items || []);
          } else {
            setSpindleReportList(prev => [...prev, ...response.data?.items]);
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
      handleGetSpindleReportList(currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    handleGetSpindleReportList(1);
  };

  const onApplyFilter = (data: SpindleReportFilterProps | null) => {
    if (isMount) {
      setisListLoader(true);
      setfilterData(data);
    }

    currentPage = 1;
    totalPages = 1;
    handleGetSpindleReportList(1, data);
  };

  const closeFilterModal = () => {
    if (isMount) {
      setisShowFilter(false);
    }
  };
  const closeTaskModal = () => {
    if (isMount) {
      setAddEditTask({lineData: null, show: false, type: ''});
    }
  };

  return (
    <HOCView
      isListLoading={isListLoader}
      headerProps={{
        headerTitle: 'Spindles Report',
      }}
      isLoading={isLoading}>
      <View style={[CommonStyles.flexRow, {justifyContent: 'space-between'}]}>
        <CustomButton
          onPress={() => {
            setisShowFilter(true);
          }}
          type="secondary"
          style={{width: '30%', marginVertical: 8}}>
          Filter
        </CustomButton>
        <SVGIcon
          icon="ChartIcon"
          fill={COLORS.webBlack}
          width={20}
          height={20}
          isButton
          onPress={() => {
            navigation.navigate('SpindleReportChart');
          }}
        />
      </View>
      <View style={{marginBottom: bottom, flex: 1}}>
        <TableView
          rowData={[
            {key: 'machine_id', label: 'Machine Id'},
            {key: 'machine_name', label: 'Machine Name'},
            {key: 'work_center_name', label: 'Work Center'},
            {key: 'division_description', label: 'Division'},
            {
              key: 'previous_month_consumed_hour',
              label: `${getMonthName()?.previous} Running Hours`,
              type: 'converttoHours',
            },
            {
              key: 'previous_month_spindle_hr',
              label: `${getMonthName()?.previous} Total Running Hours`,
              type: 'converttoHours',
            },
            {
              key: 'current_month_spindle_hr',
              label: `${getMonthName()?.current} Total Running Hours`,
              type: 'converttoHours',
            },
          ]}
          dataList={[...SpindleReportList]?.map(ele => ({
            ...ele,
          }))}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          isActionAvailable
          actionsList={actionsList}
          onActionPress={(actionType: number, val: TaskListDataProps) => {
            if (actionType === 2) {
              setAddEditTask({type: 'Update', lineData: val, show: true});
            } else if (actionType === 3) {
              setAddEditTask({type: 'View', lineData: val, show: true});
            }
          }}
        />
      </View>
      {isShowFilter && (
        <GlobaModal
          title="Spindles Report Filter"
          visible={isShowFilter}
          onClose={closeFilterModal}>
          <SpindleReportFilterModal
            filterData={filterData}
            onApplyFilter={onApplyFilter}
            onClose={closeFilterModal}
            isReport={true}
          />
        </GlobaModal>
      )}
      {EditSpindleHours?.show && (
        <GlobaModal
          title={`${EditSpindleHours?.type} Spindles Report`}
          visible={EditSpindleHours?.show}
          onClose={closeTaskModal}>
          <EditSpindleReportModal
            lineData={EditSpindleHours?.lineData}
            type={EditSpindleHours?.type}
            onApplyChanges={() => {
              handleGetSpindleReportList(1);
            }}
            onClose={closeTaskModal}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
}

const styles = StyleSheet.create({});
