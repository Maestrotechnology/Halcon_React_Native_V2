import React from 'react';
import {UseToken} from '../../../Utilities/StoreData';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import ImageUpload from '../../../Components/ImageUpload';
import HOCView from '../../../Components/HOCView';
import StyledText from '../../../Components/StyledText';
import CustomButton from '../../../Components/CustomButton';
import DocumentPicker from 'react-native-document-picker';
type FileUploadProps = {
  file: File | null;
};
const validationSchema = Yup.object().shape({
  file: Yup.mixed().required('* Work Center Name is required.'),
});
export default function FileBulkUpload() {
  const token = UseToken();
  const {
    setFieldValue,
    handleSubmit,
    setValues,
    resetForm,
    values,
    initialValues,
    errors,
    touched,
  } = useFormik<FileUploadProps>({
    initialValues: {
      file: null,
    },
    validationSchema,
    onSubmit(values) {},
  });
  const pickExcelFile = async () => {
    try {
      console.log('CALLED');

      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx, DocumentPicker.types.csv], // Supports both Excel & CSV
      });
      setFieldValue('file', res[0]);

      console.log('File picked:', res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled file picker.');
      } else {
        console.error('File selection error:', err);
      }
    }
  };
  return (
    <HOCView
      secondaryHeaderTitle="File Upload"
      headerProps={{
        headerTitle: 'Machines',
      }}>
      <CustomButton
        onPress={() => {
          console.log('CLICED');
        }}>
        Choose File
      </CustomButton>
    </HOCView>
  );
}
