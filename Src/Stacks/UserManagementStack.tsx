import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  UserScreensNavigationProps,
  UserStackStackParamList,
} from '../@types/navigation';
import UserList from '../Screens/HomeScreens/UserManagement/UserList';
import AccessRoleList from '../Screens/HomeScreens/UserManagement/AccessRoleList';
import AddEditUser from '../Screens/HomeScreens/UserManagement/AddEditUser';
import AddEditRole from '../Screens/HomeScreens/UserManagement/AddEditRole';

const Stack = createNativeStackNavigator<UserStackStackParamList>();

const UserManagementStack = ({route}: UserScreensNavigationProps) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Stack.Screen name="UserList" component={UserList} />
      <Stack.Screen name="AddEditUser" component={AddEditUser} />
      <Stack.Screen name="AccessRoleList" component={AccessRoleList} />
      <Stack.Screen name="AddEditRole" component={AddEditRole} />
    </Stack.Navigator>
  );
};

export default UserManagementStack;

const styles = StyleSheet.create({});
