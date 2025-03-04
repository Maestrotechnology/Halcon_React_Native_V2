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

const ServiceRequestStack = ({route}: ServiceRequestScreensNavigationProps) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Stack.Screen name="ServiceRequest" component={ServiceRequest} />
      <Stack.Screen
        name="ServiceRequestCreationStack"
        component={ServiceRequestCreationStack}
      />
      <Stack.Screen name="ApprovalStatusList" component={ApprovalStatusList} />
    </Stack.Navigator>
  );
};

export default ServiceRequestStack;
