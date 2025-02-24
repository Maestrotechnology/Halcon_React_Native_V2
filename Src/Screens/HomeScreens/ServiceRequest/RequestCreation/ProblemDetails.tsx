import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import HOCView from '../../../../Components/HOCView';
import StyledText from '../../../../Components/StyledText';
import {useServiceRequestDetails} from '../../../../Utilities/Contexts';
import {ServiceRequestCreationScreensNavigationProps} from '../../../../@types/navigation';
import {COLORS, bigInputBoxStyle} from '../../../../Utilities/Constants';
import {FONTS} from '../../../../Utilities/Fonts';
import TextInputBox from '../../../../Components/TextInputBox';
import CustomButton from '../../../../Components/CustomButton';
import {useIsFocused} from '@react-navigation/native';
import {MaterialListProps} from '../../../../@types/context';
import CheckBox from '../../../../Components/CheckBox';
import {AlertMessageBox} from '../../../../Utilities/Methods';
import MaterialList from './MaterialList';
import SVGIcon from '../../../../Components/SVGIcon';

const ProblemDetails = ({
  navigation,
}: ServiceRequestCreationScreensNavigationProps) => {
  const focused = useIsFocused();

  const {
    isCreate,
    isUpdate,
    isView,
    setFieldValue,
    setactiveTab,
    values,
    isServiceUpdate,
  } = useServiceRequestDetails();
  const ServiceRequestContextValue = useServiceRequestDetails();

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

  const CheckisEditable = () => {
    return !isView ||
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
      isEnableKeyboardAware>
      {!CheckisEditable() && !isUpdate && isServiceUpdate ? (
        AlertMessageBox()
      ) : (
        <View />
      )}
      {renderTitleText('Problem Diagnosis')}
      <View style={styles.PriorityContainer}>
        <StyledText>Problem Status?</StyledText>
        <View style={styles.CheckBoxContainer}>
          <CheckBox
            checked={values?.problem_status === 1 ? true : false}
            label="Yes"
            containerStyle={{width: '50%'}}
            disabled={!CheckisEditable()}
            onChange={data => {
              setFieldValue('problem_status', data ? 1 : 2);
            }}
          />
          <CheckBox
            checked={values?.problem_status === 2 ? true : false}
            label="No"
            disabled={!CheckisEditable()}
            containerStyle={{width: '50%'}}
            onChange={data => {
              setFieldValue('problem_status', data ? 2 : 1);
            }}
          />
        </View>
      </View>

      {values?.problem_status === 1 && (
        <TextInputBox
          title="Why"
          value={values?.why}
          placeHolder="Why"
          onChangeText={e => {
            setFieldValue('why', e);
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
        multiline
        customInputBoxContainerStyle={{
          height: 110,
          backgroundColor: COLORS.white,
          borderColor: !CheckisEditable() ? COLORS.white : COLORS.primary,
        }}
        isEditable={CheckisEditable()}
      />

      {renderTitleText('Material issue')}

      {!isView && (
        <MaterialList
          isEditable={CheckisEditable()}
          handleAddMeterialList={(materialItem: MaterialListProps) => {
            setFieldValue('material_list', [
              ...values?.material_list,
              materialItem,
            ]);
          }}
          CheckisEditable={CheckisEditable()}
          contextValue={ServiceRequestContextValue}
        />
      )}
      {/* {values?.material_list?.length > 0 && (
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
                    {CheckisEditable() && (
                      <StyledText
                        style={{
                          color: COLORS.black,
                          fontFamily: FONTS.poppins.medium,
                          width: '10%',
                        }}>
                        -
                      </StyledText>
                    )}
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
                  {CheckisEditable() && (
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
                  )}
                </View>
              </>
            );
          })}
        </View>
      )} */}
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
