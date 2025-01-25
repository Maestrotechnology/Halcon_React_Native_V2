import {StyleSheet, View, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {COLORS, IS_IOS} from '../Utilities/Constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {storeInsets} from '../Store/Slices/UtilitySlice';

type StatusBarProps = {
  backgroundColor?: string;
  isContentLight?: boolean;
};

const CustomStatusBar = ({
  backgroundColor = COLORS.primary,
  isContentLight = true,
}: StatusBarProps) => {
  const safeAreaInsets = useSafeAreaInsets();
  const dispatch = useDispatch();
  useEffect(() => {
    handleSetSafeAreaInset();
  }, []);
  const handleSetSafeAreaInset = () => {
    dispatch(storeInsets({...safeAreaInsets}));
  };

  return (
    <View
      style={[
        IS_IOS
          ? {
              height: safeAreaInsets.top > 0 ? safeAreaInsets.top : 20,
              backgroundColor: backgroundColor,
            }
          : {
              height: StatusBar.currentHeight,
            },
      ]}>
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        barStyle={isContentLight ? 'light-content' : 'dark-content'}
      />
    </View>
  );
};

export default CustomStatusBar;

const styles = StyleSheet.create({});
