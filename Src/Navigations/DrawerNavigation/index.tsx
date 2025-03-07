import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Dashboard from '../../Screens/HomeScreens/Dashboard';
import CustomDrawerNavigation from './CustomDrawerNavigation';
import {
  DrawerNavigationParamList,
  DrawerScreensProps,
} from '../../@types/navigation';
import ServiceRequestStack from '../../Stacks/ServiceRequestStack';
import PreventiveSRStatck from '../../Stacks/PreventiveSRStatck';
import {GetPermissions} from '../../Utilities/StoreData';
import PermisionDeniedStack from '../../Screens/ErrorScreen/PermisionDeniedStack';
import MyProfile from '../../Screens/HomeScreens/Profile/MyProfile';
import UserManagementStack from '../../Stacks/UserManagementStack';
import MastersStack from '../../Stacks/MastersStack';
import ReportStack from '../../Stacks/ReportStack';

const Drawer = createDrawerNavigator<DrawerNavigationParamList>();

const DrawerNavigation = () => {
  const UserPermissions = GetPermissions();

  let isProfilePermissionGranted =
    UserPermissions?.service_dashboard?.service_dashboard_menu === 1 ||
    UserPermissions?.service_request?.service_request_menu === 1 ||
    UserPermissions?.preventive_sr?.preventive_sr_menu === 1;

  const drawerScreens: DrawerScreensProps[] = [
    {
      name: 'Dashboard',
      component: Dashboard,
      // hasPermission: UserPermissions?.service_dashboard?.service_dashboard_menu,
      hasPermission: 1,
    },
    {
      name: 'UserManagementStack',
      component: UserManagementStack,
      // hasPermission: UserPermissions?.service_dashboard?.service_dashboard_menu,
      hasPermission: 1,
    },
    {
      name: 'MastersStack',
      component: MastersStack,
      // hasPermission: UserPermissions?.service_dashboard?.service_dashboard_menu,
      hasPermission: 1,
    },
    {
      name: 'ServiceRequestStack',
      component: ServiceRequestStack,
      // hasPermission: UserPermissions?.service_request?.service_request_menu,
      hasPermission: 1,
    },
    {
      name: 'PreventiveSRStack',
      component: PreventiveSRStatck,
      // hasPermission: UserPermissions?.preventive_sr?.preventive_sr_menu,
      hasPermission: 1,
    },
    {
      name: 'ReportStack',
      component: ReportStack,
      // hasPermission: UserPermissions?.preventive_sr?.preventive_sr_menu,
      hasPermission: 1,
    },

    {
      name: 'ProfileStack',
      component: MyProfile,
      // hasPermission: isProfilePermissionGranted ? 1 : 0,
      hasPermission: 1,
    },
  ];
  // const hasPermissionForAnyScreen =
  //   drawerScreens?.filter(ele => !ele?.hasPermission).length ===
  //   drawerScreens?.length;

  const hasPermissionForAnyScreen = false;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        // unmountOnBlur: true,
        swipeEnabled: false,
      }}
      drawerContent={props => <CustomDrawerNavigation {...props} />}>
      {/* <Drawer.Screen name="Dashboard"   component={Dashboard} />
      <Drawer.Screen
        name="ServiceRequestStack"
        component={ServiceRequestStack}
      />
      <Drawer.Screen name="PreventiveSRStack" component={PreventiveSRStatck} /> */}
      {drawerScreens.map(screen => {
        return screen.hasPermission ? (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
          />
        ) : null;
      })}

      {/* {!hasPermissionForAnyScreen ? (
        drawerScreens.map(screen => {
          return screen.hasPermission ? (
            <Drawer.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
            />
          ) : null;
        })
      ) : (
        <Drawer.Screen
          name="PermisionDeniedStack"
          component={PermisionDeniedStack}
        />
      )} */}
      {/* <Drawer.Screen name="ErrorStack" component={ErrorStack} /> */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({});
