import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import {MTTRReportFilterProps} from '../../@types/modals';
import CustomButton from '../../Components/CustomButton';
import {FilterModalProps} from '../../@types/Global';
import DropdownBox from '../../Components/DropdownBox';
import ActionButtons from '../../Components/ActionButtons';

const MTTRreportFilterModal = ({
  filterData,
  onApplyFilter,
  onClose,
  isReport = false,
}: FilterModalProps<MTTRReportFilterProps>) => {
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
  } = useFormik<MTTRReportFilterProps>({
    initialValues: {
      machine_id: null,
      year: null,
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
      <ActionButtons
        onPressNegativeBtn={() => {
          resetForm({
            values: {
              ...initialValues,
            },
          });
          onApplyFilter(null);
          onClose();
        }}
        onPressPositiveBtn={handleSubmit}
      />
    </View>
  );
};

export default MTTRreportFilterModal;
