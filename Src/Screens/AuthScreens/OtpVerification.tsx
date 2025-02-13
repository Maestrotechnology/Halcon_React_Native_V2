import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import OtpInput from '../../Components/OtpInput';
import AuthHocView from '../../Components/AuthHocView';
import {CommonStyles} from '../../Utilities/CommonStyles';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../Components/CustomButton';
import {useDispatch} from 'react-redux';
import {resendOtpService, verifyOtpService} from '../../Services/Services';
import {ConvertJSONtoFormData} from '../../Utilities/Methods';
import Toast from '../../Components/Toast';
import {
  getCatchMessage,
  secureVerifyText,
} from '../../Utilities/GeneralUtilities';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {openLoader} from '../../Store/Slices/LoaderSlice';
import StyledText from '../../Components/StyledText';
import {COLORS, FONTSIZES} from '../../Utilities/Constants';
import {FONTS} from '../../Utilities/Fonts';

const OtpVerification = ({route, resetkey}: any) => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const [remainingDuration, setRemainingDuration] = useState(120);
  const [resetKey, setResetKey] = useState(
    resetkey ? resetkey : route?.params?.data,
  );
  const [showReset, setShowReset] = useState(false);

  const validationSchema = Yup.object().shape({
    otp: Yup.mixed()
      .transform(val => (val?.length < 6 ? undefined : val))
      .required('* Otp is required'),
  });

  const {errors, touched, values, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      verifyOtp();
    },
  });
  const verifyOtp = () => {
    dispatch(openLoader(true));
    const data = {
      reset_key: resetKey,
      otp: values.otp,
    };

    verifyOtpService(ConvertJSONtoFormData(data))
      .then(res => {
        if (res?.data?.status) {
          Toast.success(res?.data?.msg);
          navigation.replace('ResetPassword', {
            data: res?.data?.reset_key,
            org: route?.params?.org || '',
          });
        } else {
          Toast.error(res?.data?.msg);
        }
      })
      .catch(err => getCatchMessage(err))
      .finally(() => {
        dispatch(openLoader(false));
      });
  };

  const resendOtp = () => {
    dispatch(openLoader(true));
    const data = {
      reset_key: resetKey,
    };
    resendOtpService(ConvertJSONtoFormData(data))
      .then(res => {
        if (res?.data?.status) {
          Toast.success(res?.data?.msg);
          setResetKey(res?.data?.reset_key);
          setRemainingDuration(pre => pre - 1);
          setShowReset(false);
        } else {
          Toast.error(res?.data?.msg);
        }
      })
      .catch(err => getCatchMessage(err))
      .finally(() => {
        dispatch(openLoader(false));
      });
  };

  return (
    <>
      <AuthHocView>
        <View>
          <Text style={{...CommonStyles.loginHeader, lineHeight: 37}}>
            Enter 6 digit code sent to you at “
            <Text
              style={{
                color: COLORS.primary,
              }}>
              {secureVerifyText(route?.params?.email) || ''}
            </Text>
            ”
          </Text>

          <OtpInput
            onCodeChanged={code => {
              // setotp(code?.toString());
              setFieldValue('otp', code?.toString());
            }}
            errorText={errors?.otp && touched.otp ? errors?.otp : ''}
            numberOfDigits={6}
            seconds={remainingDuration}
            onResendOtp={resendOtp}
            setShowReset={value => {
              setShowReset(true);
            }}
          />

          <CustomButton
            onPress={() => {
              handleSubmit();
            }}>
            Verify
          </CustomButton>
          {showReset && (
            <StyledText
              style={{
                paddingTop: 10,
                fontFamily: FONTS.poppins.medium,
                fontSize: FONTSIZES.medium,
                color: 'rgba(87, 88, 90, 1)',
                textAlign: 'center',
              }}>
              Didn’t recieve a verification code?
            </StyledText>
          )}
          {showReset && (
            <StyledText
              onPress={() => {
                if (showReset) {
                  resendOtp();
                }
              }}
              style={{
                paddingTop: 5,
                fontFamily: FONTS.poppins.medium,
                fontSize: FONTSIZES.medium,
                color: showReset ? COLORS.primary : COLORS.secondary,
                textAlign: 'center',
              }}
              // type={showReset ? 'button' : 'textfield'}
            >
              Resend Code
            </StyledText>
          )}
        </View>
      </AuthHocView>
    </>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({});
