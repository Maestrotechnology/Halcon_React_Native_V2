import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';
import {ConvertJSONtoFormData, isLoading} from '../../Utilities/Methods';
import {
  CreateDivisionService,
  UpdateDivisionService,
} from '../../Services/Services';
import {getCatchMessage} from '../../Utilities/GeneralUtilities';
import Toast from '../../Components/Toast';
import {UseToken} from '../../Utilities/StoreData';
import {DivisionListDataProps} from '../../@types/api';
import {AddEditModalProps} from '../../@types/Global';

const validationSchema = Yup.object().shape({
  description: Yup.string().trim().required('* Division Name is required.'),
});
const AddEditDivisionModal = ({
  onApplyChanges,
  onClose,
  type,
  lineData,
}: AddEditModalProps<DivisionListDataProps>) => {
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
  } = useFormik<DivisionListDataProps>({
    initialValues: {
      division_id: lineData?.division_id || 0,
      description: '',
    },
    validationSchema,
    onSubmit(values) {
      if (type === 'Create') {
        handleAddDivision(values);
      } else if (type === 'Update') {
        handleUpdateDivision(values);
      }
    },
  });

  const handleAddDivision = (values: DivisionListDataProps) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
    };

    CreateDivisionService(ConvertJSONtoFormData(finalObj))
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
  const handleUpdateDivision = (values: DivisionListDataProps) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
    };

    UpdateDivisionService(ConvertJSONtoFormData(finalObj))
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
        value={values?.description}
        onChangeText={(val: string) => {
          setFieldValue('description', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
        isRequired
        placeHolder="Enter Division Name"
        title="Division Name"
        isEditable={type !== 'View'}
        errorText={
          errors?.description && touched?.description ? errors?.description : ''
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

export default AddEditDivisionModal;

const styles = StyleSheet.create({});
