import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UseToken} from '../../../Utilities/StoreData';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import {SpindleListDataProps, TaskListDataProps} from '../../../@types/api';
import {actionListProps} from '../../../Components/types';
import {SpindleReportFilterProps} from '../../../@types/modals';
import {
  SpindleReportGraphListService,
  SpindleReportListService,
} from '../../../Services/Services';
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
import SpindleHoursReport from './SpindleHoursReport';
import ListEmptyComponent from '../../../Components/ListEmptyComponent';
import StyledText from '../../../Components/StyledText';
import PaginationButton from '../../../Components/PaginationButton';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

export default function SpindleReportChart({
  navigation,
}: ReportStackNavigationProps) {
  const token = UseToken();
  const {bottom} = useSafeAreaInsets();
  const focused = useIsFocused();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [spindleOtherDatas, setSpindleOtherDatas] = useState({total_pages: 0});
  const [available_running_hours, setRunningHours] = useState(0);
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
      handleGetSpindleChartReportList(1);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, focused]);

  const handleGetSpindleChartReportList = (
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
    SpindleReportGraphListService(formData, page)
      .then(res => {
        const response: any = res.data;

        if (response.status === 1) {
          setRunningHours(response?.data?.available_running_hours);
          setSpindleOtherDatas({items: [], ...response?.data});
          let chartdata = response?.data?.items?.filter((ele: any) => {
            if (ele?.spindle_hr !== null) {
              return {
                equipment_id: ele?.equipment_id,
                machine_name: ele?.machine_name,
                spindle_hr: ele?.spindle_hr,
              };
            }
          });

          if (page === 1) {
            totalPages = response.data?.total_page || 1;
            setSpindleReportList(chartdata || []);
          } else {
            setSpindleReportList(prev => [...prev, ...chartdata]);
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
      handleGetSpindleChartReportList(currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    handleGetSpindleChartReportList(1);
  };

  const onApplyFilter = (data: SpindleReportFilterProps | null) => {
    if (isMount) {
      setisListLoader(true);
      setfilterData(data);
    }

    currentPage = 1;
    totalPages = 1;
    handleGetSpindleChartReportList(1, data);
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
        headerTitle: 'Spindles Hours Report',
      }}
      isLoading={isLoading}>
      <View style={{marginBottom: bottom, flex: 1}}>
        {SpindleReportList?.length > 0 ? (
          <SpindleHoursReport
            SpindleReportList={SpindleReportList}
            available_running_hours={available_running_hours}
            handleGetSpindleReportList={handleGetSpindleChartReportList}
          />
        ) : (
          <ListEmptyComponent
            alignItems="center"
            errorText="No Reports Found"
          />
        )}
        {totalPages > 1 && (
          <PaginationButton
            totalPages={spindleOtherDatas?.total_pages}
            onPressNextButton={page => {
              handleGetSpindleChartReportList(page);
            }}
            onPressPreviousButton={page => {
              handleGetSpindleChartReportList(page);
            }}
          />
        )}
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
              handleGetSpindleChartReportList(1);
            }}
            onClose={closeTaskModal}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
}

const styles = StyleSheet.create({});
