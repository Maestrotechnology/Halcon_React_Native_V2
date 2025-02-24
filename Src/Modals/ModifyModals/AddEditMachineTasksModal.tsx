import {View} from 'react-native';
import {AddEditModalProps} from '../../@types/Global';
import {MachinesTaskMappingListDataProps} from '../../@types/api';
import DropdownBox from '../../Components/DropdownBox';
import {useFormik} from 'formik';
import {selectPeriodicCategory} from '../../Utilities/Methods';
import {COLORS, INPUT_SIZE, PeriodicCatgory} from '../../Utilities/Constants';
import TextInputBox from '../../Components/TextInputBox';
import * as Yup from 'yup';
import DateTimePicker from '../../Components/DateTimePicker';

const validationSchema = Yup.object().shape({
  duration: Yup.string().required('Duration is required'),
  starting_date: Yup.string().required('Start Date is required'),
  starting_time: Yup.string().required('Start Time is required'),
});

export default function AddEditMachineTasksModal({
  lineData,
  type,
  onApplyChanges,
  onClose,
  category,
}: AddEditModalProps<MachinesTaskMappingListDataProps>) {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      starting_date: '',
      starting_time: '',
      duration: '',
      tasks: [
        {
          task_id: 0,
        },
      ],
      category: {value: category, label: selectPeriodicCategory(category)},
    },
    validationSchema,
    onSubmit: () => {},
  });

  return (
    <>
      <View>
        <DropdownBox
          title="Category"
          value={values.category}
          placeHolder="Select Category"
          onSelect={val => {
            setFieldValue('category', val);
          }}
          type="miniList"
          options={PeriodicCatgory}
          fieldName="label"
          isDisabled
          isRequired
          isDisabledInPopup
        />

        <TextInputBox
          value={values?.duration}
          onChangeText={(val: string) => {
            setFieldValue('duration', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          textInputProps={{
            maxLength: INPUT_SIZE.Machine_ID,
          }}
          isRequired
          placeHolder="Enter Machine ID"
          title="Machine ID"
          isEditable={type !== 'View'}
          errorText={
            errors?.duration && touched?.duration ? errors?.duration : ''
          }
        />

        <DateTimePicker
          mode="datetime"
          format="YYYY-MM-DD hh:mm A"
          title="Starting Date"
          placeHolder="Select Date"
          value={values.starting_date}
          onSelect={date => {
            setFieldValue('starting_date', date);
          }}
          errorText={
            errors?.starting_date && touched.starting_date
              ? errors?.starting_date
              : ''
          }
          minimumDate={new Date()}
        />
        <DateTimePicker
          mode="time"
          format="hh:mm A"
          title="Starting Time"
          placeHolder="Select Time"
          value={values.starting_time}
          onSelect={date => {
            setFieldValue('starting_time', date);
          }}
          errorText={
            errors?.starting_time && touched.starting_time
              ? errors?.starting_time
              : ''
          }
          minimumDate={new Date()}
        />
      </View>
    </>
  );
}
