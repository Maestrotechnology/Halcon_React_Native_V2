import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import {HolidayListFilterProps} from '../../@types/modals';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';
import {FilterModalProps} from '../../@types/Global';
import ActionButtons from '../../Components/ActionButtons';

const HolidayListFilterModal = ({
  filterData,
  onApplyFilter,
  onClose,
}: FilterModalProps<HolidayListFilterProps>) => {
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
  } = useFormik<HolidayListFilterProps>({
    initialValues: {
      reason: '',
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
        value={values?.reason}
        onChangeText={(val: string) => {
          setFieldValue('reason', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        placeHolder="Enter Reason"
        title="Reason"
        isEditable
        textInputProps={{
          maxLength: INPUT_SIZE.Description,
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

export default HolidayListFilterModal;

const styles = StyleSheet.create({});
