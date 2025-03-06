import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import {
  MachinesListFilterProps,
  WorkCenterListFilterProps,
} from '../../@types/modals';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';
import {FilterModalProps} from '../../@types/Global';
import DropdownBox from '../../Components/DropdownBox';

const MachinesListFilterModal = ({
  filterData,
  onApplyFilter,
  onClose,
}: FilterModalProps<MachinesListFilterProps>) => {
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
  } = useFormik<MachinesListFilterProps>({
    initialValues: {
      machine_name: '',
      machine_id: '',
      division_id: '',
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
      {/* <DropdownBox
        title="Machine"
        value={values.machine_id}
        placeHolder="Select machine"
        apiType="machineList"
        onSelect={val => {
          setFieldValue('machine_id', val);
        }}
        type="search"
        fieldName="equipment_id"
        isLocalSearch
        searchFieldName="equipment_id"
        onIconPress={() => {
          setFieldValue('machine_id', null);
        }}
      /> */}
      <TextInputBox
        value={values?.machine_name}
        onChangeText={(val: string) => {
          setFieldValue('machine_name', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        placeHolder="Enter Machine Name"
        title="Machine Name"
        isEditable
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
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

export default MachinesListFilterModal;

const styles = StyleSheet.create({});
