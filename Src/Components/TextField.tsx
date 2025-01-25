import {
  KeyboardType,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTSIZES, IS_IOS } from "../Utilities/Constants";
import { ICONS, IconType } from "../Utilities/Icons";
import StyledText from "./StyledText";
import { FONTS } from "../Utilities/Fonts";

const TextField = ({
  onChangeText,
  value,
  placeholder,
  readOnly,
  keyboardType,
  secureTextEntry,
  leftIcon,
  rightIcon,
  mb,
  mt,
  mx,
  my,
  errorText,
  required,
  label,
  type = "textfield",
  multiline = false,
  numberOfLines = multiline ? 4 : 1,
  style,
  maxLength,
  inputType,
}: {
  onChangeText?: (text: string) => void;
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  keyboardType?: KeyboardType;
  secureTextEntry?: boolean;
  leftIcon?: IconType;
  rightIcon?: IconType;
  mb?: number;
  mt?: number;
  mx?: number;
  my?: number;
  errorText?: string;
  required?: boolean;
  label?: string;
  type?: "auth" | "textfield";
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  maxLength?: number;
  inputType?: "password" | "text";
}) => {
  const IconLeft = leftIcon ? ICONS[leftIcon] : "";
  const IconRight = rightIcon ? ICONS[rightIcon] : "";

  const [isSecure, setIsSecure] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (inputType === "password") {
      setIsSecure(true);
    }
  }, [inputType]);

  return (
    <View
      style={{
        marginBottom: mb ? mb : 0,
        marginTop: mt ? mt : 0,
        marginHorizontal: mx ? mx : 0,
        marginVertical: my ? my : 0,
      }}
    >
      {/* {label ? (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}>
          <StyledText size={14} weight="400" color="rgba(0, 0, 0, 0.75)" pb={5}>
            {label}
          </StyledText>
          {required ? (
            <StyledText size={14} weight="400" color={COLORS.red} pb={5} px={5}>
              {'*'}
            </StyledText>
          ) : null}
        </View>
      ) : null} */}
      <View
        style={[
          styles.textInput,
          {
            height: multiline ? 80 : 45,
            borderColor: focused ? COLORS.primary : "#979797",

            // paddingHorizontal: 10,
            // elevation: type === 'auth' ? 3 : 1,

            // borderColor: errorText ? COLORS.red : 'rgba(0, 0, 0, 0.10)',
          },
        ]}
      >
        {leftIcon && IconLeft ? (
          <TouchableOpacity activeOpacity={1} style={styles.iconStyle}>
            <IconLeft />
          </TouchableOpacity>
        ) : null}
        <TextInput
          style={[
            {
              paddingLeft: IS_IOS ? 10 : 5,
              ...styles.textField,
            },
            style,
          ]}
          onChangeText={onChangeText}
          value={value}
          placeholder={`${label}`}
          readOnly={readOnly}
          keyboardType={keyboardType}
          secureTextEntry={isSecure}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? "top" : "center"}
          maxLength={maxLength}
          placeholderTextColor={COLORS.placeHolderColor}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
        />
        {inputType === "password" ? (
          <TouchableOpacity
            onPress={() => {
              setIsSecure((pre) => !pre);
            }}
            style={styles.showIcon}
            activeOpacity={1}
          >
            {!isSecure ? <ICONS.visibleIcon /> : <ICONS.hideIcon />}
          </TouchableOpacity>
        ) : null}
      </View>
      {errorText ? (
        <StyledText style={styles.errorTxt}>{errorText}</StyledText>
      ) : null}
    </View>
  );
};

export default TextField;

const styles = StyleSheet.create({
  textInput: {
    borderBottomWidth: 1.25,
    // shadowOpacity: 4,
    shadowRadius: 4,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  textField: {
    color: COLORS.black,
    flex: 1,
    height: "100%",
    fontWeight: "700",
    fontSize: 15,
  },
  iconStyle: {
    // backgroundColor: COLORS.primary,
    width: 25,
    height: "100%",
    borderRadius: 8,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  showIcon: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  errorTxt: {
    fontFamily: FONTS.poppins.medium,
    fontSize: FONTSIZES.tiny,
    color: COLORS.red,
  },
});
