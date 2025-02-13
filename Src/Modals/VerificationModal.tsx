import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import * as Yup from 'yup';
import {openLoader} from '../Store/Slices/LoaderSlice';
import {ConvertJSONtoFormData} from '../Utilities/Methods';
import {
  resendOtpService,
  verifyOtpProfileService,
  verifyOtpService,
  verifyProfileEmailAndPhoneService,
} from '../Services/Services';
import {getCatchMessage, secureVerifyText} from '../Utilities/GeneralUtilities';
import Toast from '../Components/Toast';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTSIZES} from '../Utilities/Constants';
import {CommonStyles} from '../Utilities/CommonStyles';
import OtpInput from '../Components/OtpInput';
import CustomButton from '../Components/CustomButton';
import StyledText from '../Components/StyledText';
import {FONTS} from '../Utilities/Fonts';

const VerificationModal = ({
  resetkey,
  verifymail,
  type,
  onClose,
  token,
  onVerificationComplete,
}: {
  resetkey: string;
  verifymail: string;
  type: 'mobile' | 'email';
  onClose: () => void;
  token: string;
  onVerificationComplete: (value: 'email' | 'mobile') => void;
}) => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const [remainingDuration, setRemainingDuration] = useState(120);
  const [resetKey, setResetKey] = useState(resetkey);
  const [showReset, setShowReset] = useState(false);

  const validationSchema = Yup.object().shape({
    enteredOtp: Yup.mixed()
      .transform(val => (val?.length < 6 ? undefined : val))
      .required('* Otp is required'),
  });

  const {errors, touched, values, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      enteredOtp: '',
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      verifyOtp();
    },
  });
  const verifyOtp = () => {
    dispatch(openLoader(true));
    let tempdata = {
      token: token,
      reset_key: resetKey,
      otp: values.enteredOtp,
      project_id: 1,
    };
    const data =
      type === 'mobile'
        ? {...tempdata, phone: verifymail}
        : {...tempdata, email: verifymail};

    verifyOtpProfileService(ConvertJSONtoFormData(data))
      .then(res => {
        if (res?.data?.status) {
          Toast.success(res?.data?.msg);
          onVerificationComplete(type);
          onClose();
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
    let tempdata = {
      token: token,
      project_id: 1,
    };
    const data =
      type === 'email'
        ? {...tempdata, email: verifymail}
        : {...tempdata, mobile_no: verifymail};

    verifyProfileEmailAndPhoneService(ConvertJSONtoFormData(data))
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
    <View>
      <Text style={{...CommonStyles.loginHeader, lineHeight: 37}}>
        Enter 6 digit code sent to you at “
        <Text
          style={{
            color: COLORS.primary,
          }}>
          {secureVerifyText(verifymail) || ''}
        </Text>
        ”
      </Text>

      <OtpInput
        onCodeChanged={code => {
          // setEnteredOtp(code?.toString());
          setFieldValue('enteredOtp', code?.toString());
        }}
        errorText={
          errors?.enteredOtp && touched.enteredOtp ? errors?.enteredOtp : ''
        }
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
    </View>
  );
};

export default VerificationModal;

const styles = StyleSheet.create({});
