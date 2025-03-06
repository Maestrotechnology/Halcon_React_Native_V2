import * as Yup from 'yup';
import {COLORS, INPUT_SIZE} from '../../../../Utilities/Constants';
import {
  MastersStackNavigationProps,
  MasterStackStackParamList,
} from '../../../../@types/navigation';
import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {UseToken} from '../../../../Utilities/StoreData';
import {useFormik} from 'formik';
import {FilterValidObj, isLoading} from '../../../../Utilities/Methods';
import {
  CreateMaterialService,
  UpdateMaterialService,
} from '../../../../Services/Services';
import {getCatchMessage} from '../../../../Utilities/GeneralUtilities';
import Toast from '../../../../Components/Toast';
import {useEffect} from 'react';
import HOCView from '../../../../Components/HOCView';
import {StyleSheet, View} from 'react-native';
import TextInputBox from '../../../../Components/TextInputBox';
import CustomButton from '../../../../Components/CustomButton';
import {MaterialListDataProps} from '../../../../@types/api';
const UserValidation = Yup.object().shape({
  name: Yup.string().trim().required('* Material Name is required.'),
  unit_id: Yup.string().trim().required('* Unit Id is required.'),
});

const AddEditMaterial = ({navigation}: MastersStackNavigationProps) => {
  const focused = useIsFocused();
  const token = UseToken();
  const route =
    useRoute<RouteProp<MasterStackStackParamList, 'AddEditMaterial'>>();
  const {type} = route?.params;
  const isEditable = type === 'View' ? false : true;

  const {values, errors, touched, setFieldValue, handleSubmit, setValues} =
    useFormik<MaterialListDataProps>({
      initialValues: {
        name: '',
        description: '',
        unit_id: '',
        material_code: '',
        notes: '',
      },
      validationSchema: UserValidation,
      onSubmit: values => {
        if (type === 'Create') {
          handleaddMaterial(values);
        } else if (type === 'Update') {
          handleUpdateMeterial(values);
        }
      },
    });

  const handleaddMaterial = (values: any) => {
    isLoading(true);
    let finalObj = FilterValidObj({
      ...values,
      token: token,
    });

    CreateMaterialService(finalObj)
      .then(async res => {
        if (res.data.status === 1) {
          Toast.success(res?.data?.msg);
          navigation.goBack();
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
  const handleUpdateMeterial = (values: any) => {
    isLoading(true);
    let finalObj = FilterValidObj({
      ...values,
      token: token,
      material_id: route?.params?.lineData?.material_id,
    });

    UpdateMaterialService(finalObj)
      .then(async res => {
        if (res.data.status === 1) {
          Toast.success(res?.data?.msg);
          navigation.goBack();
        } else {
          Toast.error(res.data.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => isLoading(false));
  };

  const handleUpdateMeterialDatas = () => {
    const updateData = route?.params?.lineData;

    setValues({
      name: updateData?.name || '',
      description: updateData?.description || '',
      material_code: updateData?.material_code || '',
      unit_id: updateData?.unit_id || '',
      notes: updateData?.notes || '',
    });
  };
  useEffect(() => {
    if (focused && type !== 'Create' && route?.params?.lineData) {
      handleUpdateMeterialDatas();
    }
  }, [focused]);

  return (
    <HOCView
      headerProps={{
        isEnableMenu: false,
        isRightIconEnable: false,
        onBackPress() {
          navigation.goBack();
        },
        headerTitle: `${type} Material`,
      }}
      isEnableKeyboardAware
      secondaryHeaderTitle={`${type} Material`}>
      <View style={{paddingBottom: 10}}>
        <TextInputBox
          value={values?.name}
          onChangeText={(val: string) => {
            setFieldValue('name', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          textInputProps={{maxLength: INPUT_SIZE.Name}}
          placeHolder="Enter Material Name"
          title="Material Name"
          isEditable={isEditable}
          disableNonEditableBg={true}
          isRequired
          errorText={errors.name && touched.name ? errors.name : ''}
        />
        <TextInputBox
          value={values?.unit_id}
          onChangeText={(val: string) => {
            setFieldValue('unit_id', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          placeHolder="Enter Unit"
          title="Unit"
          isEditable={isEditable}
          disableNonEditableBg={true}
          textInputProps={{maxLength: INPUT_SIZE.UnitName}}
          isRequired
          errorText={errors.unit_id && touched.unit_id ? errors.unit_id : ''}
        />

        <TextInputBox
          value={values?.description}
          onChangeText={(val: string) => {
            setFieldValue('description', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          placeHolder="Enter Description"
          title="Description"
          isEditable={isEditable}
          textInputProps={{maxLength: INPUT_SIZE.Description}}
          disableNonEditableBg={true}
          errorText={
            errors.description && touched.description ? errors.description : ''
          }
        />

        <TextInputBox
          value={values?.material_code}
          onChangeText={(val: string) => {
            setFieldValue('material_code', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          keyboardType="number-pad"
          placeHolder="Enter Material Code"
          title="Material Code"
          isEditable={isEditable}
          disableNonEditableBg={true}
          textInputProps={{maxLength: INPUT_SIZE.Code}}
          errorText={
            errors.material_code && touched.material_code
              ? errors.material_code
              : ''
          }
        />

        <TextInputBox
          value={values?.notes}
          onChangeText={(val: string) => {
            setFieldValue('notes', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          textInputProps={{maxLength: INPUT_SIZE.Description}}
          placeHolder="Enter Notes"
          title="Notes"
          isEditable={isEditable}
          disableNonEditableBg={true}
          errorText={errors.notes && touched.notes ? errors.notes : ''}
        />

        {type !== 'View' && (
          <CustomButton
            onPress={handleSubmit}
            style={{marginVertical: 10, marginBottom: 20}}>
            Submit
          </CustomButton>
        )}
      </View>
    </HOCView>
  );
};

export default AddEditMaterial;

const styles = StyleSheet.create({});
