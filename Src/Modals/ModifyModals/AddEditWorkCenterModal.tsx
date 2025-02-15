import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';
import {ConvertJSONtoFormData, isLoading} from '../../Utilities/Methods';
import {
  CreateWorkCenterService,
  UpdateWorkCenterService,
} from '../../Services/Services';
import {getCatchMessage} from '../../Utilities/GeneralUtilities';
import Toast from '../../Components/Toast';
import {UseToken} from '../../Utilities/StoreData';
import {AddEditModalProps} from '../../@types/Global';
import {WorkCenterListFilterProps} from '../../@types/modals';

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('* Work Center Name is required.'),
});
const AddEditWorkCenterModal = ({
  onApplyChanges,
  onClose,
  type,
  lineData,
}: AddEditModalProps<WorkCenterListFilterProps>) => {
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
  } = useFormik<WorkCenterListFilterProps>({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit(values) {
      if (type === 'Create') {
        handleAddWorkCenter(values);
      } else if (type === 'Update') {
        handleUpdateWorkCenter(values);
      }
    },
  });

  const handleAddWorkCenter = (values: WorkCenterListFilterProps) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
    };

    CreateWorkCenterService(ConvertJSONtoFormData(finalObj))
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

  // update user
  const handleUpdateWorkCenter = (values: WorkCenterListFilterProps) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
    };

    UpdateWorkCenterService(ConvertJSONtoFormData(finalObj))
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
      <TextInputBox
        value={values?.name}
        onChangeText={(val: string) => {
          setFieldValue('name', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
        isRequired
        placeHolder="Enter Work Center Name"
        title="Work Center Name"
        isEditable={type !== 'View'}
        errorText={errors?.name && touched?.name ? errors?.name : ''}
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

export default AddEditWorkCenterModal;

const styles = StyleSheet.create({});
