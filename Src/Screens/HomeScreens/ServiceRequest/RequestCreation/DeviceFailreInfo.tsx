import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import HOCView from '../../../../Components/HOCView';
import StyledText from '../../../../Components/StyledText';
import {useServiceRequestDetails} from '../../../../Utilities/Contexts';
import DropdownBox from '../../../../Components/DropdownBox';
import {ServiceRequestCreationScreensNavigationProps} from '../../../../@types/navigation';
import DateTimePicker from '../../../../Components/DateTimePicker';
import {
  deviceStatusOptions,
  priorityLevelOptions1,
  requestStatusOptions,
  RequiringProblemsList,
} from '../../../../Utilities/StaticDropdownOptions';
import {COLORS, bigInputBoxStyle} from '../../../../Utilities/Constants';
import {FONTS} from '../../../../Utilities/Fonts';
import TextInputBox from '../../../../Components/TextInputBox';
import CustomButton from '../../../../Components/CustomButton';
import {useIsFocused} from '@react-navigation/native';
import {GetUserData} from '../../../../Utilities/StoreData';
import {useFormik} from 'formik';
import {ServiceRequestFormikDataProps} from '../../../../@types/context';
import moment from 'moment';
import * as Yup from 'yup';
import CheckBox from '../../../../Components/CheckBox';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {AlertBox} from '../../../../Utilities/GeneralUtilities';
import {AlertMessageBox} from '../../../../Utilities/Methods';
import MarqueeCustom from '../../../../Components/MarqueeTag';
const deviceFailureSchema = Yup.object().shape({
  machine: Yup.object().nullable().required('Machine is required'),
  // dateOfErrorOccured: Yup.string().required(
  //   'Date of error occured is required',
  // ),
  deviceStatus: Yup.object().nullable().required('Machine Status is required'),
  reqStatus: Yup.object().nullable().required('Request Status is required'),
  // priorityLevel: Yup.object().nullable().required('Priority level is required'),
});

const DeviceFailreInfo = ({
  navigation,
}: ServiceRequestCreationScreensNavigationProps) => {
  const focused = useIsFocused();
  const userData = GetUserData();

  const {
    errors,
    handleChange,
    handleSubmit,
    isCreate,
    isSubmitting,
    isUpdate,
    isView,
    setFieldValue,
    setSubmitting,
    setValues,
    setactiveTab,
    touched,
    values,
    isServiceUpdate,
  } = useServiceRequestDetails();
  const formik = useFormik<ServiceRequestFormikDataProps>({
    initialValues: {
      machine: null,
      employee: null,
      dateOfErrorOccured: '',
      dateOfReq: moment().format('DD-MM-YYYY'),
      scheduleDate: '',
      serviceStartedDate: '',
      deviceStatus: null,
      priorityLevel: 2,
      reqStatus: isCreate
        ? {
            id: 1,
            name: 'Created',
          }
        : null,
      expectedCompletedDate: '',
      shift: null,
      msgOnDisplay: '',
      comments: '',
      deviceFailureFileName: '',
      serviceCompletedDate: '',
      operatorName: '',
      operatorId: '',
      machineStatusWhileAlarm: null,
      service_team_commments: '',
      report_no: '',
      problem_description: '',
      pending_reason: '',
      problem_status: null,
      material_list: [],
      efmea_status: null,
      efmea_date: null,
      machine_limitations: '',
    },
    validationSchema: deviceFailureSchema,
    onSubmit() {
      navigation.navigate('FileUploading', {
        isFrom: 'deviceFailure',
      });
    },
  });

  useEffect(() => {
    if (focused) {
      setactiveTab(1);
    }
  }, [focused]);
  useEffect(() => {
    formik.setValues({...values});
  }, [values]);

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
    return value ? value : isView || isServiceUpdate ? '-' : '';
  };

  const CheckisEditable = () => {
    return isView ||
      (values?.reqStatus && values?.reqStatus?.id > 1 && isServiceUpdate)
      ? true
      : false;
  };

  return (
    <HOCView
      headerProps={{
        isEnableMenu: false,
        isRightIconEnable: false,
        onBackPress() {
          navigation.goBack();
        },
        headerTitle: isView
          ? ''
          : `${
              isCreate ? 'Create' : isUpdate ? 'Edit' : 'Update'
            } Service Request`,
      }}
      isEnableKeyboardAware
      // secondaryHeaderTitle={
      //   isView
      //     ? ''
      //     : `${
      //         isCreate ? 'Create' : isUpdate ? 'Edit' : 'Update'
      //       } Service Request`
      // }
    >
      {/* <MarqueeCustom /> */}
      {!CheckisEditable() && !isUpdate && isServiceUpdate ? (
        AlertMessageBox()
      ) : (
        <View />
      )}
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
        isDisabled={isView || isServiceUpdate || isUpdate}
        isEnableRightIcon={!isView && !isServiceUpdate}
        errorText={errors.machine && touched.machine ? errors.machine : ''}
      />
      <DateTimePicker
        mode="datetime"
        title="Date of error occured"
        format="YYYY-MM-DD hh:mm:ss"
        value={renderValue(values.dateOfErrorOccured)}
        // isRequired
        onSelect={date => {
          setFieldValue('dateOfErrorOccured', date);
        }}
        errorText={
          errors.dateOfErrorOccured && touched.dateOfErrorOccured
            ? errors.dateOfErrorOccured
            : ''
        }
        isDisabled={isView || isServiceUpdate}
        maximumDate={new Date()}
      />
      <DateTimePicker
        title="Date of request"
        value={renderValue(values.dateOfReq)}
        onSelect={date => {
          setFieldValue('dateOfReq', date);
        }}
        isDisabled
      />

      {!isCreate && (
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
          isDisabled={isView}
          isEnableRightIcon={!isView && !isServiceUpdate}
        />
      )}
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
          multiline
          customInputBoxContainerStyle={{
            height: 110,
            backgroundColor: COLORS.white,
            borderColor: !CheckisEditable() ? COLORS.white : COLORS.primary,
          }}
          isEditable={CheckisEditable()}
        />
      )}
      {/* <DateTimePicker
        isDisabled={isView || isServiceUpdate}
        mode="datetime"
        format="YYYY-MM-DD hh:mm A"
        title="Schedule Date"
        value={renderValue(values.scheduleDate)}
        onSelect={(date) => {
          setFieldValue("scheduleDate", date);
        }}
        minimumDate={new Date()}
      /> */}
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

      {/* {userData?.user_type === 1 && ( */}
      <DropdownBox
        title="Assigned To"
        value={values.employee}
        placeHolder="Assigned to"
        apiType="assignedUsersList"
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
      {/* )} */}
      <View style={styles.PriorityContainer}>
        <StyledText>Priority Level</StyledText>
        <View style={styles.CheckBoxContainer}>
          <CheckBox
            checked={values?.priorityLevel === 1 ? true : false}
            label="Critical"
            containerStyle={{width: '50%'}}
            disabled={isView || isServiceUpdate}
            onChange={data => {
              setFieldValue('priorityLevel', data ? 1 : 2);
            }}
          />
          <CheckBox
            checked={values?.priorityLevel === 2 ? true : false}
            label="Non Critical"
            disabled={isView || isServiceUpdate}
            containerStyle={{width: '50%'}}
            onChange={data => {
              setFieldValue('priorityLevel', data ? 2 : 1);
            }}
          />
        </View>
      </View>

      {/* <DropdownBox
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
      /> */}

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
        multiline={true}
        customInputBoxContainerStyle={{
          height: 110,
          backgroundColor: COLORS.white,
          borderColor:
            isView || isServiceUpdate ? COLORS.white : COLORS.primary,
        }}
        isEditable={isCreate || isUpdate}
      />
      {isServiceUpdate || isView ? (
        <>
          <DropdownBox
            title="Is this recurring problem?"
            // isRequired
            options={[...RequiringProblemsList]}
            value={values.recurring_problem}
            placeHolder="Select Recurring problem"
            onSelect={val => {
              setFieldValue('recurring_problem', val);
            }}
            type="miniList"
            fieldName="name"
            onIconPress={() => {
              setFieldValue('recurring_problem', null);
            }}
            errorText={
              errors.recurring_problem && touched.recurring_problem
                ? errors.recurring_problem
                : ''
            }
            isDisabled={!CheckisEditable()}
            isEnableRightIcon={CheckisEditable()}
          />
          <TextInputBox
            title="Relevent Details"
            value={values.relevant_details}
            placeHolder="Relevent Details"
            onChangeText={handleChange('relevant_details')}
            textInputProps={{
              ...bigInputBoxStyle,
            }}
            multiline={true}
            isEditable={CheckisEditable()}
            numberOfLines={7}
            customInputBoxContainerStyle={{
              height: 110,
              backgroundColor: COLORS.white,
              borderColor: !CheckisEditable() ? COLORS.white : COLORS.primary,
            }}
          />
        </>
      ) : (
        <View />
      )}

      <CustomButton
        onPress={() => {
          formik.handleSubmit();
          handleSubmit();
        }}
        style={{marginVertical: 10, marginBottom: 25}}>
        Next
      </CustomButton>
    </HOCView>
  );
};

export default DeviceFailreInfo;

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
});
