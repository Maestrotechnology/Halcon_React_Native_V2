import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ReportStackNavigationProps,
  ReportStackStackParamList,
} from '../@types/navigation';
import SpindlesReportList from '../Screens/HomeScreens/Reports/SpindlesReportList';
import MttrReport from '../Screens/HomeScreens/Reports/MttrReport';
import MtbfReport from '../Screens/HomeScreens/Reports/MtbfReport';
import SpindleReportChart from '../Screens/HomeScreens/Reports/SpindleReportChart';
import MttrMonthlyReport from '../Screens/HomeScreens/Reports/MttrMonthlyReport';

const Stack = createNativeStackNavigator<ReportStackStackParamList>();

const ReportStack = ({route, navigation}: ReportStackNavigationProps) => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        <Stack.Screen
          name="SpindlesReportList"
          component={SpindlesReportList}
        />
        <Stack.Screen
          name="SpindleReportChart"
          component={SpindleReportChart}
        />

        <Stack.Screen name="MttrReport" component={MttrReport} />
        <Stack.Screen name="MtbfReport" component={MtbfReport} />
        <Stack.Screen name="MttrMonthlyReport" component={MttrMonthlyReport} />
      </Stack.Navigator>
    </>
  );
};

export default ReportStack;

const styles = StyleSheet.create({});
