import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  MachineStackParamsList,
  MastersStackNavigationProps,
  MasterStackStackParamList,
} from '../@types/navigation';

import MachineTasks from '../Screens/HomeScreens/Masters/MachineTasks';
import Machines from '../Screens/HomeScreens/Masters/Machines';

const Stack = createNativeStackNavigator<MachineStackParamsList>();

const MachineStack = ({route, navigation}: MastersStackNavigationProps) => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        <Stack.Screen name="Machines" component={Machines} />
        <Stack.Screen name="MachineTasks" component={MachineTasks} />
      </Stack.Navigator>
    </>
  );
};

export default MachineStack;

const styles = StyleSheet.create({});
