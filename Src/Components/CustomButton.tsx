import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, WINDOW_WIDTH} from '../Utilities/Constants';
import StyledText from './StyledText';
import {FONTS} from '../Utilities/Fonts';

const CustomButton = ({
  children,
  onPress,
  style,
  gradientContainerStyle,
  isDisabled = false,
  textStyle,
  type = 'primary',
  buttonProps,
}: {
  children: string | JSX.Element;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  isDisabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
  type?: 'primary' | 'secondary' | 'export';
  gradientContainerStyle?: StyleProp<TextStyle>;
  buttonProps?: TouchableOpacityProps;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.5}
      style={[styles.btn, style]}>
      <LinearGradient
        start={{x: 0, y: 0.45}}
        end={{x: 0, y: 1}}
        colors={
          type === 'primary'
            ? ['#FF7B4B', '#F25922']
            : type === 'secondary'
            ? ['#f7f7f7', '#dcdcdc']
            : ['#297bc4', '#0063bb']
        }
        style={[styles.gradientContainer, gradientContainerStyle]}>
        <StyledText
          style={[
            styles.btnText,
            textStyle,
            {
              color: ['primary', 'export'].includes(type)
                ? COLORS.white
                : COLORS.black,
            },
          ]}>
          {children}
        </StyledText>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    height: 40,
  },
  gradientContainer: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    padding: 10,
  },
  btnText: {
    alignSelf: 'center',
    fontFamily: FONTS.poppins.medium,
    // textTransform: "capitalize",
  },
});
