import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import HOCView from '../../../Components/HOCView';
import {
  COLORS,
  NAME_NUMBER_REGEX,
  NUMBER_REGEX,
} from '../../../Utilities/Constants';
import CustomButton from '../../../Components/CustomButton';
import TextInputBox from '../../../Components/TextInputBox';
import {useNavigation, useRoute} from '@react-navigation/native';
import ColorPickerModal from '../../../Modals/ColorPickerModal';
import {AddWorkOrderFormikDataProps} from './@types/WorkOrderTypes';
import {UseToken} from '../../../Utilities/StoreData';
import {
  createWorkOrderService,
  updateWorkOrderService,
} from '../../../Services/Services';
import Toast from '../../../Components/Toast';
import {
  CreateWorkOrderApiResposneProps,
  MaintenacneWorkOrderItemsProps,
} from '../../../@types/api';

var isMount = true;

type ColorPickerModalStateProps = {
  status: boolean;
  colorValue: string;
};

type ColorPickerProps = {
  colorValue: string;
  onPress: () => void;
  isError?: boolean;
};

const WorkOrderValidationSchema = Yup.object().shape({
  work_title: Yup.string()
    .matches(NAME_NUMBER_REGEX, 'Enter valid work order name')
    .required('Work order title is required'),
  work_no: Yup.string()
    .matches(NUMBER_REGEX, 'Enter valid work order code')
    .required('Work order code is required'),
});

const AddWorkOrder = () => {
  const token = UseToken();
  const navigation = useNavigation();
  const route = useRoute();
  //@ts-ignore
  const editData: MaintenacneWorkOrderItemsProps = route.params?.work;

  const [isLoading, setisLoading] = useState(false);
  const [isColorPickerModal, setisColorPickerModal] =
    useState<ColorPickerModalStateProps>({
      status: false,
      colorValue: '',
    });

  const {
    handleChange,
    setFieldValue,
    values,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    setSubmitting,
  } = useFormik<AddWorkOrderFormikDataProps>({
    initialValues: {
      work_title: editData?.work_title || '',
      work_no: editData?.work_order || '',
      description: editData?.description || '',
      color: editData?.color_code || COLORS.orange,
    },
    validationSchema: WorkOrderValidationSchema,
    onSubmit(values) {
      if (editData) {
        Keyboard.dismiss();
        handleUpdateWorkorder(values);
      } else {
        Keyboard.dismiss();
        handleAddWorkorder(values);
      }
    },
  });

  useEffect(() => {
    isMount = true;
    return () => {
      isMount = false;
    };
  }, []);

  const getCreateOrUpdateFormData = (data: AddWorkOrderFormikDataProps) => {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('work_title', data?.work_title);
    formData.append('work_no', data?.work_no);
    formData.append('description', data?.description);
    formData.append(editData ? 'colorCode' : 'color', data.color);
    formData.append('is_maintenance', 1);
    if (editData) {
      formData.append('work_order_id', editData?.work_order_id);
    }
    return formData;
  };

  const handleAddWorkorder = (data: AddWorkOrderFormikDataProps) => {
    if (isMount) {
      setisLoading(true);
    }
    createWorkOrderService(getCreateOrUpdateFormData(data))
      .then(res => {
        const response: CreateWorkOrderApiResposneProps = res.data;
        if (response.status === 1) {
          Toast.success(response.msg);
          navigation.reset({
            routes: [
              {
                //@ts-ignore
                name: 'MaintenacneWorkOrder',
              },
            ],
          });
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        setSubmitting(false);
        if (isMount) {
          setisLoading(false);
        }
      });
  };

  const handleUpdateWorkorder = (data: AddWorkOrderFormikDataProps) => {
    if (isMount) {
      setisLoading(true);
    }
    updateWorkOrderService(getCreateOrUpdateFormData(data))
      .then(res => {
        const response: CreateWorkOrderApiResposneProps = res.data;
        if (response.status === 1) {
          Toast.success(response.msg);
          navigation.reset({
            routes: [
              {
                //@ts-ignore
                name: 'MaintenacneWorkOrder',
              },
            ],
          });
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        setSubmitting(false);
        if (isMount) {
          setisLoading(false);
        }
      });
  };

  const ColorPicker = ({
    colorValue = '',
    onPress,
    isError = false,
  }: ColorPickerProps) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.colorPickerOuterContainer]}>
        <View
          style={[
            styles.colorPickerInnerContainer,
            {backgroundColor: colorValue},
          ]}></View>
      </TouchableOpacity>
    );
  };

  return (
    <HOCView
      isLoading={isLoading}
      headerProps={{
        onBackPress() {
          navigation.goBack();
        },
        isEnableMenu: false,
        headerTitle: `${editData ? 'Edit' : 'Add'} Work Order`,
        isRightIconEnable: false,
      }}
      isEnableKeyboardAware>
      <TextInputBox
        title="Work Order Title"
        value={values.work_title}
        isRequired
        placeHolder="Work order title"
        onChangeText={handleChange('work_title')}
        textInputProps={{maxLength: 50}}
        errorText={
          errors.work_title && touched.work_title ? errors?.work_title : ''
        }
      />

      <TextInputBox
        title="Work Order Code"
        value={values.work_no}
        isRequired
        placeHolder="Work order code"
        onChangeText={handleChange('work_no')}
        textInputProps={{maxLength: 50}}
        errorText={errors.work_no && touched.work_no ? errors?.work_no : ''}
        keyboardType="numeric"
      />

      <TextInputBox
        title="Reason"
        value={values.description}
        placeHolder="Reason"
        onChangeText={handleChange('description')}
        customInputBoxContainerStyle={{height: 110}}
        multiline
        textInputProps={{
          textAlignVertical: 'top',
          multiline: true,
          maxLength: 50,
        }}
      />

      <ColorPicker
        colorValue={values.color}
        onPress={() => {
          if (isMount) {
            setisColorPickerModal({
              status: true,
              colorValue: values.color,
            });
          }
        }}
      />

      <CustomButton
        style={{marginBottom: 20}}
        isDisabled={isSubmitting}
        onPress={handleSubmit}>
        {editData ? 'Update' : 'Submit'}
      </CustomButton>

      {isColorPickerModal.status && (
        <ColorPickerModal
          isVisible={isColorPickerModal.status}
          colorValue={isColorPickerModal.colorValue}
          onClose={() => {
            setisColorPickerModal(prev => {
              return {
                ...prev,
                status: false,
              };
            });
          }}
          onSelect={val => setFieldValue('color', val)}
        />
      )}
    </HOCView>
  );
};

export default AddWorkOrder;

const styles = StyleSheet.create({
  colorPickerOuterContainer: {
    width: 80,
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  colorPickerInnerContainer: {
    width: 70,
    height: 35,
    borderRadius: 5,
  },
});
