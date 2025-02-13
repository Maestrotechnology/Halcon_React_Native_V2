import {StyleSheet, View} from 'react-native';
import React from 'react';
import AuthHocView from '../../Components/AuthHocView';
import CustomButton from '../../Components/CustomButton';
import {CommonStyles} from '../../Utilities/CommonStyles';
import StyledText from '../../Components/StyledText';
import TextField from '../../Components/TextField';
import {EMAIL_REGEX} from '../../Utilities/Constants';
import {openLoader} from '../../Store/Slices/LoaderSlice';
import {useFormik} from 'formik';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';
import {forgotPasswordService} from '../../Services/Services';
import Toast from '../../Components/Toast';
import {getCatchMessage} from '../../Utilities/GeneralUtilities';
import {ConvertJSONtoFormData} from '../../Utilities/Methods';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email or mobile number is required')
      .test('Emailormobilenumber', 'Invalid email or mobile number', value => {
        // Test for email format
        const isEmail = EMAIL_REGEX.test(value);

        // Test for mobile number format
        const mobileRegex = /^\d{10}$/;
        const isMobileNumber = mobileRegex.test(value);

        // Return true if either email or mobile number format is valid
        return isEmail || isMobileNumber;
      }),
  });
  const {errors, values, setFieldValue, touched, handleSubmit} = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      handleForgotPassword();
    },
  });

  const handleForgotPassword = () => {
    dispatch(openLoader(true));
    const data = {
      email: values.email,
    };
    forgotPasswordService(ConvertJSONtoFormData(data))
      .then(res => {
        if (res?.data?.status) {
          navigation.replace('OtpVerification', {
            data: res?.data?.reset_key || '',
            email: values.email,
          });
          Toast.success(res?.data?.msg);
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
    <AuthHocView
      isBack
      backPress={() => {
        navigation.navigate('Login');
      }}>
      <View>
        <StyledText style={CommonStyles.loginHeader}>
          Forgot Password
        </StyledText>
        <View>
          <TextField
            leftIcon="emailIcon"
            label="E-Mail / Phone Number"
            placeholder="E-Mail / Phone Number"
            mb={25}
            secureTextEntry
            onChangeText={text => {
              setFieldValue('email', text);
            }}
            value={values.email}
            errorText={errors.email && touched.email ? errors?.email : ''}
            type="auth"
          />
        </View>

        <CustomButton
          onPress={() => {
            handleSubmit();
          }}>
          Send OTP
        </CustomButton>
      </View>
    </AuthHocView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({});
