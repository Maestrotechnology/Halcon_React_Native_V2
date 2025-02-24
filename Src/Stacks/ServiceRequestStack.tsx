import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ServiceRequestScreensNavigationProps,
  ServiceRequestStackParamList,
} from '../@types/navigation';
import ServiceRequest from '../Screens/HomeScreens/ServiceRequest';
import ServiceRequestCreationStack from './ServiceRequestCreationStack';
import ApprovalStatusList from '../Screens/HomeScreens/ServiceRequest/ApprovalStatusList';

const Stack = createNativeStackNavigator<ServiceRequestStackParamList>();

const ServiceRequestStack = ({
  route,
  navigation,
}: ServiceRequestScreensNavigationProps) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Stack.Screen
        // @ts-ignore
        initialParams={{
          // @ts-ignore
          machineId: route?.params?.machineId || '',
          // @ts-ignore
          serviceType: route?.params?.serviceType,
          // @ts-ignore
          date: route?.params?.date,
        }}
        name="ServiceRequest"
        component={ServiceRequest}
      />
      <Stack.Screen
        name="ServiceRequestCreationStack"
        component={ServiceRequestCreationStack}
      />
      <Stack.Screen name="ApprovalStatusList" component={ApprovalStatusList} />
    </Stack.Navigator>
  );
};

export default ServiceRequestStack;

const styles = StyleSheet.create({});
