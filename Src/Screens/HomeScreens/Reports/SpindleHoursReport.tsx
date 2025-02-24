import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {COLORS, FONTSIZES, WINDOW_WIDTH} from '../../../Utilities/Constants';
import {converttoHours} from '../../../Utilities/GeneralUtilities';
import {FONTS} from '../../../Utilities/Fonts';
import StyledText from '../../../Components/StyledText';
import SVGIcon from '../../../Components/SVGIcon';
import GlobaModal from '../../../Components/GlobalModal';
import SpindleReportFilterModal from '../../../Modals/Filter/SpindleReportFilterModal';
import {SpindleReportFilterProps} from '../../../@types/modals';
var isMount = true;
export default function SpindleHoursReport({
  SpindleReportList,
  available_running_hours = 0,
  handleGetSpindleReportList,
}: any) {
  const [isShowFilter, setisShowFilter] = useState<boolean>(false);
  const [filterData, setfilterData] = useState<SpindleReportFilterProps | null>(
    {
      division_id: null,
      work_center_id: null,
    },
  );

  let ChartData = SpindleReportList?.map((ele: any) =>
    ele?.spindle_hr
      ? {
          value: converttoHours(ele?.spindle_hr),
          label: ele?.machine_name,
          lineValue: available_running_hours,
        }
      : 0,
  );

  const lineData = ChartData.map((item: any) => ({
    value: available_running_hours,
  }));

  const CartNames = [
    {name: 'Jan Running Hrs', color: '#07bc0c', key: 1},
    {name: 'Available Hrs', color: '#2187ab', key: 2},
  ];
  const closeFilterModal = () => {
    setisShowFilter(false);
  };
  const onApplyFilter = (data: SpindleReportFilterProps | null) => {
    if (isMount) {
      // setisListLoader(true);
      setfilterData(data);
    }

    handleGetSpindleReportList(data);
  };
  return (
    <View>
      <View style={styles.rowStyle}>
        <StyledText style={styles.subHeader}>Spindles Hours Report</StyledText>
        <SVGIcon
          icon="FilterIcon"
          fill={COLORS.darkBlue}
          width={25}
          height={25}
          isButton
          onPress={() => setisShowFilter(true)}
        />
      </View>

      <View
        style={{
          ...styles.cardItemContainer,
          borderRadius: 10,
          backgroundColor: COLORS.white,
        }}>
        <BarChart
          data={ChartData}
          barWidth={18}
          spacing={15}
          barBorderTopLeftRadius={4}
          barBorderTopRightRadius={4}
          frontColor={'#2187ab'} // Bar color
          xAxisThickness={0}
          yAxisThickness={0}
          noOfSections={5}
          yAxisTextStyle={{color: 'gray'}}
          showLine={available_running_hours ? true : false}
          lineConfig={{
            color: '#07bc0c',
            thickness: 2,
            curved: false, // Ensure it's straight
            hideDataPoints: true,
            strokeDashArray: [6, 4],
          }}
          width={WINDOW_WIDTH - 100}
          lineData={lineData} // Add separate line data
        />
        <View style={styles.LableBox}>
          {CartNames?.map(item => {
            return (
              <View style={styles.lineKey}>
                <View
                  style={{
                    height: 15,
                    width: 15,
                    backgroundColor: item.color,
                    borderRadius: 20,
                  }}
                />
                <StyledText style={styles.lableText}>{item?.name}</StyledText>
              </View>
            );
          })}
        </View>
      </View>
      {isShowFilter && (
        <GlobaModal
          title="Spindles Hours Report Filter"
          visible={isShowFilter}
          onClose={closeFilterModal}>
          <SpindleReportFilterModal
            filterData={filterData}
            onApplyFilter={onApplyFilter}
            onClose={closeFilterModal}
          />
        </GlobaModal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  iconConainer: {
    width: 40,
    height: 40,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardItemContainer: {
    marginBottom: 10,
    display: 'flex',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardTextContainer: {
    // width: WINDOW_WIDTH / 2 - 90,
  },
  reportBtn: {
    alignSelf: 'flex-end',
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 6,
    minWidth: 80,
  },
  reportBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.poppins.medium,
    fontSize: FONTSIZES.tiny,
  },
  subHeader: {
    paddingBottom: 5,
    fontFamily: FONTS.poppins.semibold,
    color: '#231F20',
    fontSize: 17,
  },
  customDataPoint: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.white,
    borderRadius: 100,
    borderWidth: 2,
  },
  LableBox: {
    flexDirection: 'row',

    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  lineKey: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
  },
  lableText: {
    fontFamily: FONTS.poppins.regular,
    fontSize: FONTSIZES.tiny,
  },
  rowStyle: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    width: WINDOW_WIDTH - 40,
  },
});
