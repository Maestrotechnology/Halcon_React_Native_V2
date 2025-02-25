import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import {SpindleReportFilterProps} from '../../@types/modals';
import CustomButton from '../../Components/CustomButton';
import {FilterModalProps} from '../../@types/Global';
import DropdownBox from '../../Components/DropdownBox';

const SpindleReportFilterModal = ({
  filterData,
  onApplyFilter,
  onClose,
  isReport = false,
}: FilterModalProps<SpindleReportFilterProps>) => {
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
  } = useFormik<SpindleReportFilterProps>({
    initialValues: {
      division_id: null,
      work_center_id: null,
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
  }, [filterData]);

  return (
    <View>
      {isReport && (
        <DropdownBox
          title="Machine"
          value={values.machine_id}
          placeHolder="Select machine"
          apiType="machineList"
          onSelect={val => {
            setFieldValue('machine_id', val);
          }}
          type="search"
          fieldName="equipment_id"
          isLocalSearch
          searchFieldName="equipment_id"
          onIconPress={() => {
            setFieldValue('machine_id', null);
          }}
        />
      )}
      <DropdownBox
        title="Division"
        value={values.division_id}
        placeHolder="Select Division"
        apiType="division"
        onSelect={val => {
          setFieldValue('division_id', val);
        }}
        type="search"
        fieldName="description"
        isLocalSearch
        searchFieldName="description"
        onIconPress={() => {
          setFieldValue('division_id', null);
        }}
      />
      <DropdownBox
        title="Work Center"
        value={values.work_center_id}
        placeHolder="Select Work Center"
        apiType="work_center"
        onSelect={val => {
          setFieldValue('work_center_id', val);
        }}
        type="search"
        fieldName="work_center_name"
        isLocalSearch
        searchFieldName="work_center_name"
        onIconPress={() => {
          setFieldValue('work_center_id', null);
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

export default SpindleReportFilterModal;

const styles = StyleSheet.create({});
