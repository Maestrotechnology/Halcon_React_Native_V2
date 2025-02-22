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
import {
  MaterialListProps,
  ServiceRequestFormikDataProps,
} from '../../../../@types/context';
import moment from 'moment';
import * as Yup from 'yup';
import CheckBox from '../../../../Components/CheckBox';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {AlertBox} from '../../../../Utilities/GeneralUtilities';
import {AlertMessageBox} from '../../../../Utilities/Methods';
import MaterialList from './MaterialList';
import CustomImageBox from '../../../../Components/CustomImageBox';
import SVGIcon from '../../../../Components/SVGIcon';
const deviceFailureSchema = Yup.object().shape({
  machine: Yup.object().nullable().required('Machine is required'),
  // dateOfErrorOccured: Yup.string().required(
  //   'Date of error occured is required',
  // ),
  deviceStatus: Yup.object().nullable().required('Machine Status is required'),
  reqStatus: Yup.object().nullable().required('Request Status is required'),
  // priorityLevel: Yup.object().nullable().required('Priority level is required'),
});

const ProblemDetails = ({
  navigation,
}: ServiceRequestCreationScreensNavigationProps) => {
  const focused = useIsFocused();
  const userData = GetUserData();

  const {
    handleSubmit,
    isCreate,
    isUpdate,
    isView,
    setFieldValue,
    setactiveTab,
    activeTab,
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
      secondaryHeaderTitle={
        isView
          ? ''
          : `${
              isCreate ? 'Create' : isUpdate ? 'Edit' : 'Update'
            } Service Request`
      }>
      {renderTitleText('Problem Diagnosis')}
      <View style={styles.PriorityContainer}>
        <StyledText>Problem Status?</StyledText>
        <View style={styles.CheckBoxContainer}>
          <CheckBox
            checked={values?.problem_status === 1 ? true : false}
            label="Yes"
            containerStyle={{width: '50%'}}
            disabled={isView || isServiceUpdate}
            onChange={data => {
              setFieldValue('problem_status', data ? 1 : 2);
            }}
          />
          <CheckBox
            checked={values?.problem_status === 2 ? true : false}
            label="No"
            disabled={isView || isServiceUpdate}
            containerStyle={{width: '50%'}}
            onChange={data => {
              setFieldValue('problem_status', data ? 2 : 1);
            }}
          />
        </View>
      </View>

      <TextInputBox
        title="Problem Description"
        value={values?.problem_description}
        placeHolder="Problem Description"
        onChangeText={e => {
          setFieldValue('problem_description', e);
        }}
        textInputProps={{
          ...bigInputBoxStyle,
        }}
        customInputBoxContainerStyle={{
          height: 130,
          backgroundColor: COLORS.white,
          borderColor: !CheckisEditable() ? COLORS.white : COLORS.primary,
        }}
        isEditable={CheckisEditable()}
      />

      {renderTitleText('Material issue')}

      <MaterialList
        handleAddMeterialList={(materialItem: MaterialListProps) => {
          setFieldValue('material_list', [
            ...values?.material_list,
            materialItem,
          ]);
        }}
      />
      {values?.material_list?.length > 0 && (
        <View style={styles.MaterialListTable}>
          {values?.material_list?.map((item, index) => {
            return (
              <>
                {index === 0 && (
                  <View style={[styles.MeterialListBox]} key={'09'}>
                    <StyledText
                      style={{
                        color: COLORS.black,
                        fontFamily: FONTS.poppins.medium,
                        width: '10%',
                      }}>
                      SNo
                    </StyledText>
                    <StyledText
                      style={{
                        color: COLORS.black,
                        fontFamily: FONTS.poppins.medium,
                        width: '50%',
                      }}>
                      Material
                    </StyledText>
                    <StyledText
                      style={{
                        color: COLORS.black,
                        fontFamily: FONTS.poppins.medium,
                        width: '20%',
                      }}>
                      Qty
                    </StyledText>
                    <StyledText
                      style={{
                        color: COLORS.black,
                        fontFamily: FONTS.poppins.medium,
                        width: '10%',
                      }}>
                      -
                    </StyledText>
                  </View>
                )}
                <View style={[styles.MeterialListBox]} key={index}>
                  <StyledText style={{color: COLORS.black, width: '10%'}}>
                    {index + 1}
                  </StyledText>
                  <StyledText style={{color: COLORS.black, width: '50%'}}>
                    {item?.material_id?.material_name || ''}
                  </StyledText>
                  <StyledText style={{color: COLORS.black, width: '20%'}}>
                    {item?.quantity || ''}
                  </StyledText>
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      width: '10%',
                    }}>
                    <SVGIcon
                      icon="failureIcon"
                      width={20}
                      height={20}
                      isButton
                      onPress={() => {
                        setFieldValue(
                          'material_list',
                          values?.material_list?.filter(
                            (item, Itemindex) => Itemindex !== index,
                          ),
                        );
                      }}
                    />
                  </View>
                </View>
              </>
            );
          })}
        </View>
      )}
      <CustomButton
        onPress={() => {
          setactiveTab(4);
          // @ts-ignore
          navigation.navigate('FileUploading', {isFrom: 'ProblemDetails'});
        }}
        style={{marginVertical: 10, marginBottom: 25}}>
        Next
      </CustomButton>
    </HOCView>
  );
};

export default ProblemDetails;

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
  MeterialListFlex: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  MeterialListBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  MaterialListTable: {
    flexDirection: 'column',
    gap: 5,
  },
});
