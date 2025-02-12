import React from 'react';
import {Switch} from 'react-native-gesture-handler';
import {CommonSwitchProps} from './types';
import {COLORS} from '../Utilities/Constants';

export default function CommonSwitch({
  isEnabled,
  ActiveColor,
  inActiveColor,
  onChangeSwitch,
}: CommonSwitchProps) {
  return (
    <Switch
      //   trackColor={{
      //     false: ActiveColor ?? COLORS.orange,
      //     true: inActiveColor ?? COLORS.black,
      //   }}
      thumbColor={
        isEnabled ? ActiveColor ?? COLORS.green : inActiveColor ?? COLORS.red
      }
      onValueChange={() => onChangeSwitch(!isEnabled)}
      value={isEnabled}
    />
  );
}
