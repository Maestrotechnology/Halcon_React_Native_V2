import React from 'react';
import {View} from 'react-native';
import CustomButton from './CustomButton';
import {ActionButtonsProps} from '../@types/general';

export default function ActionButtons({
  onPressNegativeBtn,
  onPressPositiveBtn,
  NegativeBtnTitle = 'Reset',
  PositiveBtnTitle = 'Search',
}: ActionButtonsProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
      }}>
      <CustomButton
        style={{width: '45%'}}
        type="secondary"
        onPress={() => {
          onPressNegativeBtn();
        }}>
        {NegativeBtnTitle}
      </CustomButton>
      <CustomButton style={{width: '45%'}} onPress={onPressPositiveBtn}>
        {PositiveBtnTitle}
      </CustomButton>
    </View>
  );
}
