import React, {useState} from 'react';
import {View, Button, StyleSheet, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {DateTimePickerProps} from '../@types/general';
import {COLORS, FONTSIZES} from '../Utilities/Constants';
import {FONTS} from '../Utilities/Fonts';
import StyledText from './StyledText';
import SVGIcon from './SVGIcon';
import moment from 'moment';

const TimePickerComponent = ({
  title = 'Date',
  mode = 'date',
  containerStyle,
  inputContainerStyle,
  inputFieldStyle,
  iconContainerStyle,
  errorText = '',
  value,
  placeHolder = 'Select date',
  icon = 'calendar',
  onSelect,
  isDisabled = false,
  dateTimePickerProps,
  maximumDate,
  minimumDate,
  isRequired = false,
  format = 'YYYY-MM-DD',
  date,
}: DateTimePickerProps) => {
  const [time, setTime] = useState(new Date());
  const [isShowDatePicker, setIsShowDatePicker] = useState<boolean>(false);

  const getValue = () => {
    if (value) {
      return value;
    }
    return placeHolder;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {title ? (
        <StyledText style={{fontFamily: FONTS.poppins.medium}}>
          {title}{' '}
          {isRequired && <StyledText style={{color: COLORS.red}}>*</StyledText>}
        </StyledText>
      ) : null}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isDisabled}
        onPress={() => {
          if (!isDisabled) {
            setIsShowDatePicker(true);
          }
        }}
        style={[
          styles.inputContainer,
          inputContainerStyle,
          {
            backgroundColor: COLORS.white,
            borderColor: errorText
              ? COLORS.red
              : isDisabled
              ? '#fff'
              : COLORS.primary,
          },
        ]}>
        <View
          style={[
            styles.inputField,
            {
              backgroundColor: isDisabled ? 'transparent' : COLORS.white,
              flex: 1,
            },
            inputFieldStyle,
          ]}>
          <StyledText
            onPress={() => {
              if (!isDisabled) {
                setIsShowDatePicker(true);
              }
            }}
            style={{
              color: value ? COLORS.black : COLORS.placeHolderColor,
              fontSize: FONTSIZES.tiny,
            }}>
            {getValue()}
          </StyledText>
        </View>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: isDisabled ? 'transparent' : COLORS.white},
            iconContainerStyle,
          ]}>
          <SVGIcon icon={icon} width={15} height={15} />
        </View>
      </TouchableOpacity>
      {errorText ? (
        <StyledText style={styles.errorTxt}>{errorText}</StyledText>
      ) : null}

      <DatePicker
        modal
        open={isShowDatePicker}
        date={
          value
            ? new Date(moment(value, format).format('YYYY-MM-DD HH:mm'))
            : new Date()
        }
        locale="en_GB"
        mode="time"
        minimumDate={
          date
            ? moment(date).isSame(moment(), 'day')
              ? new Date()
              : undefined
            : undefined
        }
        onConfirm={(selectedTime: any) => {
          setIsShowDatePicker(false);
          onSelect(moment(selectedTime).format(format));
          setTime(selectedTime);
        }}
        onCancel={() => setIsShowDatePicker(false)}
        theme="light" // Available themes: "light", "dark", "auto"
        // textColor="blue" // Change text color
        // androidVariant="iosClone" // Makes it look like iOS picker on Android
        // fadeToColor="black" // Background color
      />
    </View>
  );
};

export default TimePickerComponent;
const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  inputContainer: {
    height: 43,
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
  },
  errorTxt: {
    fontFamily: FONTS.poppins.medium,
    fontSize: FONTSIZES.tiny,
    color: COLORS.red,
  },
  iconContainer: {
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 8,
  },
  inputField: {
    borderRadius: 11,
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    fontSize: FONTSIZES.tiny,
    fontFamily: FONTS.poppins.medium,
    color: COLORS.black,
  },
});
