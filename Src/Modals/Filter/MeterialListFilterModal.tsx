import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import {MeterialListFilterdataProps} from '../../@types/modals';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';
import {FilterModalProps} from '../../@types/Global';

const MeterialListFilterModal = ({
  filterData,
  onApplyFilter,
  onClose,
}: FilterModalProps<MeterialListFilterdataProps>) => {
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
  } = useFormik<MeterialListFilterdataProps>({
    initialValues: {
      material_name: '',
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
        value={values?.material_name}
        onChangeText={(val: string) => {
          setFieldValue('material_name', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        placeHolder="Enter Material Name"
        title="Material Name"
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

export default MeterialListFilterModal;

const styles = StyleSheet.create({});
