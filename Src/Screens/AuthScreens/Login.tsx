import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AuthHocView from '../../Components/AuthHocView';
import CustomButton from '../../Components/CustomButton';
import {CommonStyles} from '../../Utilities/CommonStyles';
import StyledText from '../../Components/StyledText';
import TextField from '../../Components/TextField';
import {COLORS, IS_IOS, userLoginKey} from '../../Utilities/Constants';
import {openLoader} from '../../Store/Slices/LoaderSlice';
import {useFormik} from 'formik';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';
import {Sha1, saltKey} from '../../Services/ServiceConstatnts';
import {loginService} from '../../Services/Services';
import {
  StoreRememberData,
  StoreToken,
  StoreUserDetails,
} from '../../Store/Slices/LoginSlice';
import {storeUserSession} from '../../Utilities/SecureStorage';
import Toast from '../../Components/Toast';
import {getCatchMessage} from '../../Utilities/GeneralUtilities';
import {JSONtoformdata} from '../../Utilities/Methods';
import instance from '../../Services/Axios';
import {FONTS} from '../../Utilities/Fonts';
import CheckBox from '../../Components/CheckBox';
import {GetRememberData} from '../../Utilities/StoreData';
import {getIsGrantedNotificationPermission} from '../../Utilities/Permissions';

const Login = () => {
  const dispatch = useDispatch();
  const rememberData = GetRememberData();
  const navigation: any = useNavigation();
  const [pushId, setPushId] = useState('');
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('* User Name is required'),
    password: Yup.string().required('* Password is required'),
  });
  const {errors, values, setFieldValue, touched, setValues, handleSubmit} =
    useFormik({
      initialValues: {
        username: '',
        password: '',
        remember: rememberData?.remember ? rememberData?.remember : false,
      },
      validationSchema: validationSchema,
      onSubmit: () => {
        handleLogin();
      },
    });

  useEffect(() => {
    getIsGrantedNotificationPermission()
      .then(res => {})
      .catch(err => {});
  }, []);

  useEffect(() => {
    if (rememberData?.remember) {
      setValues({
        ...values,
        username: rememberData?.username,
        password: rememberData?.password,
      });
    }
  }, [rememberData]);

  const handleLogin = () => {
    dispatch(openLoader(true));

    const data = {
      username: values.username.trim(),
      password: values.password,
      authcode: Sha1(saltKey + values.username.trim()),
      device_type: IS_IOS ? 2 : 1,
      push_id: pushId,
      device_id: '',
    };

    loginService(JSONtoformdata(data))
      .then(res => {
        if (res?.data?.status) {
          instance.defaults.baseURL = `${res?.data?.base_url}/`;
          dispatch(StoreToken(res?.data?.token || ''));
          dispatch(StoreUserDetails(res?.data));
          dispatch(
            StoreRememberData({
              ...res?.data,
              remember: values.remember,
              password: values.password,
              username: values.username,
            }),
          );
          storeUserSession(
            userLoginKey,
            JSON.stringify({
              ...res?.data,
              remember: values.remember,
              password: values.password,
              username: values.username,
            }),
          );
          Toast.success(res?.data?.msg);
        } else {
          Toast.error(res?.data?.msg);
          dispatch(StoreToken(null));
          dispatch(StoreUserDetails(null));
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
    <AuthHocView>
      <View>
        <StyledText style={CommonStyles.loginHeader}>Login</StyledText>
        <View>
          <TextField
            leftIcon="userIcon"
            label="User Name"
            placeholder="User Name"
            mb={20}
            onChangeText={text => {
              setFieldValue('username', text);
            }}
            value={values.username}
            errorText={
              errors.username && touched.username ? errors?.username : ''
            }
            type="auth"
          />

          <TextField
            leftIcon="passwordIcon"
            label="Password"
            placeholder="Password"
            mb={20}
            secureTextEntry
            inputType="password"
            onChangeText={text => {
              setFieldValue('password', text);
            }}
            value={values.password}
            errorText={
              errors.password && touched.password ? errors?.password : ''
            }
            type="auth"
          />
        </View>

        <View style={styles.rememberContainer}>
          <CheckBox
            checked={values.remember}
            onChange={val => {
              setFieldValue('remember', val);
            }}
            label="Remember me"
          />
          <StyledText
            onPress={() => {
              navigation.navigate('ForgotPassword');
            }}
            style={{
              fontFamily: FONTS.poppins.semibold,
              color: COLORS.primary,
              alignSelf: 'flex-end',
            }}>
            Forgot Password?
          </StyledText>
        </View>
        <CustomButton
          onPress={() => {
            handleSubmit();
          }}>
          Login
        </CustomButton>
      </View>
    </AuthHocView>
  );
};

export default Login;

const styles = StyleSheet.create({
  rememberContainer: {
    paddingBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
