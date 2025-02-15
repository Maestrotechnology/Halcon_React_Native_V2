import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import {WorkCenterListFilterProps} from '../../@types/modals';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS} from '../../Utilities/Constants';
import {FilterModalProps} from '../../@types/Global';

const WorkCenterListFilterModal = ({
  filterData,
  onApplyFilter,
  onClose,
}: FilterModalProps<WorkCenterListFilterProps>) => {
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
  } = useFormik<WorkCenterListFilterProps>({
    initialValues: {
      name: '',
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
        value={values?.name}
        onChangeText={(val: string) => {
          setFieldValue('name', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        placeHolder="Enter Work Center Name"
        title="Work Center Name"
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

export default WorkCenterListFilterModal;

const styles = StyleSheet.create({});
