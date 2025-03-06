import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import {
  UserListFilterdataProps,
  UserListFilterModalProps,
} from '../../@types/modals';
import DropdownBox from '../../Components/DropdownBox';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';

const UserFilterModal = ({
  filterData,
  onApplyFilter,
  onClose,
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
        title="Role"
        value={values.role_id}
        placeHolder="Select Role"
        apiType="roleList"
        onSelect={val => {
          setFieldValue('role_id', val);
        }}
        type="search"
        fieldName="role_name"
        isLocalSearch
        searchFieldName="role_name"
        onIconPress={() => {
          setFieldValue('role_id', null);
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
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
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
