import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UseToken} from '../../../Utilities/StoreData';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import {
  MachineDropdownListDataProps,
  TaskListDataProps,
} from '../../../@types/api';
import {MTTRReportFilterProps} from '../../../@types/modals';
import {
  getMachineDropdownListService,
  ListMTTRreportService,
} from '../../../Services/Services';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
import Toast from '../../../Components/Toast';
import HOCView from '../../../Components/HOCView';
import {CommonStyles} from '../../../Utilities/CommonStyles';
import CustomButton from '../../../Components/CustomButton';

import GlobaModal from '../../../Components/GlobalModal';
import {ReportStackNavigationProps} from '../../../@types/navigation';
import MTTRreportFilterModal from '../../../Modals/Filter/MTTRreportFilterModal';
import {LineChart} from 'react-native-gifted-charts';
import DropdownBox from '../../../Components/DropdownBox';
import DateTimePicker from '../../../Components/DateTimePicker';
import {
  MonthList,
  MttrReportTabs,
} from '../../../Utilities/StaticDropdownOptions';
import SegmentedControl from '../../../Components/SegmentedControl';
import {months} from 'moment';
import {COLORS, FONTSIZES} from '../../../Utilities/Constants';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {values} from 'lodash';
import {FONTS} from '../../../Utilities/Fonts';
import CustomLegend from '../../../Components/CustomLegend';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

export default function MttrReport({navigation}: ReportStackNavigationProps) {
  const token = UseToken();
  const {bottom} = useSafeAreaInsets();
  const focused = useIsFocused();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [RunningHour, setRunningHours] = useState(0);
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [machineList, setMachineList] = useState<
    MachineDropdownListDataProps[]
  >([]);
  const [ReportType, setReportType] = useState(0);
  const [MTTRReportList, setMTTRreportList] = useState<TaskListDataProps[]>([]);
  const currentYear = new Date().getFullYear();

  const years = Array.from({length: 100}, (_, i) => ({
    year: (currentYear - i).toString(),
  }));
  const [filterData, setfilterData] = useState<MTTRReportFilterProps | null>({
    machine_id: null,
    year: years[0],
    month: MonthList[new Date().getMonth()],
  });

  const [isShowFilter, setisShowFilter] = useState<boolean>(false);
  const handleGetMachineList = () => {
    const formData = new FormData();
    formData.append('token', token);

    getMachineDropdownListService(formData)
      .then(res => {
        const response = res.data;
        if (response.status === 1) {
          if (isMount) {
            setfilterData((pre: any) => ({
              ...pre,

              machine_id: response?.data[0],
            }));
            setMachineList([...response?.data]);
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
        }
      });
  };

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;

    if (token) {
      handleGetListMTTRreport();
      handleGetMachineList();
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, focused]);

  const handleGetListMTTRreport = (
    filter: MTTRReportFilterProps | null = filterData,
    reportType?: 1 | 0,
  ) => {
    const formData = new FormData();
    formData.append('token', token);

    if (filter?.machine_id?.machine_id) {
      formData.append('machine_id', filter?.machine_id?.machine_id);
    }
    if (filter?.year?.year) {
      formData.append('year', filter?.year?.year);
    }
    if (
      filter?.month?.id &&
      (reportType?.toString() ? reportType : ReportType)
    ) {
      formData.append('month', filter?.month?.id);
    }

    ListMTTRreportService(formData)
      .then(res => {
        const response: any = res.data;

        if (response.status === 1) {
          let chartdata = res?.data?.data?.map((ele: any) => {
            return {
              month: new Date(2021, ele.month - 1, 10).toLocaleString(
                'default',
                {
                  month: 'short',
                },
              ),
              monthnumber: ele?.month,
              average: Math.round(ele?.average),
            };
          });

          setRunningHours(res.data?.line_value);
          let result = [
            // {month: '', average: 0},
            ...chartdata,
            // {month: '', average: 0},
          ];
          setMTTRreportList(result || []);
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

  const onApplyFilter = (data: MTTRReportFilterProps | null) => {
    if (isMount) {
      setisListLoader(true);
      setfilterData(data);
    }

    currentPage = 1;
    totalPages = 1;
    handleGetListMTTRreport(data);
  };

  const closeFilterModal = () => {
    if (isMount) {
      setisShowFilter(false);
    }
  };

  return (
    <HOCView
      isListLoading={isListLoader}
      headerProps={{
        headerTitle: 'MTTR Report',
      }}
      secondaryHeaderTitle="MTTR Yearly Report"
      isLoading={isLoading}>
      <View style={styles.filterBlock}>
        <DropdownBox
          title="Machine"
          value={filterData?.machine_id}
          placeHolder="Select machine"
          apiType="machineList"
          onSelect={val => {
            let finalFilter: any = {
              ...filterData,
              machine_id: val || null,
            };
            setfilterData(finalFilter);
            handleGetListMTTRreport(finalFilter);
          }}
          mainContainerStyle={{width: '48%'}}
          type="search"
          fieldName="equipment_id"
          isLocalSearch
          searchFieldName="equipment_id"
          isShowClearIcon={false}
        />
        <DropdownBox
          title="Year"
          value={filterData?.year}
          placeHolder="Select Year"
          onSelect={val => {
            let finalFilter: any = {
              ...filterData,
              year: val || null,
            };

            setfilterData(finalFilter);
            handleGetListMTTRreport(finalFilter);
          }}
          options={years}
          type="miniList"
          mainContainerStyle={{width: '48%'}}
          fieldName="year"
          isShowClearIcon={false}
        />
      </View>
      <View
        style={{
          ...styles.cardItemContainer,
          borderRadius: 10,
          backgroundColor: COLORS.white,
        }}>
        {/* <LineChart
          data={MTTRReportList?.map((item: any) => ({
            value: item?.average,
            label: item?.machineName,
          }))}
          color={'#177AD5'}
          thickness={3}
          width={WINDOW_WIDTH - 100}
          dataPointsColor={'red'}
          spacing={20}
          noOfSections={5}
          data2={RunnigArrayList?.map(ele => ({value: ele}))}
        /> */}
        <LineChart
          data={MTTRReportList?.map((item: any) => ({
            value: item?.average,
            label: item?.month,
          }))}
          dataPointsColor={'#A70D49'}
          color={'#A70D49'}
          thickness={2}
          xAxisLabelTexts={MTTRReportList.map((item: any) => item.month)}
          yAxisTextStyle={styles.yAxisTextStyle}
          xAxisLabelTextStyle={styles.yAxisTextStyle}
          xAxisColor={'black'}
          yAxisColor={'black'}
          hideYAxisText={false}
          yAxisLabelWidth={40}
          yAxisOffset={0}
          yAxisExtraHeight={20}
          verticalLinesColor={COLORS.gray}
          showFractionalValues={false}
          showReferenceLine1
          width={WINDOW_WIDTH - 120} // Reduce padding for full width
          noOfSections={5}
          referenceLine1Position={RunningHour}
          referenceLine1Config={{
            color: COLORS.orange,
            thickness: 2,
            type: 'dotted',
          }}
          xAxisIndicesHeight={4}
          initialSpacing={5} // Ensure small space at start
          endSpacing={15} // Adjust manually if needed
          adjustToWidth // Ensures full width usage
        />
        <CustomLegend
          legendList={[
            {color: '#A70D49', label: 'Average Hours'},
            {color: COLORS.orange, label: 'Line Value'},
          ]}
        />
      </View>
      {isShowFilter && (
        <GlobaModal
          title="Yearly Report Filter"
          visible={isShowFilter}
          onClose={closeFilterModal}>
          <MTTRreportFilterModal
            filterData={filterData}
            onApplyFilter={onApplyFilter}
            onClose={closeFilterModal}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
}

const styles = StyleSheet.create({
  filterBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardItemContainer: {
    marginBottom: 10,
    display: 'flex',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  yAxisTextStyle: {
    fontFamily: FONTS.poppins.regular,
    fontSize: FONTSIZES.tiny,
    color: COLORS.gray,
  },
});
