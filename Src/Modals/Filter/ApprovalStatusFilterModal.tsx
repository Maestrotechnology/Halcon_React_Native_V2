import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {ApprovalStatusFilterProps} from '../../@types/modals';
import {useFormik} from 'formik';
import {
  APPROVAL_STATUS_OPTIONS,
  DeviceStatusProps,
  requestStatusOptions,
} from '../../Utilities/StaticDropdownOptions';
import DropdownBox from '../../Components/DropdownBox';
import CustomButton from '../../Components/CustomButton';
import {FilterModalProps} from '../../@types/Global';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';
import ActionButtons from '../../Components/ActionButtons';

const reqStatusOptions: DeviceStatusProps[] = [...requestStatusOptions];

const ApprovalStatusFilterModal = ({
  filterData,
  onApplyFilter,
  onClose,
  initialValue,
}: FilterModalProps<ApprovalStatusFilterProps>) => {
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
  } = useFormik<ApprovalStatusFilterProps>({
    initialValues: {
      role_name: '',
      status: null,
    },
    onSubmit(values) {
      onApplyFilter(values);
      onClose();
    },
  });

  useEffect(() => {
    if (filterData) {
      setValues({
        ...filterData,
      });
    }
  }, []);

  useEffect(() => {
    if (filterData) {
      setValues({
        ...filterData,
      });
    }
  }, [filterData]);

  return (
    <View>
      <TextInputBox
        value={values?.role_name}
        onChangeText={(val: string) => {
          setFieldValue('role_name', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        placeHolder="Enter Role Name"
        title="Role Name"
        isEditable
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
      />
      <DropdownBox
        title="Status"
        options={[...APPROVAL_STATUS_OPTIONS]}
        value={values.status}
        placeHolder="Select Status"
        onSelect={val => {
          setFieldValue('status', val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue('status', null);
        }}
      />
      <ActionButtons
        onPressNegativeBtn={() => {
          resetForm({
            values: {
              ...initialValues,
            },
          });
          onApplyFilter(null);
          onClose();
        }}
        onPressPositiveBtn={handleSubmit}
      />
    </View>
  );
};

export default ApprovalStatusFilterModal;

const styles = StyleSheet.create({});
