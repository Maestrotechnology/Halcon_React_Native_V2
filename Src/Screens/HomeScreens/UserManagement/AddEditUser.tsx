import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {
  UserScreenScreensNavigationProps,
  UserStackStackParamList,
} from '../../../@types/navigation';
import {GetUserData} from '../../../Utilities/StoreData';
import StyledText from '../../../Components/StyledText';
import {FONTS} from '../../../Utilities/Fonts';
import {COLORS, REGEX} from '../../../Utilities/Constants';
import HOCView from '../../../Components/HOCView';
import DropdownBox from '../../../Components/DropdownBox';
import {View} from 'react-native';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {getCatchMsg} from '../../../Utilities/GeneralUtilities';
const UserValidation = Yup.object().shape({
  isupdate: Yup.boolean(),
  name: Yup.string().trim().required('Name is required.'),
  username: Yup.string().trim().required('User Name is required.'),
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
          .required('Password is required'),
    })
    .nullable(),

  email_id: Yup.string()
    .matches(REGEX.EMAIL, 'Email is invalid.')
    .nullable()
    .required('Email is required.'),
  mobile_no: Yup.string()
    .matches(REGEX.MOBILE_REGEX, 'Contact number is invalid.')
    .nullable(),
  // division_id: Yup.string().trim().required("Division is required"),
  role_id: Yup.string().trim().required('Role is required'),
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
        // user_type: null,
        mobile_no: '',
        email_id: '',
        // division_id: null,
        password: '',

        role_id: '',
        state: '',
        address: '',
        city: '',
        country: '',
      },
      validationSchema: UserValidation,
      onSubmit: values => {
        if (type === 'add') {
          handleaddUser(values);
        } else if (type === 'update') {
          handleUpdateUser(values);
        }
      },
    });

  const getfinalObject = (values: any) => {
    if (usertype === 2) {
      return {
        ...values,
        isupdate: '',
      };
    } else if (usertype === 3) {
      return {
        ...values,
        isupdate: '',
      };
    } else if (usertype === 4) {
      return {
        ...values,
        isupdate: '',
      };
    } else if (usertype === 5) {
      return {
        ...values,
        isupdate: '',
      };
    }
  };
  // add new user
  const handleaddUser = (values: any) => {
    dispatch(handlemodalLoading(true));
    let finalObj = {
      ...getfinalObject(values),
      token: LoginaccessData?.token,
      user_type: usertype,
    };
    CreateUserservice(filterValidObject(finalObj))
      .then(async res => {
        if (res.data.status === 1) {
          toast.success(res?.data?.msg);
          handleUserdata();
          close();
        } else if (res.data.status === -1) {
          const istokenValid = await tokenisValid(LoginaccessData?.token);
          if (istokenValid) {
            toast.error(res.data.msg);
          } else {
            dispatch(handlesessionmodal(true));
          }
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch(err => getCatchMsg(err))
      .finally(() => dispatch(handlemodalLoading(false)));
  };

  // update user
  const handleUpdateUser = (values: any) => {
    dispatch(handlemodalLoading(true));
    let finalObj = {
      ...getfinalObject(values),
      token: LoginaccessData?.token,
      user_id: datas?.user_id,
      user_type: usertype,
    };
    UpdateUserservice(filterValidObject(finalObj))
      .then(async res => {
        if (res.data.status === 1) {
          toast.success(res?.data?.msg);
          handleUserdata();
          close();
        } else if (res.data.status === -1) {
          const istokenValid = await tokenisValid(LoginaccessData?.token);
          if (istokenValid) {
            toast.error(res.data.msg);
          } else {
            dispatch(handlesessionmodal(true));
          }
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch(err => getCatchMsg(err))
      .finally(() => dispatch(handlemodalLoading(false)));
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
      {renderTitleText('Device Failure Information')}
      <DropdownBox
        title="Machine"
        value={values.machine}
        isRequired
        placeHolder="Select machine"
        apiType="machineList"
        onSelect={val => {
          setFieldValue('machine', val);
        }}
        type="search"
        fieldName="machine_name"
        searchFieldName="machine_name"
        onIconPress={() => {
          setFieldValue('machine', null);
        }}
        isDisabled={isView || isServiceUpdate}
        isEnableRightIcon={!isView && !isServiceUpdate}
        errorText={errors.machine && touched.machine ? errors.machine : ''}
      />

      <DropdownBox
        title="Request Status"
        isRequired
        options={[...requestStatusOptions]?.filter(ele => {
          if (isUpdate && ele?.id === 3) {
            return undefined;
          } else if (isCreate && [2, 3]?.includes(ele?.id)) {
            return undefined;
          }
          return ele;
        })}
        value={values.reqStatus}
        placeHolder="Select machine status"
        onSelect={val => {
          setFieldValue('reqStatus', val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue('reqStatus', null);
        }}
        errorText={
          errors.reqStatus && touched.reqStatus ? errors.reqStatus : ''
        }
        isDisabled={isView || isServiceUpdate}
        isEnableRightIcon={!isView && !isServiceUpdate}
      />
      {isServiceUpdate && (
        <TextInputBox
          title="Pending Reason"
          value={values?.pending_reason}
          placeHolder="Pending Reason"
          onChangeText={e => {
            setFieldValue('pending_reason', e);
          }}
          textInputProps={{
            ...bigInputBoxStyle,
          }}
          customInputBoxContainerStyle={{
            height: 130,
            backgroundColor: COLORS.white,
            borderColor: isView ? COLORS.white : COLORS.primary,
          }}
          isEditable={isServiceUpdate}
        />
      )}

      <DateTimePicker
        isDisabled={isView || isServiceUpdate}
        mode="datetime"
        format="YYYY-MM-DD hh:mm A"
        title="Expected Completed Date"
        value={renderValue(values.expectedCompletedDate)}
        onSelect={date => {
          setFieldValue('expectedCompletedDate', date);
        }}
        minimumDate={new Date()}
      />
      {values.serviceStartedDate && (
        <DateTimePicker
          isDisabled={isView || isServiceUpdate}
          mode="datetime"
          format="YYYY-MM-DD hh:mm A"
          title="Service Started Date"
          value={renderValue(values.serviceStartedDate)}
          onSelect={date => {
            setFieldValue('serviceStartedDate', date);
          }}
          minimumDate={new Date()}
        />
      )}

      <DropdownBox
        title="Machine Status"
        isRequired
        options={[...deviceStatusOptions]}
        value={values.deviceStatus}
        placeHolder="Select machine status"
        onSelect={val => {
          setFieldValue('deviceStatus', val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue('deviceStatus', null);
        }}
        errorText={
          errors.deviceStatus && touched.deviceStatus ? errors.deviceStatus : ''
        }
        isDisabled={isView || isServiceUpdate}
        isEnableRightIcon={!isView && !isServiceUpdate}
      />

      {userData?.user_type === 1 && (
        <DropdownBox
          title="Assigned To"
          value={values.employee}
          placeHolder="Assigned to"
          apiType="user"
          onSelect={val => {
            setFieldValue('employee', val);
          }}
          type="search"
          fieldName="name"
          searchFieldName="name"
          onIconPress={() => {
            setFieldValue('employee', null);
          }}
          isDisabled={isView || isServiceUpdate}
          isEnableRightIcon={!isView && !isServiceUpdate}
          errorText={errors.employee && touched.employee ? errors.employee : ''}
        />
      )}

      <DropdownBox
        title="Priority Level"
        // isRequired
        options={[...priorityLevelOptions1]}
        value={values.priorityLevel}
        placeHolder="Select priority"
        onSelect={val => {
          setFieldValue('priorityLevel', val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue('priorityLevel', null);
        }}
        errorText={
          errors.priorityLevel && touched.priorityLevel
            ? errors.priorityLevel
            : ''
        }
        isDisabled={isView || isServiceUpdate}
        isEnableRightIcon={!isView && !isServiceUpdate}
      />

      {/* {renderTitleText('Operator Details')}
      <TextInputBox
        title="Operator Name"
        value={renderValue(values.operatorName)}
        placeHolder="Operator Name"
        onChangeText={handleChange('operatorName')}
        isEditable={isCreate}
        customInputBoxContainerStyle={{
          backgroundColor: COLORS.white,
          borderColor:
            isView || isServiceUpdate ? COLORS.white : COLORS.primary,
        }}
        disableNonEditableBg
      />
      <TextInputBox
        title="Operator ID"
        value={renderValue(values.operatorId)}
        placeHolder="Operator ID"
        onChangeText={handleChange('operatorId')}
        isEditable={isCreate}
        customInputBoxContainerStyle={{
          backgroundColor: COLORS.white,
          borderColor:
            isView || isServiceUpdate ? COLORS.white : COLORS.primary,
        }}
        disableNonEditableBg
      /> */}

      {renderTitleText('Problem Details')}
      {/* <DropdownBox
        title="What Was The Machine Doing At The Time Of The Alarm?"
        // isRequired
        options={[...MACHINE_WORK_STATUS]}
        value={values.machineStatusWhileAlarm}
        placeHolder="Select machine status at alarm"
        onSelect={val => {
          setFieldValue('machineStatusWhileAlarm', val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue('machineStatusWhileAlarm', null);
        }}
        errorText={
          errors.machineStatusWhileAlarm && touched.machineStatusWhileAlarm
            ? errors.machineStatusWhileAlarm
            : ''
        }
        isDisabled={isView || isServiceUpdate}
        isEnableRightIcon={!isView && !isServiceUpdate}
      /> */}
      <TextInputBox
        title="What Error Message On Alarm Was Displayed?"
        value={renderValue(values.msgOnDisplay)}
        placeHolder="Error message"
        onChangeText={handleChange('msgOnDisplay')}
        isEditable={isCreate || isUpdate}
        customInputBoxContainerStyle={{
          backgroundColor: COLORS.white,
          borderColor:
            isView || isServiceUpdate ? COLORS.white : COLORS.primary,
        }}
        disableNonEditableBg
      />
      <TextInputBox
        title="Requester Comments"
        value={renderValue(values.comments)}
        placeHolder="Requester Comments"
        onChangeText={handleChange('comments')}
        textInputProps={{
          ...bigInputBoxStyle,
        }}
        customInputBoxContainerStyle={{
          height: 130,
          backgroundColor: COLORS.white,
          borderColor:
            isView || isServiceUpdate ? COLORS.white : COLORS.primary,
        }}
        isEditable={isCreate || isUpdate}
      />
      <CustomButton
        onPress={handleSubmit}
        style={{marginVertical: 10, marginBottom: 25}}>
        Next
      </CustomButton>
    </HOCView>
  );
};

export default AddEditUser;

const styles = StyleSheet.create({});
