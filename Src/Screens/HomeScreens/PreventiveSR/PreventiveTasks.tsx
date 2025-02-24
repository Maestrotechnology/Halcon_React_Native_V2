import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import TableView, {TableItemProps} from '../../../Components/TableView';
import StyledText from '../../../Components/StyledText';
import DateTimePicker from '../../../Components/DateTimePicker';
import {CommonStyles} from '../../../Utilities/CommonStyles';
import CheckBox from '../../../Components/CheckBox';
import {usePreventiveRequestContext} from '../../../Utilities/Contexts';
import {COLORS} from '../../../Utilities/Constants';
import {FONTS} from '../../../Utilities/Fonts';
import HOCView from '../../../Components/HOCView';
import {LoaderStatus} from '../../../Utilities/StoreData';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../../Components/CustomButton';
import moment from 'moment';
import {isEmpty} from 'lodash';

const PreventiveTasks = () => {
  const {
    preventiveViewData,
    setPreventiveViewData,
    type,
    errors,
    setFieldValue,
    touched,
    values,
    selectedId,
    handleSubmit,
    isView,
    navigateStatus,
    route,
    setnavigateStatus,
  } = usePreventiveRequestContext();
  const loading = LoaderStatus();
  const navigation: any = useNavigation();
  const TaskRowData = [
    {key: 'task_name', label: 'Task Name'},
    // {key: 'created_at', label: 'Start Date'},
    // {key: 'updated_at', label: 'End Date'},
  ];

  const renderCardItem = ({item, index}: TableItemProps) => {
    const selected_task =
      values?.selected_tasks?.find(ele => ele?.task_id === item?.task_id) ||
      null;
    if ((isView && selected_task) || !isView) {
      return (
        <>
          <View
            key={JSON.stringify(item)}
            style={{
              ...styles.tableContainer,
              // backgroundColor: 'grey',
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
              }}
              activeOpacity={1}>
              {!isView && (
                <View style={[CommonStyles.flexRow]}>
                  {/* <StyledText style={styles.headerLabel}>
                    S.No &ensp;:&ensp;
                  </StyledText>
                  <StyledText>{index + 1}</StyledText> */}
                  <CheckBox
                    checked={selected_task ? true : false}
                    onChange={() => {
                      if (!isView) {
                        onSelectTask(item);
                      }
                    }}
                  />
                </View>
              )}
              {[...TaskRowData]?.map((cardItem, cardIndex) => {
                return (
                  <View
                    style={[
                      CommonStyles.flexRow,
                      {flex: 1, alignItems: 'flex-start', paddingVertical: 5},
                    ]}>
                    <StyledText style={styles.headerLabel}>
                      {cardItem?.label}&ensp;:&ensp;
                    </StyledText>
                    <View style={{flex: 1}}>
                      <StyledText
                        numberOfLines={1}
                        style={{
                          color: item?.color ? item?.color : '#000',
                        }}>
                        {item?.[cardItem?.key]}
                      </StyledText>
                    </View>
                  </View>
                );
              })}
              {!isView ? (
                <View
                  style={[
                    CommonStyles.flexRow,
                    {
                      justifyContent: 'space-between',
                      flex: 1,
                      alignItems: 'flex-start',
                    },
                  ]}>
                  <View
                    style={{
                      width: '48%',
                    }}>
                    <StyledText style={styles.headerLabel}>
                      Start Date
                    </StyledText>
                    {selected_task ? (
                      <DateTimePicker
                        mode="datetime"
                        format="YYYY-MM-DD hh:mm A"
                        title=""
                        value={selected_task?.start_date || null}
                        onSelect={date => {
                          handleTaskDateUpdates(
                            'start_date',
                            date,
                            item?.task_id,
                          );
                        }}
                        errorText={
                          touched.selected_tasks && errors?.selected_tasks
                            ? !selected_task?.start_date
                              ? '* Start date is required'
                              : moment(
                                  selected_task?.start_date,
                                  'YYYY-MM-DD hh:mm A',
                                ).isAfter(
                                  moment(
                                    selected_task?.end_date,
                                    'YYYY-MM-DD hh:mm A',
                                  ),
                                )
                              ? 'Start date should be before end date!'
                              : ''
                            : ''
                        }
                        maximumDate={
                          selected_task?.end_date
                            ? new Date(
                                moment(
                                  selected_task?.end_date,
                                  'YYYY-MM-DD hh:mm A',
                                ).format('YYYY-MM-DD'),
                              )
                            : undefined
                        }
                      />
                    ) : (
                      <StyledText
                        numberOfLines={1}
                        style={{
                          color: item?.color ? item?.color : '#000',
                        }}>
                        {item?.start_date
                          ? moment(item?.start_date).format(
                              'YYYY-MM-DD hh:mm A',
                            )
                          : '-'}
                      </StyledText>
                    )}
                  </View>
                  <View
                    style={{
                      width: '48%',
                    }}>
                    <StyledText style={styles.headerLabel}>End Date</StyledText>
                    {selected_task && !isView ? (
                      <DateTimePicker
                        mode="datetime"
                        format="YYYY-MM-DD hh:mm A"
                        title=""
                        value={selected_task?.end_date || null}
                        onSelect={date => {
                          handleTaskDateUpdates(
                            'end_date',
                            date,
                            item?.task_id,
                          );
                        }}
                        errorText={
                          touched.selected_tasks && errors?.selected_tasks
                            ? !selected_task?.end_date
                              ? '* End date is required'
                              : ''
                            : ''
                        }
                        minimumDate={
                          selected_task?.start_date
                            ? new Date(
                                moment(
                                  selected_task?.start_date,
                                  'YYYY-MM-DD hh:mm A',
                                ).format('YYYY-MM-DD'),
                              )
                            : undefined
                        }
                      />
                    ) : (
                      <StyledText
                        numberOfLines={1}
                        style={{
                          color: item?.color ? item?.color : '#000',
                        }}>
                        {item?.updated_at
                          ? moment(item?.updated_at).format(
                              'YYYY-MM-DD hh:mm A',
                            )
                          : '-'}
                      </StyledText>
                    )}
                  </View>
                </View>
              ) : (
                <View
                  style={[
                    CommonStyles.flexRow,
                    {
                      justifyContent: 'space-between',
                      flex: 1,
                      alignItems: 'flex-start',
                    },
                  ]}>
                  <View
                    style={{
                      width: '48%',
                    }}>
                    <StyledText style={styles.headerLabel}>
                      Start Date
                    </StyledText>

                    <StyledText
                      numberOfLines={1}
                      style={{
                        color: item?.color ? item?.color : '#000',
                      }}>
                      {selected_task?.start_date
                        ? selected_task?.start_date
                        : '-'}
                    </StyledText>
                  </View>
                  <View
                    style={{
                      width: '48%',
                    }}>
                    <StyledText style={styles.headerLabel}>End Date</StyledText>

                    <StyledText
                      numberOfLines={1}
                      style={{
                        color: item?.color ? item?.color : '#000',
                      }}>
                      {selected_task?.end_date ? selected_task?.end_date : '-'}
                    </StyledText>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </>
      );
    }
    return null;
  };

  const handleTaskDateUpdates = (
    key: 'start_date' | 'end_date',
    date: string,
    id: number,
  ) => {
    const tempdata = [...values?.selected_tasks]?.map(ele => {
      if (ele?.task_id === id) {
        return {
          ...ele,
          [key]: date,
        };
      }
      return {...ele};
    });

    // setSelectedTasks([...tempdata] || []);
    // @ts-ignore
    setFieldValue('selected_tasks', [...tempdata] || []);
  };

  const onSelectTask = (val: any) => {
    if (
      values?.selected_tasks?.map(ele => ele?.task_id)?.includes(val?.task_id)
    ) {
      // setSelectedTasks(pre =>
      //   [...pre]?.filter(ele => ele?.task_id !== val?.task_id),
      // );
      setFieldValue(
        'selected_tasks',
        [...values?.selected_tasks]?.filter(
          ele => ele?.task_id !== val?.task_id,
        ),
      );
      return;
    }
    // setSelectedTasks(pre => [...pre, val]);
    setFieldValue('selected_tasks', [...values?.selected_tasks, val]);
  };

  return (
    <HOCView
      headerProps={{
        isEnableMenu: false,
        isRightIconEnable: false,
        headerTitle: `${isView ? 'View' : 'Update'} Preventive Tasks`,
        onBackPress() {
          navigation.goBack();
        },
      }}
      isLoading={loading}>
      <View
        style={{
          flex: 1,
        }}>
        {/* <CustomButton
          style={{
            maxWidth: 130,
            alignSelf: 'flex-end',
            marginBottom: 10,
          }}
          onPress={() => {
            navigation.navigate('AssignTasks');
          }}>
          Assign Task
        </CustomButton> */}
        {preventiveViewData && (
          <TableView
            dataList={[...preventiveViewData?.all_task]}
            rowData={TaskRowData}
            viewPortColumnDivisionCount={2.3}
            showFullText
            selectable={type !== 1 && preventiveViewData?.request_status !== 3}
            selectedIds={values?.selected_tasks?.map(ele => ele?.task_id)}
            checkedKey="task_id"
            onCheckPress={val => {
              onSelectTask(val);
            }}
            onPressItem={val => {
              if (type !== 1 && preventiveViewData?.request_status !== 3)
                onSelectTask(val);
            }}
            customRenderer={renderCardItem}
          />
        )}
        <CustomButton
          onPress={() => {
            // // setnavigateStatus(false);
            handleSubmit();
            if (isEmpty(errors)) {
              navigation.navigate('PreventiveFileUpload', {
                preventiveId: selectedId,
                isView:
                  route?.params?.preventiveType === 1 ||
                  preventiveViewData?.request_status === 3,
              });
            }
          }}>
          Next
        </CustomButton>
      </View>
    </HOCView>
  );
};

export default PreventiveTasks;

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: COLORS.white,
    marginBottom: 10,
    borderRadius: 15,
    padding: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  headerLabel: {
    fontFamily: FONTS.poppins.medium,
  },
});
