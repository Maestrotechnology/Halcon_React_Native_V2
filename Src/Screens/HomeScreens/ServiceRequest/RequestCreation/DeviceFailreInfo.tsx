import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import HOCView from "../../../../Components/HOCView";
import StyledText from "../../../../Components/StyledText";
import { useServiceRequestDetails } from "../../../../Utilities/Contexts";
import DropdownBox from "../../../../Components/DropdownBox";
import { ServiceRequestCreationScreensNavigationProps } from "../../../../@types/navigation";
import DateTimePicker from "../../../../Components/DateTimePicker";
import {
  MACHINE_WORK_STATUS,
  SHIFT_OPTIONS,
  deviceStatusOptions,
  priorityLevelOptions,
  priorityLevelOptions1,
  requestStatusOptions,
} from "../../../../Utilities/StaticDropdownOptions";
import { COLORS, bigInputBoxStyle } from "../../../../Utilities/Constants";
import { FONTS } from "../../../../Utilities/Fonts";
import TextInputBox from "../../../../Components/TextInputBox";
import CustomButton from "../../../../Components/CustomButton";
import { useIsFocused } from "@react-navigation/native";
import { GetUserData } from "../../../../Utilities/StoreData";

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

  useEffect(() => {
    if (focused) {
      setactiveTab(1);
    }
  }, [focused]);

  const renderTitleText = (title: string) => {
    return (
      <View style={{ marginBottom: 7 }}>
        <StyledText
          style={{
            fontFamily: FONTS.poppins.semibold,
          }}
        >
          {title}
        </StyledText>
        <View
          style={{
            width: title.length * 5,
            height: 3,
            backgroundColor: COLORS.primary,
          }}
        ></View>
      </View>
    );
  };
  const renderValue = (value: string) => {
    return value ? value : isView || isServiceUpdate ? "-" : "";
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
          ? ""
          : `${
              isCreate ? "Create" : isUpdate ? "Edit" : "Update"
            } Service Request`,
      }}
      isEnableKeyboardAware
      secondaryHeaderTitle={
        isView
          ? ""
          : `${
              isCreate ? "Create" : isUpdate ? "Edit" : "Update"
            } Service Request`
      }
    >
      {renderTitleText("Device Failure Information")}
      <DropdownBox
        title="Machine"
        value={values.machine}
        isRequired
        placeHolder="Select machine"
        apiType="machineList"
        onSelect={(val) => {
          setFieldValue("machine", val);
        }}
        type="search"
        fieldName="machine_name"
        searchFieldName="machine_name"
        onIconPress={() => {
          setFieldValue("machine", null);
        }}
        isDisabled={isView || isServiceUpdate}
        isEnableRightIcon={!isView && !isServiceUpdate}
        errorText={errors.machine && touched.machine ? errors.machine : ""}
      />
      <DateTimePicker
        mode="datetime"
        title="Date of error occured"
        format="YYYY-MM-DD hh:mm A"
        value={renderValue(values.dateOfErrorOccured)}
        // isRequired
        onSelect={(date) => {
          setFieldValue("dateOfErrorOccured", date);
        }}
        errorText={
          errors.dateOfErrorOccured && touched.dateOfErrorOccured
            ? errors.dateOfErrorOccured
            : ""
        }
        isDisabled={isView || isServiceUpdate}
        maximumDate={new Date()}
      />
      <DateTimePicker
        title="Date of request"
        value={renderValue(values.dateOfReq)}
        onSelect={(date) => {
          setFieldValue("dateOfReq", date);
        }}
        isDisabled
      />
      {/* <DropdownBox
        title="Shift"
        // isRequired
        options={[...SHIFT_OPTIONS]}
        value={values.shift}
        placeHolder="Select shift"
        onSelect={val => {
          setFieldValue('shift', val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue('shift', null);
        }}
        errorText={errors.shift && touched.shift ? errors.shift : ''}
        isDisabled={isView || isServiceUpdate}
        isEnableRightIcon={!isView && !isServiceUpdate}
      /> */}
      <DropdownBox
        title="Request Status"
        isRequired
        options={[...requestStatusOptions]?.filter((ele) => {
          if (isUpdate && ele?.id === 3) {
            return undefined;
          } else if (isCreate && [2, 3]?.includes(ele?.id)) {
            return undefined;
          }
          return ele;
        })}
        value={values.reqStatus}
        placeHolder="Select machine status"
        onSelect={(val) => {
          setFieldValue("reqStatus", val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue("reqStatus", null);
        }}
        errorText={
          errors.reqStatus && touched.reqStatus ? errors.reqStatus : ""
        }
        isDisabled={isView || isServiceUpdate}
        isEnableRightIcon={!isView && !isServiceUpdate}
      />
      {isServiceUpdate && (
        <TextInputBox
          title="Pending Reason"
          value={values?.pending_reason}
          placeHolder="Pending Reason"
          onChangeText={(e) => {
            setFieldValue("pending_reason", e);
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
        onSelect={(date) => {
          setFieldValue("expectedCompletedDate", date);
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
          onSelect={(date) => {
            setFieldValue("serviceStartedDate", date);
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
        onSelect={(val) => {
          setFieldValue("deviceStatus", val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue("deviceStatus", null);
        }}
        errorText={
          errors.deviceStatus && touched.deviceStatus ? errors.deviceStatus : ""
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
          onSelect={(val) => {
            setFieldValue("employee", val);
          }}
          type="search"
          fieldName="name"
          searchFieldName="name"
          onIconPress={() => {
            setFieldValue("employee", null);
          }}
          isDisabled={isView || isServiceUpdate}
          isEnableRightIcon={!isView && !isServiceUpdate}
          errorText={errors.employee && touched.employee ? errors.employee : ""}
        />
      )}

      <DropdownBox
        title="Priority Level"
        // isRequired
        options={[...priorityLevelOptions1]}
        value={values.priorityLevel}
        placeHolder="Select priority"
        onSelect={(val) => {
          setFieldValue("priorityLevel", val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue("priorityLevel", null);
        }}
        errorText={
          errors.priorityLevel && touched.priorityLevel
            ? errors.priorityLevel
            : ""
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

      {renderTitleText("Problem Details")}
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
        onChangeText={handleChange("msgOnDisplay")}
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
        onChangeText={handleChange("comments")}
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
        style={{ marginVertical: 10, marginBottom: 25 }}
      >
        Next
      </CustomButton>
    </HOCView>
  );
};

export default DeviceFailreInfo;

const styles = StyleSheet.create({});
