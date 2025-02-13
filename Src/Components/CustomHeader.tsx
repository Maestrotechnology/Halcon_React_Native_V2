import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {CustomHeaderProps} from '../@types/general';
import StyledText from './StyledText';
import {COLORS} from '../Utilities/Constants';
import SVGIcon from './SVGIcon';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {FONTS} from '../Utilities/Fonts';
import {GetUserProfileData} from '../Utilities/StoreData';
import {ICONS} from '../Utilities/Icons';

const CustomHeader = ({
  headerTitle = '',
  isEnableMenu = true,
  isRightIconEnable = true,
  onBackPress,
  onRightIconPress,
  rightIcon = 'profile_vector',
  containerStyle,
  isEnableTickIcon,
  onPressTickIcon,
}: CustomHeaderProps) => {
  const navigation: any = useNavigation();
  const userData = GetUserProfileData();

  return (
    <View style={[styles.container, containerStyle]}>
      <SVGIcon
        icon={isEnableMenu ? 'menu' : 'back_arrow'}
        width={20}
        isButton
        height={20}
        fill="black"
        onPress={() => {
          if (isEnableMenu) {
            navigation.dispatch(DrawerActions.openDrawer());
          } else {
            if (onBackPress) onBackPress();
          }
        }}
      />
      <StyledText
        style={{fontFamily: FONTS.poppins.semibold, color: COLORS.black}}>
        {headerTitle}
      </StyledText>
      {isRightIconEnable && userData?.pic ? (
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate('ProfileStack');
          }}>
          <Image
            source={{
              uri: userData?.pic,
            }}
            style={{
              width: 30,
              height: 30,
              borderRadius: 100,
            }}
          />
        </TouchableOpacity>
      ) : isRightIconEnable ? (
        <SVGIcon
          isButton
          onPress={() => {
            // navigation.navigate('ProfileStack');
          }}
          icon={rightIcon}
          width={30}
          height={30}
        />
      ) : isEnableTickIcon ? (
        <ICONS.doneIcon
          onPress={() => {
            onPressTickIcon?.();
          }}
          width={30}
          height={30}
        />
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    zIndex: 1,
  },
});
