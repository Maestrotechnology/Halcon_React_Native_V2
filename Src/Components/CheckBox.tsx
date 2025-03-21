import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ICONS} from '../Utilities/Icons';
import {COLORS} from '../Utilities/Constants';
import StyledText from './StyledText';

const CheckBox = ({
  label = '',
  disabled = false,
  onChange,
  checked,
  containerStyle,
}: {
  label?: string;
  disabled?: boolean;
  onChange?: (val: boolean) => void;
  checked: boolean;
  containerStyle?: any;
}) => {
  //   const [checked, setChecked] = useState(false);

  return (
    <View style={[styles.checkBoxViewContainer, containerStyle]}>
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.5}
        disabled={disabled}
        onPress={() => {
          //   setChecked(pre => !pre);
          if (onChange) {
            onChange(!checked);
          }
        }}
        style={{
          ...styles.checkboxContainer,
          borderColor: checked ? COLORS.primary : COLORS.darkBlue,
          backgroundColor: checked ? COLORS.primary : COLORS.white,
        }}>
        <ICONS.doneIcon height={18} fill={COLORS.white} />
      </TouchableOpacity>
      <Text
        ellipsizeMode="tail"
        numberOfLines={3}
        style={{
          flexWrap: 'wrap',
          fontSize: 12,
          color: '#494c50',
          width: '90%',
        }}>
        {label}
      </Text>
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  checkboxContainer: {
    borderWidth: 1,
    borderRadius: 4,
    width: 18,
    height: 18,
    marginRight: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxViewContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
