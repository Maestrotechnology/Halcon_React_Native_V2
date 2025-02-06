import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {
  UserScreenScreensNavigationProps,
  UserStackStackParamList,
} from '../../../@types/navigation';
import {GetUserData} from '../../../Utilities/StoreData';
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
  role_id: Yup.string().trim().required('* Role is required'),
});

const AddEditUser = ({navigation}: UserScreenScreensNavigationProps) => {
  const focused = useIsFocused();
  const userData = GetUserData();
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
        role_id: '',
        state: '',
        address: '',
        city: '',
        country: '',
      },

      validationSchema: UserValidation,
      onSubmit: values => {
        if (type === 'Add') {
          handleaddUser(values);
        } else if (type === 'Update') {
          handleUpdateUser(values);
        }
      },
    });

  // const getfinalObject = (values: any) => {
  //   if (usertype === 2) {
  //     return {
  //       ...values,
  //       isupdate: '',
  //     };
  //   } else if (usertype === 3) {
  //     return {
  //       ...values,
  //       isupdate: '',
  //     };
  //   } else if (usertype === 4) {
  //     return {
  //       ...values,
  //       isupdate: '',
  //     };
  //   } else if (usertype === 5) {
  //     return {
  //       ...values,
  //       isupdate: '',
  //     };
  //   }
  // };
  // add new user
  const handleaddUser = (values: any) => {
    // dispatch(handlemodalLoading(true));
    // let finalObj = {
    //   ...getfinalObject(values),
    //   token: LoginaccessData?.token,
    //   user_type: usertype,
    // };
    // CreateUserservice(filterValidObject(finalObj))
    //   .then(async res => {
    //     if (res.data.status === 1) {
    //       toast.success(res?.data?.msg);
    //       handleUserdata();
    //       close();
    //     } else if (res.data.status === -1) {
    //       const istokenValid = await tokenisValid(LoginaccessData?.token);
    //       if (istokenValid) {
    //         toast.error(res.data.msg);
    //       } else {
    //         dispatch(handlesessionmodal(true));
    //       }
    //     } else {
    //       toast.error(res.data.msg);
    //     }
    //   })
    //   .catch(err => getCatchMsg(err))
    //   .finally(() => dispatch(handlemodalLoading(false)));
  };

  // update user
  const handleUpdateUser = (values: any) => {
    //   dispatch(handlemodalLoading(true));
    //   let finalObj = {
    //     ...getfinalObject(values),
    //     token: LoginaccessData?.token,
    //     user_id: datas?.user_id,
    //     user_type: usertype,
    //   };
    //   UpdateUserservice(filterValidObject(finalObj))
    //     .then(async res => {
    //       if (res.data.status === 1) {
    //         toast.success(res?.data?.msg);
    //         handleUserdata();
    //         close();
    //       } else if (res.data.status === -1) {
    //         const istokenValid = await tokenisValid(LoginaccessData?.token);
    //         if (istokenValid) {
    //           toast.error(res.data.msg);
    //         } else {
    //           dispatch(handlesessionmodal(true));
    //         }
    //       } else {
    //         toast.error(res.data.msg);
    //       }
    //     })
    //     .catch(err => getCatchMsg(err))
    //     .finally(() => dispatch(handlemodalLoading(false)));
  };
  const renderTitleText = (title: string) => {
    return (
      <View style={{marginBottom: 7}}>
        <StyledText
          style={{
            fontFamily: FONTS.poppins.semibold,
          }}>
          {title}
        </StyledText>
        <View
          style={{
            width: title.length * 5,
            height: 3,
            backgroundColor: COLORS.primary,
          }}></View>
      </View>
    );
  };
  const renderValue = (value: string) => {
    return value ? value : type === 'View' ? '-' : '';
  };

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
        isEditable
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
        isEditable
        isRequired
        errorText={errors.name && touched.name ? errors.name : ''}
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
        isEditable
        textInputProps={{
          maxLength: 10,
        }}
        errorText={
          errors.mobile_no && touched.mobile_no ? errors.mobile_no : ''
        }
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
        isEditable
        isRequired
        errorText={errors.email_id && touched.email_id ? errors.email_id : ''}
      />
      <TextInputBox
        showIcon
        title="Password"
        placeHolder="Password"
        isSecure={true}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        onChangeText={text => {
          setFieldValue('password', text);
        }}
        value={values.password}
        errorText={errors.password && touched.password ? errors?.password : ''}
      />
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
        isEditable
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
        isEditable
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
        isEditable
        errorText={errors.country && touched.country ? errors.country : ''}
      />
      <DropdownBox
        title="Role"
        value={values.role_id}
        placeHolder="Select Role"
        apiType="roleList"
        onSelect={val => {
          setFieldValue('role_id', val);
        }}
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
        value={values?.address}
        onChangeText={(val: string) => {
          setFieldValue('address', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        placeHolder="Enter Address"
        title="Address"
        isEditable
        multiline
        numberOfLines={3}
        errorText={errors.address && touched.address ? errors.address : ''}
      />
      <CustomButton onPress={handleSubmit} style={{marginVertical: 40}}>
        Submit
      </CustomButton>
    </HOCView>
  );
};

export default AddEditUser;

const styles = StyleSheet.create({});
