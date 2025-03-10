import * as Yup from 'yup';
import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import CustomButton from '../../Components/CustomButton';
import TextInputBox from '../../Components/TextInputBox';
import {COLORS, INPUT_SIZE} from '../../Utilities/Constants';
import {ConvertJSONtoFormData, isLoading} from '../../Utilities/Methods';
import {CreateTasksService, UpdateTasksService} from '../../Services/Services';
import {getCatchMessage} from '../../Utilities/GeneralUtilities';
import Toast from '../../Components/Toast';
import {UseToken} from '../../Utilities/StoreData';
import {TaskListDataProps} from '../../@types/api';
import {AddEditModalProps} from '../../@types/Global';
import ActionButtons from '../../Components/ActionButtons';

const validationSchema = Yup.object().shape({
  task_name: Yup.string().trim().required('* Task Name is required.'),
});
const AddEditTaskModal = ({
  onApplyChanges,
  onClose,
  type,
  lineData,
}: AddEditModalProps<TaskListDataProps>) => {
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
  } = useFormik<TaskListDataProps>({
    initialValues: {
      task_id: lineData?.task_id || 0,
      task_name: '',
      control_key: '',
    },
    validationSchema,
    onSubmit(values) {
      if (type === 'Create') {
        handleAddTask(values);
      } else if (type === 'Update') {
        handleUpdateTask(values);
      }
    },
  });

  const handleAddTask = (values: any) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
    };

    CreateTasksService(ConvertJSONtoFormData(finalObj))
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
  const handleUpdateTask = (values: any) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
      task_id: lineData?.task_id,
    };

    UpdateTasksService(ConvertJSONtoFormData(finalObj))
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
      <TextInputBox
        value={values?.task_name}
        onChangeText={(val: string) => {
          setFieldValue('task_name', val);
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.Name,
        }}
        isRequired
        placeHolder="Enter Task Name"
        title="Task Name"
        isEditable={type !== 'View'}
        errorText={
          errors?.task_name && touched?.task_name ? errors?.task_name : ''
        }
      />
      <TextInputBox
        value={values?.control_key}
        onChangeText={(val: string) => {
          setFieldValue('control_key', val);
        }}
        textInputProps={{
          maxLength: INPUT_SIZE.ControlKey,
        }}
        validationType="NUMBER"
        keyboardType="number-pad"
        placeHolder="Enter Control Key"
        title="Control Key"
        isEditable={type !== 'View'}
      />
      <ActionButtons
        onPressNegativeBtn={() => {
          resetForm({
            values: {
              ...initialValues,
            },
          });
          onClose();
        }}
        onPressPositiveBtn={handleSubmit}
        PositiveBtnTitle={type || 'SUbmit'}
        NegativeBtnTitle="Close"
      />
    </View>
  );
};

export default AddEditTaskModal;

const styles = StyleSheet.create({});
