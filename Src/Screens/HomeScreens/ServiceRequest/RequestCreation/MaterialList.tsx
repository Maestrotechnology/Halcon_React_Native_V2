import {useFormik} from 'formik';
import React from 'react';
import {Button, StyleSheet, View} from 'react-native';

import * as Yup from 'yup';
import {addMeterialProps, MaterialListProps} from '../../../../@types/context';
import DropdownBox from '../../../../Components/DropdownBox';
import TextInputBox from '../../../../Components/TextInputBox';
import CustomButton from '../../../../Components/CustomButton';
import {COLORS, INPUT_SIZE} from '../../../../Utilities/Constants';
import {useServiceRequestDetails} from '../../../../Utilities/Contexts';

const validationSchema = Yup.object().shape({
  material_id: Yup.mixed().required('* required'),
  quantity: Yup.string().required('* required'),
});
export default function MaterialList({handleAddMeterialList}: any) {
  const {values, setFieldValue, errors, touched, handleSubmit, resetForm} =
    useFormik<addMeterialProps>({
      initialValues: {
        material_id: null,
        quantity: '',
      },
      validationSchema,
      onSubmit() {
        handleAddMeterialList(values);
        resetForm();
      },
    });

  const {isCreate, isSubmitting, isUpdate, isView} = useServiceRequestDetails();
  return (
    <View style={styles.MeterialListFlex}>
      <DropdownBox
        title="Material"
        // isRequired
        apiType="MaterialList"
        value={values.material_id}
        placeHolder="Select Material"
        onSelect={val => {
          setFieldValue('material_id', val);
        }}
        type="search"
        fieldName="material_name"
        onIconPress={() => {
          setFieldValue('material_id', null);
        }}
        isLocalSearch={true}
        errorText={
          errors.material_id && touched.material_id ? errors.material_id : ''
        }
        mainContainerStyle={{width: '40%'}}
        // isDisabled={!CheckisEditable()}
        // isEnableRightIcon={CheckisEditable()}
      />
      <TextInputBox
        title="Quantity"
        value={values.quantity}
        placeHolder="Quantity"
        onChangeText={val => {
          setFieldValue('quantity', val);
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.AMOUNT_LENGTH,
        }}
        validationType="NUMBER"
        //   isEditable={isCreate || isUpdate}
        customContainerStyle={{width: '40%'}}
        customInputBoxContainerStyle={{
          backgroundColor: COLORS.white,
          borderColor:
            errors.quantity && touched.quantity
              ? COLORS.dangerColor
              : COLORS.primary,
        }}
        errorText={errors.quantity && touched.quantity ? errors.quantity : ''}
      />
      <View>
        <CustomButton style={{width: 40, marginTop: 30}} onPress={handleSubmit}>
          +
        </CustomButton>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  PriorityContainer: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  CheckBoxContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  MeterialListFlex: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});
