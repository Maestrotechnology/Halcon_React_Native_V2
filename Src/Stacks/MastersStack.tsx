import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  MastersStackNavigationProps,
  MasterStackStackParamList,
} from '../@types/navigation';
import TasksList from '../Screens/HomeScreens/Masters/PeriodicTasks/Tasks';

const Stack = createNativeStackNavigator<MasterStackStackParamList>();

const MastersStack = ({route, navigation}: MastersStackNavigationProps) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Stack.Screen name="TasksList" component={TasksList} />
    </Stack.Navigator>
  );
};

export default MastersStack;

const styles = StyleSheet.create({});
