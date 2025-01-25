import {StyleSheet, View} from 'react-native';
import React from 'react';
import {CommonStyles} from '../../Utilities/CommonStyles';
import TextField from '../../Components/TextField';
import CustomButton from '../../Components/CustomButton';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {resetPasswordService} from '../../Services/Services';
import Toast from '../../Components/Toast';
import {getCatchMessage} from '../../Utilities/GeneralUtilities';
import AuthHocView from '../../Components/AuthHocView';
import {useNavigation} from '@react-navigation/native';
import {JSONtoformdata} from '../../Utilities/Methods';
import {openLoader} from '../../Store/Slices/LoaderSlice';
import StyledText from '../../Components/StyledText';

const ResetPassword = ({route}: any) => {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const validationSchema = Yup.object().shape({
    new_password: Yup.string()
      .trim('Remove leading and trailing spaces')
      .strict(true)
      .required('* New password is required'),
    confirm_password: Yup.string()
      .trim('Remove leading and trailing spaces')
      .strict(true)
      .oneOf([Yup.ref('new_password')], 'Password could not match')
      .required('* Confirm password is required'),
  });
  const {errors, values, setFieldValue, touched, handleSubmit} = useFormik({
    initialValues: {
      new_password: '',
      confirm_password: '',
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      handleResetPassword();
    },
  });

  const handleResetPassword = () => {
    dispatch(openLoader(true));

    const data = {
      reset_key: route?.params?.data,
      new_password: values.new_password,
    };

    resetPasswordService(JSONtoformdata(data))
      .then(res => {
        if (res?.data?.status) {
          Toast.success(res?.data?.msg);
          navigation.replace('Auth');
        } else {
          Toast.error(res?.data?.msg);
        }
      })
      .catch((err: any) => {
        getCatchMessage(err);
      })
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
      <View style={CommonStyles.w100}>
        <View>
          <StyledText style={CommonStyles.loginHeader}>
            Reset Password
          </StyledText>

          <View>
            <TextField
              placeholder="New Password"
              secureTextEntry
              leftIcon="passwordIcon"
              value={values.new_password}
              label="New Password"
              // required
              errorText={
                errors?.new_password && touched.new_password
                  ? errors.new_password
                  : ''
              }
              onChangeText={e => {
                setFieldValue('new_password', e);
              }}
              type="auth"
              mb={25}
              inputType="password"
            />
            <TextField
              placeholder="Confirm Password"
              secureTextEntry
              leftIcon="passwordIcon"
              label="Confirm Password"
              value={values.confirm_password}
              // required
              errorText={
                errors?.confirm_password && touched.confirm_password
                  ? errors.confirm_password
                  : ''
              }
              onChangeText={e => {
                setFieldValue('confirm_password', e);
              }}
              mb={25}
              type="auth"
              inputType="password"
            />

            <CustomButton
              onPress={() => {
                handleSubmit();
              }}>
              Submit
            </CustomButton>
          </View>
        </View>
      </View>
    </AuthHocView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  contentContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  w100: {
    width: '100%',
  },
});
