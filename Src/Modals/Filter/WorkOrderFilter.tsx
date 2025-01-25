import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import TextInputBox from '../../Components/TextInputBox';
import CustomButton from '../../Components/CustomButton';
import {
  MaintenanceWorkOrderFilterDataProps,
  MaintenanceWorkOrderFilterItemsDataProps,
} from '../../Screens/HomeScreens/MaintenanceWorkorder.tsx/@types/WorkOrderTypes';
import {NAME_NUMBER_REGEX, NUMBER_REGEX} from '../../Utilities/Constants';

const workOrderValidationSchema = Yup.object().shape({
  work_title: Yup.string().matches(
    NAME_NUMBER_REGEX,
    'Enter valid work order name',
  ),
  work_order: Yup.string().matches(NUMBER_REGEX, 'Enter valid work order code'),
});

const WorkOrderFilter = ({
  filterData,
  onApplyFilter,
  onClose,
}: MaintenanceWorkOrderFilterDataProps) => {
  const {
    handleSubmit,
    setValues,
    handleChange,
    resetForm,
    values,
    initialValues,
    errors,
    touched,
  } = useFormik<MaintenanceWorkOrderFilterItemsDataProps>({
    initialValues: {
      work_title: '',
      work_order: '',
    },
    validationSchema: workOrderValidationSchema,
    onSubmit(values) {
      onApplyFilter && onApplyFilter(values);
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
        title="Work Title"
        value={values.work_title}
        placeHolder="Work title"
        onChangeText={handleChange('work_title')}
        textInputProps={{
          maxLength: 50,
        }}
        errorText={
          errors.work_title && touched.work_title ? errors?.work_title : ''
        }
      />

      <TextInputBox
        title="Work Code"
        value={values.work_order}
        placeHolder="Work code"
        onChangeText={handleChange('work_order')}
        textInputProps={{maxLength: 50}}
        errorText={
          errors.work_order && touched.work_order ? errors?.work_order : ''
        }
        keyboardType="numeric"
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
            //@ts-ignore
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

export default WorkOrderFilter;

const styles = StyleSheet.create({});
