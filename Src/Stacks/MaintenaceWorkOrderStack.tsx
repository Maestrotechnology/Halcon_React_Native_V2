import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PreventiveSR from '../Screens/HomeScreens/PreventiveSR';
import {MaintananceWorkOrderParamList} from '../@types/navigation';
import MaintenacneWorkOrder from '../Screens/HomeScreens/MaintenanceWorkorder.tsx';
import AddWorkOrder from '../Screens/HomeScreens/MaintenanceWorkorder.tsx/AddWorkOrder.tsx';

const Stack = createNativeStackNavigator<MaintananceWorkOrderParamList>();

const MaintenaceWorkOrderStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="MaintenacneWorkOrder"
        component={MaintenacneWorkOrder}
      />
      <Stack.Screen name="AddWorkOrder" component={AddWorkOrder} />
    </Stack.Navigator>
  );
};

export default MaintenaceWorkOrderStack;

const styles = StyleSheet.create({});
