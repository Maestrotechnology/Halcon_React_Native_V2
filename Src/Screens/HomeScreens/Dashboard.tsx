import {BarChart, barDataItem} from 'react-native-gifted-charts';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getDashboardCardsService,
  getDashboardMonthlyReportService,
  SpindleReportGraphListService,
  TaskPerformanceService,
} from '../../Services/Services';
import Toast from '../../Components/Toast';
import {GetUserData, UseToken} from '../../Utilities/StoreData';
import {
  DashboardCardKeyProps,
  DashboardCardsApiResponseProps,
  DashboardMonthlyReportProps,
} from '../../@types/api';
import HOCView from '../../Components/HOCView';
import StyledText from '../../Components/StyledText';
import {IconType} from '../../Utilities/Icons';
import SVGIcon from '../../Components/SVGIcon';
import {COLORS, FONTSIZES, WINDOW_WIDTH} from '../../Utilities/Constants';
import {FONTS} from '../../Utilities/Fonts';
import {useNavigation} from '@react-navigation/native';
import {getCatchMessage} from '../../Utilities/GeneralUtilities';
import {CommonStyles} from '../../Utilities/CommonStyles';
import {ConvertJSONtoFormData} from '../../Utilities/Methods';
import SpindleHoursReport from './Reports/SpindleHoursReport';
import CommonPieChart from '../../Components/CommonPieChart';
import {SpindleReportFilterProps} from '../../@types/modals';
import {TaskPerformanceDataProps} from '../../@types/general';
import CustomLegend from '../../Components/CustomLegend';
import {ReportLegentOptions} from '../../Utilities/StaticDropdownOptions';

var isMount = true;

type DashboardCardProp = {
  displayName: string;
  total: number;
  bg_color: string;
  icon: IconType;
  icon_bg: string;
  data: {
    displayName: string;
    value: number;
    key: DashboardCardKeyProps;
    type: number;
  }[];
};

const Dashboard = () => {
  const token = UseToken();
  const navigation: any = useNavigation();
  const userData = GetUserData();

  const [SpindleReportList, setSpindleReportList] = useState([]);
  const [available_running_hours, setRunningHours] = useState(0);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [showPreventiveReport, setShowPreventiveReport] = useState(false);
  const [showCompletedTask, setShowCompletedTask] = useState(true);
  const [monthlyReport, setMonthlyReport] =
    useState<DashboardMonthlyReportProps | null>(null);

  const [dashboardCards, setDashboardCards] = useState<DashboardCardProp[]>([
    {
      displayName: 'Service Request',
      total: 0,
      icon: 'serviceReqActiveIcon',
      bg_color: '#F6D5CC',
      icon_bg: '#FF7E5C',
      data: [
        {
          displayName: 'Pending',
          value: 0,
          key: 'pending',
          type: 1,
        },
        {
          displayName: 'On Going',
          value: 0,
          key: 'ongoing',
          type: 2,
        },
        {
          displayName: 'Completed',
          value: 0,
          key: 'completed',
          type: 3,
        },
        {
          displayName: 'Over Due',
          value: 0,
          key: 'overdue',
          type: 4,
        },
      ],
    },
    {
      displayName: 'Preventive SR',
      total: 0,
      icon: 'preventiveActiveIcon',
      bg_color: '#C5E3ED',
      icon_bg: '#39BFEA',
      data: [
        {
          displayName: 'Pending',
          value: 0,
          key: 'pending',
          type: 1,
        },
        {
          displayName: 'On Going',
          value: 0,
          key: 'ongoing',
          type: 2,
        },
        {
          displayName: 'Completed',
          value: 0,
          key: 'completed',
          type: 3,
        },
        {
          displayName: 'Over Due',
          value: 0,
          key: 'overdue',
          type: 4,
        },
      ],
    },
  ]);

  const handleGetSpindleReportList = (data?: SpindleReportFilterProps) => {
    let formData = new FormData();
    formData.append('token', token);
    if (data?.division_id?.division_id) {
      formData.append('division_id', data?.division_id?.division_id);
    }
    if (data?.work_center_id?.work_center_id) {
      formData.append('work_center_id', data?.work_center_id?.work_center_id);
    }
    SpindleReportGraphListService(formData)
      .then(response => {
        if (response?.data?.status === 1) {
          let chartdata = response?.data?.data?.items?.filter((ele: any) => {
            if (ele?.spindle_hr !== null) {
              return {
                equipment_id: ele?.equipment_id,
                machine_name: ele?.machine_name,
                spindle_hr: ele?.spindle_hr,
              };
            }
          });

          setRunningHours(response?.data?.data?.available_running_hours);
          setSpindleReportList(chartdata);
        } else {
          Toast.error(response?.data?.msg);
        }
      })
      .catch(error => {
        getCatchMessage(error);
      })
      .finally(() => {});
  };
  useEffect(() => {
    isMount = true;

    if (token) {
      handleGetDashboardCards();
      getMonthlyReport();
      handleGetSpindleReportList();
      handleGetTaskperformanceData();
    }

    return () => {
      isMount = false;
    };
  }, [token, userData]);

  const getMonthlyReport = () => {
    const data = {
      token,
    };
    getDashboardMonthlyReportService(ConvertJSONtoFormData(data))
      .then(res => {
        if (res?.data?.status) {
          setMonthlyReport(res?.data?.data || null);
        }
      })
      .catch(err => getCatchMessage(err))
      .finally(() => {});
  };

  const handleGetDashboardCards = () => {
    const data = {
      token: token,
    };
    getDashboardCardsService(ConvertJSONtoFormData(data))
      .then(res => {
        const response: DashboardCardsApiResponseProps = res?.data;
        if (response?.status) {
          setDashboardCards(pre => [
            {
              ...pre[0],
              total: response?.data?.SR?.total,
              data: [
                ...pre[0]?.data?.map(ele => ({
                  ...ele,
                  value: response?.data?.SR[ele?.key],
                })),
              ],
            },
            {
              ...pre[1],
              total: response?.data?.PreventiveSR?.total,
              data: [
                ...pre[1]?.data?.map(ele => ({
                  ...ele,
                  value: response?.data?.PreventiveSR[ele?.key],
                })),
              ],
            },
          ]);
        }
      })
      .catch(err => getCatchMessage(err))
      .finally(() => {});
  };

  const getChartData = (type: 'preventive' | 'service') => {
    const tempdata =
      type === 'preventive'
        ? monthlyReport?.preventiveRequest || []
        : monthlyReport?.serviceRequest || [];

    const finalArr = [...tempdata]?.reduce((pre: barDataItem[], curr) => {
      const newArray: barDataItem[] = [...pre];
      const data = Object.keys(curr)?.map((ele, index) => {
        if (index === 0) {
          return ele;
        } else if (index === 1) {
          const value =
            type === 'preventive'
              ? // @ts-ignore
                curr?.total_preventive || 0
              : // @ts-ignore
                curr?.total_sr || 0;
          newArray.push({
            value: value,
            spacing: 3,
            label: moment(curr?.created_at, 'YYYY-MM-DD').format('MMM'),
            labelWidth: 30,
            labelTextStyle: {color: 'gray'},
            frontColor: '#017efa',
            topLabelComponent: value
              ? () => (
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 12,
                      height: 20,
                    }}>
                    {value}
                  </Text>
                )
              : undefined,
            onPress: () => {
              handleNavigation(curr?.created_at);
            },
          });
          return ele;
        }
        // @ts-ignore
        const currValue = curr[ele];
        newArray.push({
          value: currValue || 0,
          frontColor: index === 2 ? '#4ab58e' : '#fab101',
          topLabelComponent:
            currValue || 0
              ? () => (
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 12,
                      height: 20,
                    }}>
                    {currValue}
                  </Text>
                )
              : undefined,
          onPress: () => {
            handleNavigation(curr?.created_at);
          },
        });
        return ele;
      });
      return newArray;
    }, []);

    return finalArr;
  };
  const [taskPerformanceData, setTaskPerformanceData] =
    useState<TaskPerformanceDataProps>({
      completedTaskPercentage: 0,
      faultTaskPercentage: 0,
    });
  const handleGetTaskperformanceData = () => {
    const data = {
      token: token,
    };
    TaskPerformanceService(ConvertJSONtoFormData(data))
      .then(res => {
        const response: any = res?.data;
        if (response?.status) {
          setTaskPerformanceData({
            completedTaskPercentage: response?.data?.completedTaskPercentage,
            faultTaskPercentage: response?.data?.faultTaskPercentage,
          });
        }
      })
      .catch(err => getCatchMessage(err))
      .finally(() => {});
  };

  const handleNavigation = (date: string) => {
    const start_date = moment(date, 'YYYY-MM-DD')
      .startOf('month')
      .format('YYYY-MM-DD');
    const end_date = moment(date, 'YYYY-MM-DD')
      .endOf('month')
      .format('YYYY-MM-DD');

    if (!showPreventiveReport) {
      navigation.navigate('ServiceRequestStack', {
        screen: 'ServiceRequest',
        params: {
          date: {
            start_date,
            end_date,
          },
        },
      });
    } else {
      navigation.navigate('PreventiveSRStack', {
        date: {
          start_date,
          end_date,
        },
      });
    }
  };
  const onRefresh = async () => {
    if (isMount) {
      setisRefreshing(true);
    }

    try {
      await Promise.all([
        handleGetSpindleReportList(),
        getMonthlyReport(),
        handleGetDashboardCards(),
        handleGetTaskperformanceData(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setisRefreshing(false);
    }
  };
  return (
    <HOCView
      isEnableScrollView
      headerProps={{
        headerTitle: 'Dashboard',
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            if (onRefresh) onRefresh();
          }}
        />
      }>
      <View>
        {dashboardCards?.map((cardGroup, cardGroupIndex) => {
          return (
            <View
              style={{
                backgroundColor: cardGroup?.bg_color,
                borderRadius: 8,
                padding: 8,
                marginBottom: 10,
              }}
              key={cardGroup?.displayName}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  ...styles.cardItemContainer,
                  width: '100%',
                  flexDirection: 'row',
                  marginBottom: 0,
                }}>
                <View
                  style={{
                    ...styles.iconConainer,
                    backgroundColor: cardGroup?.icon_bg,
                  }}>
                  <SVGIcon width={20} icon={cardGroup?.icon} />
                </View>
                <View>
                  <StyledText
                    style={{
                      color: '#242425',
                      fontSize: 14,
                      fontFamily: FONTS.poppins.medium,
                    }}>
                    {cardGroup?.displayName}{' '}
                    <StyledText
                      style={{
                        color: COLORS.black,
                        fontSize: FONTSIZES.small,
                        fontFamily: FONTS.poppins.regular,
                      }}>
                      {`(${moment(new Date()).format('MMMM')})`}
                    </StyledText>
                  </StyledText>

                  <StyledText
                    style={{
                      color: '#232323',
                      fontSize: 18,
                      fontFamily: FONTS.poppins.semibold,
                    }}>
                    {cardGroup?.total}
                  </StyledText>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: COLORS.white,
                  marginBottom: 10,
                }}
              />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  flexWrap: 'wrap',
                  gap: 4,
                }}>
                {cardGroup?.data?.map((card, cardIndex) => {
                  return (
                    <TouchableOpacity
                      key={JSON.stringify(card)}
                      onPress={() => {
                        if (cardGroupIndex === 0) {
                          navigation.navigate('ServiceRequestStack', {
                            screen: 'ServiceRequest',
                            params: {
                              serviceType: card?.type,
                            },
                          });
                        } else {
                          navigation.navigate('PreventiveSRStack', {
                            preventiveType: card?.type,
                          });
                        }
                      }}
                      style={{
                        width: '24%',
                        backgroundColor: COLORS.white,
                        padding: 8,
                        borderRadius: 10,
                      }}>
                      <View>
                        <StyledText
                          style={{
                            color: '#8A8A8A',
                            fontSize: FONTSIZES.extraTiny,
                            fontFamily: FONTS.poppins.regular,
                          }}>
                          {card?.displayName}
                        </StyledText>
                        <StyledText
                          style={{
                            color: '#232323',
                            fontSize: FONTSIZES.medium,
                            fontFamily: FONTS.poppins.semibold,
                          }}>
                          {card?.value}
                        </StyledText>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

      <View>
        <StyledText style={styles.subHeader}>Report</StyledText>

        <View
          style={{
            ...styles.cardItemContainer,
            borderRadius: 10,
            backgroundColor: COLORS.white,
          }}>
          <View style={{...CommonStyles.flexRow, justifyContent: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => {
                setShowPreventiveReport(pre => !pre);
              }}
              style={{
                ...styles.reportBtn,
                backgroundColor: !showPreventiveReport
                  ? COLORS.primary
                  : COLORS.borderColor,
                marginRight: 10,
              }}>
              <StyledText
                style={{
                  ...styles.reportBtnText,
                  paddingTop: 1,
                }}>
                Service
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowPreventiveReport(pre => !pre);
              }}
              style={{
                ...styles.reportBtn,
                backgroundColor: showPreventiveReport
                  ? COLORS.primary
                  : COLORS.borderColor,
              }}>
              <StyledText
                style={{
                  ...styles.reportBtnText,
                  paddingTop: 1,
                }}>
                Preventive
              </StyledText>
            </TouchableOpacity>
          </View>

          <BarChart
            key={showPreventiveReport ? 'preventive' : 'service'}
            data={[
              ...getChartData(showPreventiveReport ? 'preventive' : 'service'),
            ]}
            barWidth={18}
            spacing={5}
            barBorderTopLeftRadius={4}
            barBorderTopRightRadius={4}
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{color: 'gray'}}
            noOfSections={3}
            width={WINDOW_WIDTH - 100}
          />
          <CustomLegend
            legendList={
              showPreventiveReport
                ? ReportLegentOptions.filter((ele, index) => index !== 2)
                : ReportLegentOptions
            }
          />
        </View>
        <SpindleHoursReport
          SpindleReportList={SpindleReportList}
          available_running_hours={available_running_hours}
          handleGetSpindleReportList={handleGetSpindleReportList}
        />
        <View
          style={{
            padding: 16,
            borderRadius: 20,
            backgroundColor: '#fff',
            gap: 10,
          }}>
          <StyledText style={[styles.subHeader, {paddingBottom: 0}]}>
            Tasks performance
          </StyledText>
          <View style={{...CommonStyles.flexRow, justifyContent: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => {
                setShowCompletedTask(pre => !pre);
              }}
              style={{
                ...styles.reportBtn,
                backgroundColor: showCompletedTask
                  ? COLORS.primary
                  : COLORS.borderColor,
                marginRight: 10,
              }}>
              <StyledText
                style={{
                  ...styles.reportBtnText,
                  paddingTop: 1,
                }}>
                Completed
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowCompletedTask(pre => !pre);
              }}
              style={{
                ...styles.reportBtn,
                backgroundColor: !showCompletedTask
                  ? COLORS.primary
                  : COLORS.borderColor,
              }}>
              <StyledText
                style={{
                  ...styles.reportBtnText,
                  paddingTop: 1,
                }}>
                Fault
              </StyledText>
            </TouchableOpacity>
          </View>
          <CommonPieChart
            taskPerformanceData={
              showCompletedTask
                ? taskPerformanceData?.completedTaskPercentage
                : taskPerformanceData?.faultTaskPercentage
            }
            title={showCompletedTask ? 'Completed' : 'Fault'}
          />
        </View>
      </View>
    </HOCView>
  );
};

export default Dashboard;

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
});
