import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {
  UserScreenScreensNavigationProps,
  UserStackStackParamList,
} from '../../../@types/navigation';
import {GetUserData, UseToken} from '../../../Utilities/StoreData';
import StyledText from '../../../Components/StyledText';
import {FONTS} from '../../../Utilities/Fonts';
import {
  COLORS,
  EMAIL_REGEX,
  PHONE_NUMBER_REGEX,
  REGEX,
} from '../../../Utilities/Constants';
import HOCView from '../../../Components/HOCView';
import DropdownBox from '../../../Components/DropdownBox';
import {StyleSheet, View} from 'react-native';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import CustomButton from '../../../Components/CustomButton';
import TextInputBox from '../../../Components/TextInputBox';
import {useEffect} from 'react';
import {CreateUserService, UpdateUserService} from '../../../Services/Services';
import {FilterValidObj, isLoading} from '../../../Utilities/Methods';
import Toast from '../../../Components/Toast';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
const UserValidation = Yup.object().shape({
  isupdate: Yup.boolean(),
  name: Yup.string().trim().required('* Name is required.'),
  username: Yup.string().trim().required('* User Name is required.'),
  password: Yup.string()
    .when('isupdate', {
      is: false,
      then: () =>
        Yup.string()
          .min(5, 'Password should contain at least 5 characters.')
          .matches(
            REGEX.PASSWORD,
            'Password must contain at least one lower and upper case character and a digit.',
          )
          .required('* Password is required'),
    })
    .nullable(),
  email_id: Yup.string()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .trim('Remove leading and trailing spaces')
    .strict(true)
    .required('* Email is required'),
  mobile_no: Yup.string()
    .matches(PHONE_NUMBER_REGEX, 'Enter valid mobile number')
    .trim('Remove leading and trailing spaces')
    .strict(true)
    .required('* Mobile number is required')
    .min(10, 'Mobile number must have 10 digits')
    .max(10, 'Mobile number must have 10 digits'),
  role_id: Yup.mixed().required('* Role is required'),
});

const AddEditUser = ({navigation}: UserScreenScreensNavigationProps) => {
  const focused = useIsFocused();
  const userData = GetUserData();
  const token = UseToken();
  const route =
    useRoute<
      RouteProp<UserStackStackParamList, keyof UserStackStackParamList>
    >();
  // @ts-ignore
  const {type} = route?.params;

  const {values, errors, touched, setFieldValue, handleSubmit, setValues} =
    useFormik({
      initialValues: {
        isupdate: false,
        name: '',
        username: '',
        mobile_no: '',
        email_id: '',
        password: '',
        role_id: null,
        state: '',
        address: '',
        city: '',
        country: '',
      },

      validationSchema: UserValidation,
      onSubmit: values => {
        if (type === 'Create') {
          handleaddUser(values);
        } else if (type === 'Update') {
          handleUpdateUser(values);
        }
      },
    });

  const handleaddUser = (values: any) => {
    isLoading(true);
    let finalObj = FilterValidObj({
      ...values,
      token: token,
      role_id: values?.role_id?.role_id || 0,
      isupdate: null,
    });

    CreateUserService(finalObj)
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
  const handleUpdateUser = (values: any) => {
    isLoading(true);
    let finalObj = FilterValidObj({
      ...values,
      token: token,
      role_id: values?.role_id?.role_id || 0,
      isupdate: null,
      user_id: route?.params?.lineData?.user_id,
    });

    UpdateUserService(finalObj)
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

  const handleUpdateUserDatas = () => {
    const updateData = route?.params?.lineData;

    setValues({
      isupdate: true,
      name: updateData?.name || '',
      username: updateData?.username || '',
      mobile_no: updateData?.mobile_no || '',
      email_id: updateData?.email || '',
      role_id: {
        role_id: updateData?.role_id || 0,
        role_name: updateData?.role_name || '',
      },
      state: updateData?.state || '',
      address: updateData?.address || '',
      city: updateData?.city || '',
      country: updateData?.country || '',
    });
  };
  useEffect(() => {
    if (focused && type !== 'Create' && route?.params?.lineData) {
      handleUpdateUserDatas();
    }
  }, [focused]);
  const isEditable = type === 'View' ? false : true;

  return (
    <HOCView
      headerProps={{
        isEnableMenu: false,
        isRightIconEnable: false,
        onBackPress() {
          navigation.goBack();
        },
        headerTitle: `${type} User`,
      }}
      isEnableKeyboardAware
      secondaryHeaderTitle={`${type} User`}>
      <View style={{paddingBottom: 10}}>
        <TextInputBox
          value={values?.username}
          onChangeText={(val: string) => {
            setFieldValue('username', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          placeHolder="Enter User Name"
          title="User Name"
          isEditable={isEditable}
          disableNonEditableBg={true}
          isRequired
          errorText={errors.username && touched.username ? errors.username : ''}
        />
        <TextInputBox
          value={values?.name}
          onChangeText={(val: string) => {
            setFieldValue('name', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          placeHolder="Enter Name"
          title="Name"
          isEditable={isEditable}
          disableNonEditableBg={true}
          isRequired
          errorText={errors.name && touched.name ? errors.name : ''}
        />

        <TextInputBox
          value={values?.email_id}
          onChangeText={(val: string) => {
            setFieldValue('email_id', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          placeHolder="Enter Email"
          title="Email"
          isEditable={isEditable}
          disableNonEditableBg={true}
          isRequired
          errorText={errors.email_id && touched.email_id ? errors.email_id : ''}
        />
        <DropdownBox
          title="Role"
          value={values.role_id}
          placeHolder="Select Role"
          apiType="roleList"
          onSelect={val => {
            setFieldValue('role_id', val);
          }}
          isDisabled={!isEditable}
          isRequired
          errorText={errors.role_id && touched.role_id ? errors.role_id : ''}
          type="search"
          fieldName="role_name"
          isLocalSearch
          searchFieldName="role_name"
          onIconPress={() => {
            setFieldValue('role_id', null);
          }}
        />
        <TextInputBox
          value={values?.mobile_no}
          onChangeText={(val: string) => {
            setFieldValue('mobile_no', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          keyboardType="number-pad"
          placeHolder="Enter Mobile No"
          title="Mobile No"
          isEditable={isEditable}
          disableNonEditableBg={true}
          textInputProps={{
            maxLength: 10,
          }}
          errorText={
            errors.mobile_no && touched.mobile_no ? errors.mobile_no : ''
          }
        />
        {type === 'Create' && (
          <TextInputBox
            showIcon
            title="Password"
            placeHolder="Password"
            isSecure={true}
            customInputBoxContainerStyle={{
              borderColor: COLORS.primary,
            }}
            isRequired
            onChangeText={text => {
              setFieldValue('password', text);
            }}
            value={values.password}
            errorText={
              errors.password && touched.password ? errors?.password : ''
            }
          />
        )}
        <TextInputBox
          value={values?.state}
          onChangeText={(val: string) => {
            setFieldValue('state', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          placeHolder="Enter State"
          title="State"
          isEditable={isEditable}
          disableNonEditableBg={true}
          errorText={errors.state && touched.state ? errors.state : ''}
        />
        <TextInputBox
          value={values?.city}
          onChangeText={(val: string) => {
            setFieldValue('city', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          placeHolder="Enter City"
          title="City"
          isEditable={isEditable}
          disableNonEditableBg={true}
          errorText={errors.city && touched.city ? errors.city : ''}
        />
        <TextInputBox
          value={values?.country}
          onChangeText={(val: string) => {
            setFieldValue('country', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          placeHolder="Enter Country"
          title="Country"
          isEditable={isEditable}
          disableNonEditableBg={true}
          errorText={errors.country && touched.country ? errors.country : ''}
        />

        <TextInputBox
          value={values?.address}
          onChangeText={(val: string) => {
            setFieldValue('address', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          placeHolder="Enter Address"
          title="Address"
          isEditable={isEditable}
          disableNonEditableBg={true}
          multiline
          numberOfLines={3}
          errorText={errors.address && touched.address ? errors.address : ''}
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

export default AddEditUser;

const styles = StyleSheet.create({});
