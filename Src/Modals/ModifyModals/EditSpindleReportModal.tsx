import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';
import {ConvertJSONtoFormData, isLoading} from '../../Utilities/Methods';
import {AddSpindleHoursService} from '../../Services/Services';
import {
  converttoHours,
  converttoMinutes,
  getCatchMessage,
  getMonthName,
} from '../../Utilities/GeneralUtilities';
import Toast from '../../Components/Toast';
import {UseToken} from '../../Utilities/StoreData';
import {SpindleListDataProps} from '../../@types/api';
import * as Yup from 'yup';
import {AddEditModalProps} from '../../@types/Global';
import SVGIcon from '../../Components/SVGIcon';

const validationSchema = Yup.object().shape({
  task_name: Yup.string().trim().required('* Task Name is required.'),
});
const EditSpindleReportModal = ({
  onApplyChanges,
  onClose,
  type,
  lineData,
}: AddEditModalProps<any>) => {
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
  } = useFormik<any>({
    initialValues: {
      machine_id: lineData?.machine_id || 0,
      previous_month_hour: '',
      current_month_hour: '',
    },
    validationSchema,
    onSubmit(values) {
      handleUpdateSpindleHours(values);
    },
  });

  const handleUpdateSpindleHours = (type: 'pre' | 'current') => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
      machine_id: lineData?.machine_id,
      spindle_hour:
        type === 'pre'
          ? converttoMinutes(values?.previous_month_hour)
          : converttoMinutes(values?.current_month_hour),
      spindle_month:
        type === 'pre' ? lineData?.previous_month : lineData?.current_month,
    };

    AddSpindleHoursService(ConvertJSONtoFormData(finalObj))
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
        ...values,
        previous_month_hour: converttoHours(
          lineData.previous_month_spindle_hr || 0,
        ),
        current_month_hour: converttoHours(
          lineData?.current_month_spindle_hr || 0,
        ),
      });
    }
  }, []);
  return (
    <View>
      <View style={styles.LineEditItem}>
        <TextInputBox
          value={
            typeof values?.previous_month_hour === 'number'
              ? values?.previous_month_hour.toString()
              : values?.previous_month_hour
          }
          onChangeText={(val: string) => {
            setFieldValue('previous_month_hour', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          keyboardType="number-pad"
          validationType="NUMBER"
          textInputProps={{
            maxLength: INPUT_SIZE.SpindleRunningHours,
          }}
          customContainerStyle={{width: '90%'}}
          isRequired
          placeHolder={`Enter ${getMonthName()?.previous} Total Running Hours`}
          title={`${getMonthName()?.previous} Total Running Hours`}
          isEditable={type !== 'View'}
          errorText={
            errors?.previous_month_hour && touched?.previous_month_hour
              ? errors?.previous_month_hour
              : ''
          }
        />
        <SVGIcon
          icon="successIcon"
          isButton
          onPress={() => {
            handleUpdateSpindleHours('pre');
          }}
        />
      </View>
      <View style={styles.LineEditItem}>
        <TextInputBox
          value={
            typeof values?.current_month_hour === 'number'
              ? values?.current_month_hour.toString()
              : values?.current_month_hour
          }
          onChangeText={(val: string) => {
            setFieldValue('current_month_hour', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          customContainerStyle={{width: '90%'}}
          keyboardType="number-pad"
          validationType="NUMBER"
          textInputProps={{
            maxLength: INPUT_SIZE.SpindleRunningHours,
          }}
          isRequired
          placeHolder={`Enter ${getMonthName()?.current} Total Running Hours`}
          title={`${getMonthName()?.current} Total Running Hours`}
          isEditable={type !== 'View'}
          errorText={
            errors?.current_month_hour && touched?.current_month_hour
              ? errors?.current_month_hour
              : ''
          }
        />{' '}
        <SVGIcon
          icon="successIcon"
          isButton
          onPress={() => {
            handleUpdateSpindleHours('current');
          }}
        />
      </View>
    </View>
  );
};

export default EditSpindleReportModal;

const styles = StyleSheet.create({
  LineEditItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
});
