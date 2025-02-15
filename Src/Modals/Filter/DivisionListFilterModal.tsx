import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import {DivisionListFilterProps} from '../../@types/modals';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS} from '../../Utilities/Constants';
import {FilterModalProps} from '../../@types/Global';

const DivisionListFilterModal = ({
  filterData,
  onApplyFilter,
  onClose,
}: FilterModalProps<DivisionListFilterProps>) => {
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
  } = useFormik<DivisionListFilterProps>({
    initialValues: {
      description: '',
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
        value={values?.description}
        onChangeText={(val: string) => {
          setFieldValue('description', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        placeHolder="Enter Division Name"
        title="Division Name"
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

export default DivisionListFilterModal;

const styles = StyleSheet.create({});
