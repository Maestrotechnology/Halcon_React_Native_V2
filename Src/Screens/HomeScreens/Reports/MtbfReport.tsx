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
  ListMTBFreportService,
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

export default function MtbfReport({navigation}: ReportStackNavigationProps) {
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
  const [MTBFReportList, setMTBFreportList] = useState<TaskListDataProps[]>([]);
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
            let result: any = {...filterData, machine_id: response?.data[0]};
            setfilterData(result);
            setMachineList([...response?.data]);
            handleGetListMTBFreport(result);
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

  const maxYValue = Math.max(
    ...MTBFReportList.map((item: any) => item.average), // Highest data value
    RunningHour, // Include the reference line value
  );
  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;

    if (token) {
      handleGetMachineList();
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, focused]);

  const handleGetListMTBFreport = (
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

    ListMTBFreportService(formData)
      .then(res => {
        const response: any = res.data;

        if (response.status === 1) {
          const chartdata = res?.data?.data?.map((ele: any) => {
            return {
              month: new Date(2021, ele?.month - 1, 10).toLocaleString(
                'default',
                {
                  month: 'short',
                },
              ),
              monthnumber: ele?.month,
              average: Math.round(ele?.average),
              request_count: ele?.request_count,
              is_max: ele?.is_max,
            };
          });

          setRunningHours(res.data?.line_value);

          setMTBFreportList(chartdata || []);
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

  return (
    <HOCView
      isListLoading={isListLoader}
      headerProps={{
        headerTitle: 'MTBF Report',
      }}
      secondaryHeaderTitle="MTBF Report"
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
            handleGetListMTBFreport(finalFilter);
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
            handleGetListMTBFreport(finalFilter);
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
          data={MTBFReportList?.map((item: any) => ({
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
          data={MTBFReportList?.map((item: any) => ({
            value: item?.average,
            label: item?.month,
          }))}
          color={'#A70D49'}
          thickness={2}
          xAxisLabelTexts={MTBFReportList.map((item: any) => item.month)}
          yAxisTextStyle={styles.yAxisTextStyle}
          xAxisLabelTextStyle={styles.yAxisTextStyle}
          xAxisColor={'black'}
          yAxisColor={'black'}
          hideYAxisText={false}
          yAxisLabelWidth={40}
          yAxisOffset={0}
          verticalLinesColor={COLORS.gray}
          showFractionalValues={false}
          showReferenceLine1
          width={WINDOW_WIDTH - 130}
          referenceLine1Position={RunningHour}
          //  Dynamically adjust Y-axis to fit all data points & reference line
          maxValue={maxYValue + 20} // Add some padding for visibility
          referenceLine1Config={{
            color: '#f89f1d',
            thickness: 2,
            type: 'solid',
          }}
          secondaryData={MTBFReportList.map((item: any) => ({
            value: item.request_count,
          }))}
          secondaryLineConfig={{
            color: COLORS.orange,
            thickness: 1.5,
            strokeDashArray: [6, 4],
          }}
          secondaryYAxis={{
            maxValue: 5,
            noOfSections: 4,
            showFractionalValues: true,
            roundToDigits: 3,

            yAxisColor: COLORS.orange,
            yAxisIndicesColor: COLORS.orange,
          }}
          xAxisIndicesHeight={4}
          initialSpacing={0}
          endSpacing={0}
          adjustToWidth
        />
        <CustomLegend
          legendList={[
            {color: '#A70D49', label: 'Actual Hours'},
            {color: '#f89f1d', label: 'Line Value'},
            {color: COLORS.orange, label: 'Machine Failure Count'},
          ]}
        />
      </View>
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
