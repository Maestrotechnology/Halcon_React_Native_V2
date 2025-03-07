import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';
import {ConvertJSONtoFormData, isLoading} from '../../Utilities/Methods';
import {editApprovalStatus} from '../../Services/Services';
import {getCatchMessage} from '../../Utilities/GeneralUtilities';
import Toast from '../../Components/Toast';
import {UseToken} from '../../Utilities/StoreData';
import {ApprovalStatusListDataProps} from '../../@types/api';
import * as Yup from 'yup';
import {AddEditModalProps} from '../../@types/Global';
import {APPROVAL_STATUS_OPTIONS} from '../../Utilities/StaticDropdownOptions';
import DropdownBox from '../../Components/DropdownBox';
import ActionButtons from '../../Components/ActionButtons';

const validationSchema = Yup.object().shape({
  action: Yup.mixed().required('* Status is required.'),
  comment: Yup.string().trim().required('* Comment is required.'),
});
const ModifyApprovalStatusModal = ({
  onApplyChanges,
  onClose,
  type,
  lineData,
}: AddEditModalProps<ApprovalStatusListDataProps>) => {
  const token = UseToken();
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
    errors,
    touched,
  } = useFormik<ApprovalStatusListDataProps>({
    initialValues: {
      id: lineData?.id || 0,
      action: null,
      comment: '',
    },
    validationSchema,
    onSubmit(values) {
      handleUpdateStatus(values);
    },
  });

  // update user
  const handleUpdateStatus = (values: any) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token,
      approval_id: lineData?.id,
      action: values?.action?.id,
    };

    editApprovalStatus(ConvertJSONtoFormData(finalObj))
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

  useEffect(() => {
    if (lineData) {
      setValues({
        ...lineData,
      });
    }
  }, []);
  return (
    <View>
      <DropdownBox
        title="Status"
        options={[...APPROVAL_STATUS_OPTIONS]}
        value={values.action}
        placeHolder="Select Status"
        onSelect={val => {
          setFieldValue('action', val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue('action', null);
        }}
        errorText={errors?.action && touched?.action ? errors?.action : ''}
      />
      <TextInputBox
        value={values?.comment}
        onChangeText={(val: string) => {
          setFieldValue('comment', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
          height: 80,
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.Description,
        }}
        multiline
        isRequired
        placeHolder="Enter Comment"
        title="Comment"
        isEditable={type !== 'View'}
        errorText={errors?.comment && touched?.comment ? errors?.comment : ''}
      />
      <ActionButtons
        onPressNegativeBtn={() => {
          resetForm({
            values: {
              ...initialValues,
            },
          });
          onClose();
        }}
        onPressPositiveBtn={handleSubmit}
        PositiveBtnTitle={type || 'SUbmit'}
        NegativeBtnTitle="Close"
      />
    </View>
  );
};

export default ModifyApprovalStatusModal;

const styles = StyleSheet.create({});
