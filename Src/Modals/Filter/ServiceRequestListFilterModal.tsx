import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  ServiceRequestFilterDataProps,
  ServiceRequestListFilterModalProps,
} from '../../@types/modals';
import {useFormik} from 'formik';
import {
  DeviceStatusProps,
  requestStatusOptions,
} from '../../Utilities/StaticDropdownOptions';
import DropdownBox from '../../Components/DropdownBox';
import CustomButton from '../../Components/CustomButton';
import DateTimePicker from '../../Components/DateTimePicker';

const reqStatusOptions: DeviceStatusProps[] = [...requestStatusOptions];

const ServiceRequestListFilterModal = ({
  filterData,
  onApplyFilter,
  onClose,
  initialValue,
}: ServiceRequestListFilterModalProps) => {
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
  } = useFormik<ServiceRequestFilterDataProps>({
    initialValues: {
      machine: null,
      sort_type: null,
      reqStatus: null,
      from_date: '',
      to_date: '',
      work_center: null,
      division: null,
      report_no: '',
    },
    onSubmit(values) {
      onApplyFilter(values);
      onClose();
    },
  });

  useEffect(() => {
    if (filterData) {
      setValues({
        ...filterData,
      });
    }
  }, []);

  useEffect(() => {
    if (initialValue?.type) {
      setFieldValue(
        'reqStatus',
        initialValue?.type
          ? [...reqStatusOptions]?.find(
              ele => ele?.id === initialValue?.type,
            ) || null
          : null,
      );
    }
  }, [initialValue]);

  return (
    <View>
      <DropdownBox
        title="Machine"
        value={values.machine}
        placeHolder="Select machine"
        apiType="machineList"
        onSelect={val => {
          setFieldValue('machine', val);
        }}
        type="search"
        fieldName="machine_name"
        isLocalSearch
        searchFieldName="machine_name"
        onIconPress={() => {
          setFieldValue('machine', null);
        }}
      />
      {/* <DropdownBox
        title="Work Center"
        value={values.work_center}
        placeHolder="Select Work Center"
        apiType="work_center"
        onSelect={val => {
          setFieldValue('work_center', val);
        }}
        type="search"
        fieldName="description"
        isLocalSearch
        searchFieldName="description"
        onIconPress={() => {
          setFieldValue('work_center', null);
        }}
      /> */}
      <DropdownBox
        title="Division"
        value={values.division}
        placeHolder="Select Division"
        apiType="division"
        onSelect={val => {
          setFieldValue('division', val);
        }}
        type="search"
        fieldName="description"
        isLocalSearch
        searchFieldName="description"
        onIconPress={() => {
          setFieldValue('division', null);
        }}
      />
      {/* <TextInputBox
        value={values?.report_no}
        onChangeText={(val: string) => {
          setFieldValue('report_no', val);
        }}
        customInputBoxContainerStyle={{
          borderColor: COLORS.primary,
        }}
        placeHolder="Enter Report No"
        title="Report No"
        isEditable
      /> */}
      <DateTimePicker
        format="YYYY-MM-DD"
        value={values.from_date}
        onSelect={date => {
          setFieldValue('from_date', date);
        }}
        title="Start Date"
        maximumDate={values?.to_date ? new Date(values?.to_date) : new Date()}
      />
      <DateTimePicker
        format="YYYY-MM-DD"
        value={values.to_date}
        onSelect={date => {
          setFieldValue('to_date', date);
        }}
        title="End Date"
        minimumDate={values.from_date ? new Date(values.from_date) : null}
        maximumDate={new Date()}
      />
      {/* <DropdownBox
        title="Sort Type"
        options={[...SORT_OPTIONS]}
        value={values.sort_type}
        placeHolder="Sort Type"
        onSelect={val => {
          setFieldValue('sort_type', val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue('sort_type', null);
        }}
      /> */}
      <DropdownBox
        title="Request Status"
        options={[...reqStatusOptions]}
        value={values.reqStatus}
        placeHolder="Select Request Status"
        onSelect={val => {
          setFieldValue('reqStatus', val);
        }}
        type="miniList"
        fieldName="name"
        onIconPress={() => {
          setFieldValue('reqStatus', null);
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <CustomButton
          style={{width: '45%'}}
          type="secondary"
          onPress={() => {
            resetForm({
              values: {
                ...initialValues,
                reqStatus: null,
              },
            });
            onApplyFilter(null);
            onClose();
          }}>
          Reset
        </CustomButton>
        <CustomButton style={{width: '45%'}} onPress={handleSubmit}>
          Submit
        </CustomButton>
      </View>
    </View>
  );
};

export default ServiceRequestListFilterModal;

const styles = StyleSheet.create({});
