import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {ConvertJSONtoFormData, isLoading} from '../../Utilities/Methods';
import {
  CreateWorkCenterService,
  SampleFileDownloadService,
} from '../../Services/Services';
import {downloadPdf, getCatchMessage} from '../../Utilities/GeneralUtilities';
import Toast from '../../Components/Toast';
import {UseToken} from '../../Utilities/StoreData';
import {AddEditModalProps} from '../../@types/Global';
import ImageUpload from '../../Components/ImageUpload';
import CustomButton from '../../Components/CustomButton';
import DocumentPicker from 'react-native-document-picker';
import StyledText from '../../Components/StyledText';
import moment from 'moment';
import {COLORS, FONTSIZES} from '../../Utilities/Constants';
import {FONTS} from '../../Utilities/Fonts';

type FileUploadProps = {
  file: File | null;
};
const validationSchema = Yup.object().shape({
  file: Yup.string().trim().required('* Work Center Name is required.'),
});
const ImportFileModal = ({
  onApplyChanges,
  onClose,
  type,
  lineData,
}: AddEditModalProps<any>) => {
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
    onSubmit(values) {
      handleUploadMachines(values);
    },
  });
  const handleDownloadSampleFile = () => {
    isLoading(true);
    let finalObj = {
      token: token,
    };

    SampleFileDownloadService(ConvertJSONtoFormData(finalObj))
      .then(async res => {
        if (res.data.status === 1) {
          console.log(res?.data?.file_url);
          downloadPdf(
            res?.data?.file_url,
            `Machine ${moment(new Date()).format('YYYY-MM-DD hh:mm A')}`,
            'pdf_download',
            isLoading,
          );
        } else {
          Toast.error(res.data.msg);
        }
      })
      .catch(err => {
        console.log(err, 'ERROR==');

        getCatchMessage(err);
      })
      .finally(() => isLoading(false));
  };

  const handleUploadMachines = (values: FileUploadProps) => {
    isLoading(true);
    let finalObj = {
      token: token,
    };

    SampleFileDownloadService(ConvertJSONtoFormData(finalObj))
      .then(async res => {
        if (res.data.status === 1) {
          Toast.success(res?.data?.msg);
          onApplyChanges();
          onClose();
        } else {
          Toast.error(res.data.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (lineData) {
      setValues({
        ...lineData,
      });
    }
  }, []);
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
    <View>
      <CustomButton
        onPress={() => {
          console.log('CLICED');
          pickExcelFile();
        }}>
        Choose File
      </CustomButton>
      <StyledText
        onPress={handleDownloadSampleFile}
        style={{
          paddingVertical: 10,
          color: COLORS.blue,
          fontSize: FONTSIZES.small,
          fontFamily: FONTS.poppins.medium,
        }}>
        Download Sample Excel File
      </StyledText>
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
            onClose();
          }}>
          Close
        </CustomButton>
        <CustomButton style={{width: '45%'}} onPress={handleSubmit}>
          {type || 'SUbmit'}
        </CustomButton>
      </View>
    </View>
  );
};

export default ImportFileModal;

const styles = StyleSheet.create({});
