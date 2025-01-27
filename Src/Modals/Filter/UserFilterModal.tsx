import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  ServiceRequestFilterDataProps,
  ServiceRequestListFilterModalProps,
  UserListFilterdataProps,
  UserListFilterModalProps,
} from '../../@types/modals';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {
  DeviceStatusProps,
  SORT_OPTIONS,
  priorityLevelOptions,
  requestStatusOptions,
} from '../../Utilities/StaticDropdownOptions';
import DropdownBox from '../../Components/DropdownBox';
import CustomButton from '../../Components/CustomButton';
import DateTimePicker from '../../Components/DateTimePicker';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS} from '../../Utilities/Constants';

const reqStatusOptions: DeviceStatusProps[] = [
  // {id: 1, name: 'Created'},
  ...requestStatusOptions,
];

const UserFilterModal = ({
  filterData,
  onApplyFilter,
  onClose,
  initialValue,
}: UserListFilterModalProps) => {
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
  } = useFormik<UserListFilterdataProps>({
    initialValues: {
      role_id: null,
      username: '',
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

  return (
    <View>
      <DropdownBox
        title="Machine"
        value={values.role_id}
        placeHolder="Select machine"
        apiType="machineList"
        onSelect={val => {
          setFieldValue('machine', val);
        }}
        type="search"
        fieldName="machine_name"
        isLocalSearch
        searchFieldName="machine_name"
        onIconPress={() => {
          setFieldValue('machine', null);
        }}
      />

      {/* <DropdownBox
        title="Division"
        value={values.division}
        placeHolder="Select Division"
        apiType="division"
        onSelect={val => {
          setFieldValue('division', val);
        }}
        type="search"
        fieldName="description"
        isLocalSearch
        searchFieldName="description"
        onIconPress={() => {
          setFieldValue('division', null);
        }}
      /> */}
      <TextInputBox
        value={values?.username}
        onChangeText={(val: string) => {
          setFieldValue('username', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        placeHolder="Enter User Name"
        title="User Name"
        isEditable
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
                reqStatus: null,
              },
            });
            onApplyFilter(null);
            onClose();
          }}>
          Reset
        </CustomButton>
        <CustomButton style={{width: '45%'}} onPress={handleSubmit}>
          Submit
        </CustomButton>
      </View>
    </View>
  );
};

export default UserFilterModal;

const styles = StyleSheet.create({});
