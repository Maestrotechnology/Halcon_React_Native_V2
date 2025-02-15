import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import {RoleListFilterdataProps} from '../../@types/modals';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS} from '../../Utilities/Constants';
import {FilterModalProps} from '../../@types/Global';

const AccessRoleFilterModal = ({
  filterData,
  onApplyFilter,
  onClose,
}: FilterModalProps<RoleListFilterdataProps>) => {
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
  } = useFormik<RoleListFilterdataProps>({
    initialValues: {
      role_name: '',
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

export default AccessRoleFilterModal;

const styles = StyleSheet.create({});
