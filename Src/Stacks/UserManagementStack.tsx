import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ServiceRequestScreensNavigationProps,
  ServiceRequestStackParamList,
  UserScreenScreensNavigationProps,
  UserStackStackParamList,
} from '../@types/navigation';
import ServiceRequest from '../Screens/HomeScreens/ServiceRequest';
import ServiceRequestCreationStack from './ServiceRequestCreationStack';
import UserList from '../Screens/HomeScreens/UserManagement/UserList';
import AccessRoleList from '../Screens/HomeScreens/UserManagement/AccessRoleList';

const Stack = createNativeStackNavigator<UserStackStackParamList>();

const UserManagementStack = ({
  route,
  navigation,
}: UserScreenScreensNavigationProps) => {
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
        name="UserList"
        component={UserList}
      />
      <Stack.Screen name="AccessRoleList" component={AccessRoleList} />
    </Stack.Navigator>
  );
};

export default UserManagementStack;

const styles = StyleSheet.create({});
