import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {COLORS} from '../Utilities/Constants';
import {BottomSheetProps} from '../@types/general';

const BottomSheet = ({
  bottomSheetModalRef,
  onClose,
  bottomSheetModalProps,
  children,
  snapPoints = ['25%'],
}: BottomSheetProps) => {
  return (
    <BottomSheetModal
      handleIndicatorStyle={{
        backgroundColor: COLORS.borderColor,
        width: 50,
      }}
      style={{
        paddingHorizontal: 15,
      }}
      backgroundStyle={{
        backgroundColor: COLORS.white,
      }}
      {...bottomSheetModalProps}
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      stackBehavior="push"
      keyboardBlurBehavior={'restore'}
      android_keyboardInputMode="adjustPan"
      backdropComponent={props => {
        return (
          <TouchableOpacity
            style={{
              flex: 1,
              position: 'absolute',
              backgroundColor: COLORS.transparentDimColor,
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            activeOpacity={1}
            onPress={onClose}
          />
        );
      }}>
      <BottomSheetView style={{flex: 1, padding: 20}}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({});
