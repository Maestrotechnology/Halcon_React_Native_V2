import {StyleSheet, View} from 'react-native';
import React from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE, REGEX} from '../../Utilities/Constants';
import {
  ConvertJSONtoFormData,
  isLoading,
  RemoveSpace,
} from '../../Utilities/Methods';
import {ChangePasswordService} from '../../Services/Services';
import {getCatchMessage} from '../../Utilities/GeneralUtilities';
import {UseToken} from '../../Utilities/StoreData';
import {AddEditModalProps} from '../../@types/Global';
import {ChangePasswordprops} from '../../@types/modals';
import Toast from '../../Components/Toast';
import {UserRequestListDataProps} from '../../@types/api';

const validationSchema = Yup.object().shape({
  newpassword: Yup.string()
    .matches(
      REGEX.PASSWORD_REGEX,
      'Password must be at least 5 characters long, contain at least one uppercase letter, one lowercase letter, and one number.',
    )
    .required('Password is required'),

  confirmpassword: Yup.string()
    .oneOf([Yup.ref('newpassword'), ''], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ChangePasswordModal = ({
  onApplyChanges,
  onClose,
  type,
  lineData,
}: AddEditModalProps<UserRequestListDataProps>) => {
  const token = UseToken();
  const {
    setFieldValue,
    handleSubmit,
    resetForm,
    values,
    initialValues,
    errors,
    touched,
  } = useFormik<ChangePasswordprops>({
    initialValues: {
      newpassword: '',
      confirmpassword: '',
    },
    validationSchema,
    onSubmit(values) {
      HandleChangePassword(values);
    },
  });

  const HandleChangePassword = (values: ChangePasswordprops) => {
    isLoading(true);
    let finalObj = {
      ...values,
      user_id: lineData?.user_id,
      token: token,
    };

    ChangePasswordService(ConvertJSONtoFormData(finalObj))
      .then(async res => {
        if (res.data.status === 1) {
          Toast.success(res?.data?.msg);
          onApplyChanges();
          onClose();
        } else {
          Toast.error(res.data.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => isLoading(false));
  };

  return (
    <View>
      <TextInputBox
        value={values?.newpassword}
        onChangeText={(val: string) => {
          setFieldValue('newpassword', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
        isRequired
        placeHolder="Enter Password"
        title="Password"
        isEditable={type !== 'View'}
        errorText={
          errors?.newpassword && touched?.newpassword ? errors?.newpassword : ''
        }
      />
      <TextInputBox
        value={values?.confirmpassword}
        onChangeText={(val: string) => {
          setFieldValue('confirmpassword', RemoveSpace(val));
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.Machine_ID,
        }}
        isRequired
        placeHolder="Enter Confirm Password"
        title="Confirm Password"
        isEditable={type !== 'View'}
        errorText={
          errors?.confirmpassword && touched?.confirmpassword
            ? errors?.confirmpassword
            : ''
        }
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <CustomButton
          style={{width: '45%'}}
          type="secondary"
          onPress={() => {
            resetForm({
              values: {
                ...initialValues,
              },
            });
            onClose();
          }}>
          Close
        </CustomButton>
        <CustomButton style={{width: '45%'}} onPress={handleSubmit}>
          {type || 'SUbmit'}
        </CustomButton>
      </View>
    </View>
  );
};

export default ChangePasswordModal;

const styles = StyleSheet.create({});
