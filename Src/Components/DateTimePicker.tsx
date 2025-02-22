import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import StyledText from './StyledText';
import {COLORS, FONTSIZES} from '../Utilities/Constants';
import {FONTS} from '../Utilities/Fonts';
import SVGIcon from './SVGIcon';
import {TouchableOpacity} from 'react-native';
import {DateTimePickerProps} from '../@types/general';
import moment from 'moment';

const DateTimePicker = ({
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
}: DateTimePickerProps) => {
  const [isShowDatePicker, setIsShowDatePicker] = useState<boolean>(false);

  const datePicker = useMemo(() => {
    return (
      <DateTimePickerModal
        {...dateTimePickerProps}
        date={
          value
            ? new Date(moment(value, format).format('YYYY-MM-DD HH:mm'))
            : new Date()
        }
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        isVisible={isShowDatePicker}
        mode={mode}
        onConfirm={dateValue => {
          onSelect(moment(dateValue).format(format));
          setIsShowDatePicker(false);
        }}
        onCancel={() => setIsShowDatePicker(false)}
      />
    );
  }, [isShowDatePicker]);

  const getValue = () => {
    if (value) {
      return value;
    }
    return placeHolder;
  };

  return (
    <>
      <View style={[styles.container, containerStyle]}>
        {title ? (
          <StyledText style={{fontFamily: FONTS.poppins.medium}}>
            {title}{' '}
            {isRequired && (
              <StyledText style={{color: COLORS.red}}>*</StyledText>
            )}
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
        {datePicker}
      </View>
    </>
  );
};

export default DateTimePicker;

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
