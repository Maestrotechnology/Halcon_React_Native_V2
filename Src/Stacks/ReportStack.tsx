import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ReportStackStackParamList} from '../@types/navigation';

import SpindlesReportList from '../Screens/HomeScreens/Reports/SpindlesReportList';

const Stack = createNativeStackNavigator<ReportStackStackParamList>();

const ReportStack = () => {
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
      </Stack.Navigator>
    </>
  );
};

export default ReportStack;

const styles = StyleSheet.create({});
