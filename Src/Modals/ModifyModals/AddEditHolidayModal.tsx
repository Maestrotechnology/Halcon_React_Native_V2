import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';
import {ConvertJSONtoFormData, isLoading} from '../../Utilities/Methods';
import {
  CreateSpecialHolidayService,
  UpdateSpecialHolidayService,
} from '../../Services/Services';
import {getCatchMessage} from '../../Utilities/GeneralUtilities';
import Toast from '../../Components/Toast';
import {UseToken} from '../../Utilities/StoreData';
import {AddEditModalProps} from '../../@types/Global';
import {HolidayListDataProps} from '../../@types/api';
import DateTimePicker from '../../Components/DateTimePicker';

const validationSchema = Yup.object().shape({
  holiday_date: Yup.string().trim().required('* Holiday Date is required.'),
});
const AddEditHolidayModal = ({
  onApplyChanges,
  onClose,
  type,
  lineData,
}: AddEditModalProps<HolidayListDataProps>) => {
  const token = UseToken();
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
    errors,
    touched,
  } = useFormik<HolidayListDataProps>({
    initialValues: {
      reason: '',
      holiday_date: '',
    },
    validationSchema,
    onSubmit(values) {
      if (type === 'Create') {
        handleAddSpecialHoliday(values);
      } else if (type === 'Update') {
        handleUpdateSpecialHoliday(values);
      }
    },
  });

  const handleAddSpecialHoliday = (values: HolidayListDataProps) => {
    isLoading(true);
    let finalObj = {
      ...values,
      id: lineData?.id,
      token: token,
    };

    CreateSpecialHolidayService(ConvertJSONtoFormData(finalObj))
      .then(async res => {
        if (res.data.status === 1) {
          Toast.success(res?.data?.msg);
          onApplyChanges();
          onClose();
        } else {
          Toast.error(res.data.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => isLoading(false));
  };

  // update user
  const handleUpdateSpecialHoliday = (values: HolidayListDataProps) => {
    isLoading(true);
    let finalObj = {
      ...values,
      special_holiday_id: lineData?.id,
      token: token,
      holiday_date: '',
    };

    UpdateSpecialHolidayService(ConvertJSONtoFormData(finalObj))
      .then(async res => {
        if (res.data.status === 1) {
          Toast.success(res?.data?.msg);
          onApplyChanges();
          onClose();
        } else {
          Toast.error(res.data.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (lineData) {
      setValues({
        ...lineData,
      });
    }
  }, []);
  return (
    <View>
      <DateTimePicker
        mode="date"
        format="YYYY-MM-DD"
        title="Starting Date"
        value={values.holiday_date}
        onSelect={date => {
          setFieldValue('holiday_date', date);
        }}
        isDisabled={type !== 'Create'}
        isRequired
        errorText={
          errors?.holiday_date && touched.holiday_date
            ? errors?.holiday_date
            : ''
        }
        minimumDate={new Date()}
      />

      <TextInputBox
        value={values?.reason}
        onChangeText={(val: string) => {
          setFieldValue('reason', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
        placeHolder="Enter Reason"
        title="Reason"
        isEditable={type !== 'View'}
        errorText={errors?.reason && touched?.reason ? errors?.reason : ''}
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
            onClose();
          }}>
          Close
        </CustomButton>
        <CustomButton style={{width: '45%'}} onPress={handleSubmit}>
          {type || 'SUbmit'}
        </CustomButton>
      </View>
    </View>
  );
};

export default AddEditHolidayModal;

const styles = StyleSheet.create({});
