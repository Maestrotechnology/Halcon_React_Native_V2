import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {COLORS, BOX_SHADOW, FONTSIZES} from '../Utilities/Constants';
import SVGIcon from './SVGIcon';
import {TextInputBoxProps} from '../@types/general';
import {FONTS} from '../Utilities/Fonts';
import StyledText from './StyledText';

const TextInputBox = ({
  title = '',
  value,
  onChangeText,
  textInputProps,
  innerRef,
  errorText,
  customInputBoxContainerStyle,
  customContainerStyle,
  isSecure = false,
  showIcon = false,
  iconHeight = 20,
  iconWidth = 20,
  icon,
  isIconDisabled = false,
  isEditable = true,
  placeHolder,
  isRequired = false,
  disableNonEditableBg = false,
  hasVerify = false,
  onVerifyPress,
  keyboardType,
  multiline = false,
  numberOfLines = multiline ? 4 : 1,
}: TextInputBoxProps) => {
  const [isVisiblePassword, setisVisiblePassword] = useState<boolean>(false);

  const InputBox = useCallback(
    ({value}: {value: string | number | undefined}) => {
      return (
        <TextInput
          // @ts-ignore
          value={value}
          onChangeText={text => {
            if (onChangeText) {
              onChangeText(text);
            }
          }}
          editable={isEditable}
          secureTextEntry={isSecure ? !isVisiblePassword : false}
          style={[
            styles.inputField,

            {
              height: multiline ? 80 : 43,
              width: showIcon ? '87%' : '100%',
              backgroundColor:
                !isEditable && !disableNonEditableBg
                  ? COLORS.disabledColor
                  : COLORS.white,
            },

            !isEditable
              ? {
                  borderWidth: 0,
                  borderColor: COLORS.white,
                }
              : {},
          ]}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          placeholder={placeHolder}
          {...textInputProps}
          placeholderTextColor={COLORS.placeHolderColor}
          keyboardType={keyboardType}
        />
      );
    },
    [],
  );
  return (
    <View style={[styles.textInputBoxContainer, customContainerStyle]}>
      <View style={{...styles.titleContainer}}>
        {title ? (
          <StyledText style={{fontFamily: FONTS.poppins.medium}}>
            {title}
            {isRequired && (
              <StyledText style={{color: COLORS.red}}>*</StyledText>
            )}
          </StyledText>
        ) : null}
        {hasVerify ? (
          <TouchableOpacity onPress={onVerifyPress}>
            <StyledText
              style={{
                color: COLORS.primary,
                fontFamily: FONTS.poppins.medium,
              }}>
              Verify
            </StyledText>
          </TouchableOpacity>
        ) : null}
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: errorText ? COLORS.red : COLORS.borderColor,
          },
          customInputBoxContainerStyle,
        ]}>
        {!isEditable ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={!isEditable}>
            <InputBox value={value} />
          </ScrollView>
        ) : (
          <InputBox value={value} />
        )}
        {showIcon && !isSecure ? (
          <View style={styles.iconContainer}>
            <SVGIcon
              icon={icon}
              isButton={isIconDisabled}
              width={iconWidth}
              height={iconHeight}
            />
          </View>
        ) : showIcon && isSecure ? (
          <View style={styles.iconContainer}>
            <SVGIcon
              isButton={true}
              onPress={() => setisVisiblePassword(prev => !prev)}
              icon={isVisiblePassword ? 'visibleIcon' : 'hideIcon'}
              width={iconWidth}
              height={iconHeight}
            />
          </View>
        ) : null}
      </View>
      {errorText ? (
        <StyledText style={styles.errorTxt}>{errorText.toString()}</StyledText>
      ) : null}
    </View>
  );
};

export default TextInputBox;

const styles = StyleSheet.create({
  textInputBoxContainer: {
    marginVertical: 5,
  },
  container: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    borderWidth: 0.5,
    marginVertical: 8,
  },
  inputField: {
    width: '87%',
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 7,
    fontSize: FONTSIZES.tiny,
    fontFamily: FONTS.poppins.medium,
    color: COLORS.black,
    flex: 1,
  },
  errorTxt: {
    fontFamily: FONTS.poppins.medium,
    fontSize: FONTSIZES.tiny,
    color: COLORS.red,
  },
  iconContainer: {
    width: '13%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCommonStyle: {
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    ...BOX_SHADOW,
  },
  leftIconContainer: {
    width: 35,
    height: 35,
    justifyContent: 'center',
  },
  inputContainer: {
    height: 45,
    width: '100%',
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  authInputContainer: {
    height: 43,
    width: '100%',
    marginVertical: 5,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
