import {useFormik} from 'formik';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import * as Yup from 'yup';
import {addMeterialProps} from '../../../../@types/context';
import DropdownBox from '../../../../Components/DropdownBox';
import TextInputBox from '../../../../Components/TextInputBox';
import CustomButton from '../../../../Components/CustomButton';
import {COLORS, INPUT_SIZE} from '../../../../Utilities/Constants';
import StyledText from '../../../../Components/StyledText';
import {FONTS} from '../../../../Utilities/Fonts';
import SVGIcon from '../../../../Components/SVGIcon';

const validationSchema = Yup.object().shape({
  material_id: Yup.mixed().required('* required'),
  quantity: Yup.string().required('* required'),
});
export default function MaterialList({
  handleAddMeterialList,
  isEditable,
  contextValue,
  CheckisEditable,
}: any) {
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

  return (
    <View>
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
          isDisabled={!isEditable}
          isEnableRightIcon={isEditable}
        />
        <TextInputBox
          title="Quantity"
          value={values.quantity}
          placeHolder="Quantity"
          onChangeText={val => {
            if (val > '0' || '') {
              setFieldValue('quantity', val);
            }
          }}
          textInputProps={{
            maxLength: INPUT_SIZE.AMOUNT_LENGTH,
            keyboardType: 'number-pad',
          }}
          validationType="NUMBER"
          //   isEditable={isCreate || isUpdate}
          customContainerStyle={{width: '40%'}}
          customInputBoxContainerStyle={{
            backgroundColor: COLORS.white,
            borderColor: isEditable
              ? errors.quantity && touched.quantity
                ? COLORS.dangerColor
                : COLORS.primary
              : COLORS.grey,
          }}
          isEditable={isEditable}
          errorText={errors.quantity && touched.quantity ? errors.quantity : ''}
        />
        <View>
          <CustomButton
            isDisabled={!isEditable}
            style={{width: 40, marginTop: 30}}
            onPress={handleSubmit}>
            +
          </CustomButton>
        </View>
      </View>
      {contextValue?.values?.material_list?.length > 0 && (
        <View style={styles.MaterialListTable}>
          {contextValue?.values?.material_list?.map(
            (item: addMeterialProps, index: number) => {
              return (
                <>
                  {index === 0 && (
                    <View style={[styles.MeterialListBox]} key={'09'}>
                      <StyledText
                        style={{
                          color: COLORS.black,
                          fontFamily: FONTS.poppins.medium,
                          width: '10%',
                        }}>
                        SNo
                      </StyledText>
                      <StyledText
                        style={{
                          color: COLORS.black,
                          fontFamily: FONTS.poppins.medium,
                          width: '50%',
                        }}>
                        Material
                      </StyledText>
                      <StyledText
                        style={{
                          color: COLORS.black,
                          fontFamily: FONTS.poppins.medium,
                          width: '20%',
                        }}>
                        Qty
                      </StyledText>
                      {CheckisEditable && (
                        <StyledText
                          style={{
                            color: COLORS.black,
                            fontFamily: FONTS.poppins.medium,
                            width: '10%',
                          }}>
                          -
                        </StyledText>
                      )}
                    </View>
                  )}
                  <View style={[styles.MeterialListBox]} key={index}>
                    <StyledText style={{color: COLORS.black, width: '10%'}}>
                      {index + 1}
                    </StyledText>
                    <StyledText style={{color: COLORS.black, width: '50%'}}>
                      {item?.material_id?.material_name || ''}
                    </StyledText>
                    <StyledText style={{color: COLORS.black, width: '20%'}}>
                      {item?.quantity || ''}
                    </StyledText>
                    {CheckisEditable && (
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          width: '10%',
                        }}>
                        <SVGIcon
                          icon="failureIcon"
                          width={20}
                          height={20}
                          isButton
                          onPress={() => {
                            contextValue?.setFieldValue(
                              'material_list',
                              contextValue?.values?.material_list?.filter(
                                (item: addMeterialProps, Itemindex: number) =>
                                  Itemindex !== index,
                              ),
                            );
                          }}
                        />
                      </View>
                    )}
                  </View>
                </>
              );
            },
          )}
        </View>
      )}
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
  MeterialListBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  MaterialListTable: {
    flexDirection: 'column',
    gap: 5,
  },
});
