import {StyleSheet, TextInput, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import StyledText from './StyledText';
import {COLORS, WINDOW_WIDTH} from '../Utilities/Constants';
import {secondsToMinutesAndSeconds} from '../Utilities/Methods';

type Props = {
  onCodeChanged: (code: string) => void;
  paddingTop?: number;
  paddingBottom?: number;
  paddingVertical?: number;
  seconds?: number;
  numberOfDigits?: number;
  errorText?: string;
  onResendOtp?: () => void;
  setShowReset: (value: boolean) => void;
};

let interval: any;
const OtpInput = ({
  onCodeChanged,
  paddingTop,
  paddingBottom,
  paddingVertical = 10,
  seconds = 0,
  numberOfDigits = 6,
  onResendOtp,
  errorText,
  setShowReset,
}: Props) => {
  const [otpValue, setotp] = useState([...Array(numberOfDigits)]?.fill(''));

  const [errorString, seterrorString] = useState('');
  const [timer, settimer] = useState(seconds);

  const inputs = useRef<any[]>([]);
  const [forcusedIndex, setforcusedIndex] = useState(0);

  useEffect(() => {
    onCodeChanged(otpValue?.join(''));
  }, [otpValue]);

  useEffect(() => {
    settimer(seconds);
  }, [seconds]);

  useEffect(() => {
    inputs.current[forcusedIndex]?.focus();
  }, []);

  useEffect(() => {
    interval = setInterval(() => {
      settimer(pre => {
        if (pre === 0) {
          setShowReset(true);
          clearInterval(interval);
          return 0;
        } else {
          return pre - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  const clearOtp = () => {
    setotp([...Array(numberOfDigits)]?.fill(''));
  };

  const handleOtpChange = (value: string, index: number) => {
    seterrorString('');
    let isInvalid = false;
    value.split('').map(val => {
      /* @ts-ignore */
      if (isNaN(val) || !val.trim()) {
        isInvalid = true;
      }
    });
    if (isInvalid) {
      seterrorString('Enter valid OTP');
      return;
    }
    if (index > 0 && value === '') {
      inputs.current[index - 1]?.focus();
      setforcusedIndex(index - 1);
    }

    if (value.length >= 6) {
      clearOtp();
      let newOtp = [...otpValue];
      if (value.length === 6) {
        value.split('').map((val, ind) => (newOtp[ind] = val));
      } else {
        value
          .split('')
          .filter((_, ind) => ind !== 0)
          .map((val, ind) => (newOtp[ind] = val));
      }
      setotp(newOtp?.length > 6 ? newOtp?.slice(0, 6) : newOtp);
      inputs.current[5]?.focus();
      setforcusedIndex(5);
    } else if (value.length > 2) {
      seterrorString('OTP must have 6 digits');
      return;
    } else {
      const newOtp = [...otpValue];
      newOtp[index] = value.charAt(0);
      setotp(newOtp);
      // Move focus to the next box if the current one has a value
      if (value && index < newOtp.length - 1) {
        inputs.current[index + 1]?.focus();
        setforcusedIndex(index + 1);
      }
    }
  };

  const handleKeyPressTextInput = (index: number, key: string) => {
    if (key === 'Backspace') {
      if (index > 0) {
        inputs.current[index - 1]?.focus();
        handleOtpChange('', index);
      }
    }
  };

  return (
    <View style={[styles.mainContainer]}>
      <View>
        <StyledText style={styles.titleText}>Enter OTP</StyledText>
        <View style={styles.inputContainer}>
          {otpValue.map((digit, index) => (
            <TextInput
              key={index}
              style={[
                styles.inputField,
                {
                  borderColor:
                    forcusedIndex === index || otpValue[index]
                      ? COLORS.primary
                      : COLORS.borderColor,
                },
              ]}
              onKeyPress={e =>
                handleKeyPressTextInput(index, e.nativeEvent.key)
              }
              keyboardType="number-pad"
              onChangeText={value => handleOtpChange(value, index)}
              value={digit}
              onFocus={() => {
                setforcusedIndex(index);
              }}
              // maxLength={1}
              selectTextOnFocus={true}
              textContentType="oneTimeCode"
              ref={input => {
                inputs.current[index] = input;
              }}
            />
          ))}
        </View>
        {errorText || errorString ? (
          <StyledText style={styles.errorText}>
            {errorText ? errorText : errorString}
          </StyledText>
        ) : null}
        <View style={styles.timerResendContainer}>
          {/* <StyledText
            style={{
              ...styles.timerResendText,
              color: timer === 0 ? COLORS.primary : COLORS.hashColor,
            }}
            onPress={() => {
              if (timer === 0 && onResendOtp) {
                setotp([...Array(numberOfDigits)]?.fill(''));
                onResendOtp();
              }
            }}>
            Resend code
          </StyledText> */}

          <StyledText
            style={{
              ...styles.timerResendText,
              color: timer !== 0 ? COLORS.primary : COLORS.hashColor,
            }}>
            {secondsToMinutesAndSeconds(timer)}
          </StyledText>
        </View>
      </View>
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    width: 380,
    maxWidth: '100%',
  },

  inputField: {
    minWidth: 40,
    minHeight: 40,
    borderBottomWidth: 2,
    width: 50,
    height: 50,
    maxWidth: WINDOW_WIDTH / 6 - 15,
    maxHeight: WINDOW_WIDTH / 6 - 15,
    borderColor: COLORS.borderColor,
    borderRadius: 4,
    color: '#000',
    textAlign: 'center',
  },

  focusedField: {
    borderColor: COLORS.primary,
  },
  titleText: {
    color: COLORS.black,
    paddingVertical: 5,
    fontSize: 16,
  },
  timerResendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 5,
  },
  timerResendText: {
    color: COLORS.primary,
    fontSize: 16,
    paddingVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    paddingVertical: 5,
  },
  box: {
    borderWidth: 1,
    borderColor: 'black',
    width: 36,
    height: 36,
    margin: 10,
    textAlign: 'center',
    fontSize: 20,
  },
});
