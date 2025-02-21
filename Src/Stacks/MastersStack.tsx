import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  MastersStackNavigationProps,
  MasterStackStackParamList,
} from '../@types/navigation';
import TasksList from '../Screens/HomeScreens/Masters/Tasks';
import Policy from '../Screens/HomeScreens/Masters/Policy';
import Division from '../Screens/HomeScreens/Masters/Division';
import Material from '../Screens/HomeScreens/Masters/Matetial/Material';
import WorkCenter from '../Screens/HomeScreens/Masters/WorkCenter';
import Holiday from '../Screens/HomeScreens/Masters/Holiday';
import AddEditMaterial from '../Screens/HomeScreens/Masters/Matetial/AddEditMaterial';
import Machines from '../Screens/HomeScreens/Masters/Machines';

const Stack = createNativeStackNavigator<MasterStackStackParamList>();

const MastersStack = ({route, navigation}: MastersStackNavigationProps) => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        <Stack.Screen name="TasksList" component={TasksList} />
        <Stack.Screen name="Machines" component={Machines} />
        <Stack.Screen name="Policy" component={Policy} />
        <Stack.Screen name="Division" component={Division} />
        <Stack.Screen name="Material" component={Material} />
        <Stack.Screen name="AddEditMaterial" component={AddEditMaterial} />
        <Stack.Screen name="WorkCenter" component={WorkCenter} />
        <Stack.Screen name="Holiday" component={Holiday} />
      </Stack.Navigator>
    </>
  );
};

export default MastersStack;

const styles = StyleSheet.create({});
