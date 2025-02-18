import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';
import {ConvertJSONtoFormData, isLoading} from '../../Utilities/Methods';
import {
  CreateMachineService,
  CreateWorkCenterService,
  UpdateWorkCenterService,
} from '../../Services/Services';
import {getCatchMessage} from '../../Utilities/GeneralUtilities';
import Toast from '../../Components/Toast';
import {UseToken} from '../../Utilities/StoreData';
import {AddEditModalProps} from '../../@types/Global';
import {MachinesListFilterProps} from '../../@types/modals';
import DropdownBox from '../../Components/DropdownBox';

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('* Machine Name is required.'),
});
const AddEditMachinesModal = ({
  onApplyChanges,
  onClose,
  type,
  lineData,
}: AddEditModalProps<MachinesListFilterProps>) => {
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
  } = useFormik<MachinesListFilterProps>({
    initialValues: {
      machine_name: '',
      equipment_id: '',
      division_id: '',
      serial_no: '',
      model: '',
      work_center_id: '',
      equipment_description: '',
      is_spindle: '',
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

  const handleAddWorkCenter = (values: MachinesListFilterProps) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
    };

    CreateMachineService(ConvertJSONtoFormData(finalObj))
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
  const handleUpdateWorkCenter = (values: MachinesListFilterProps) => {
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
        value={values?.machine_name}
        onChangeText={(val: string) => {
          setFieldValue('machine_name', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
        isRequired
        placeHolder="Enter Machine Name"
        title="Machine Name"
        isEditable={type !== 'View'}
        errorText={
          errors?.machine_name && touched?.machine_name
            ? errors?.machine_name
            : ''
        }
      />
      <TextInputBox
        value={values?.equipment_id}
        onChangeText={(val: string) => {
          setFieldValue('equipment_id', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
        isRequired
        placeHolder="Enter Machine ID"
        title="Machine ID"
        isEditable={type !== 'View'}
        errorText={
          errors?.equipment_id && touched?.equipment_id
            ? errors?.equipment_id
            : ''
        }
      />

      <DropdownBox
        title="Division"
        value={values.division_id}
        placeHolder="Select Division"
        apiType="division"
        onSelect={val => {
          setFieldValue('division_id', val);
        }}
        type="search"
        fieldName="description"
        isLocalSearch
        searchFieldName="description"
        onIconPress={() => {
          setFieldValue('division_id', null);
        }}
      />

      <TextInputBox
        value={values?.equipment_id}
        onChangeText={(val: string) => {
          setFieldValue('serial_no', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
        placeHolder="Enter Serial No"
        title="Serial No"
        isEditable={type !== 'View'}
      />

      <TextInputBox
        value={values?.equipment_id}
        onChangeText={(val: string) => {
          setFieldValue('model', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
        placeHolder="Enter Model"
        title="Model"
        isEditable={type !== 'View'}
      />

      <DropdownBox
        title="Work Center"
        value={values.work_center_id}
        placeHolder="Select Work Center"
        apiType="work_center"
        onSelect={val => {
          setFieldValue('work_center_id', val);
        }}
        type="search"
        fieldName="work_center_name"
        isLocalSearch
        searchFieldName="work_center_name"
        onIconPress={() => {
          setFieldValue('work_center_id', null);
        }}
      />

      <TextInputBox
        value={values?.equipment_id}
        onChangeText={(val: string) => {
          setFieldValue('equipment_description', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
        placeHolder="Enter Equipment Description"
        title="Equipment Description"
        isEditable={type !== 'View'}
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

export default AddEditMachinesModal;

const styles = StyleSheet.create({});
