import moment from 'moment';
import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {ConvertJSONtoFormData, isLoading} from '../../Utilities/Methods';
import {
  ImportMachineFileService,
  SampleFileDownloadService,
} from '../../Services/Services';
import {downloadPdf, getCatchMessage} from '../../Utilities/GeneralUtilities';
import Toast from '../../Components/Toast';
import {UseToken} from '../../Utilities/StoreData';
import {AddEditModalProps} from '../../@types/Global';
import CustomButton from '../../Components/CustomButton';
import DocumentPicker from 'react-native-document-picker';
import StyledText from '../../Components/StyledText';
import {COLORS, FONTSIZES} from '../../Utilities/Constants';
import {FONTS} from '../../Utilities/Fonts';
import CustomImageBox from '../../Components/CustomImageBox';
import {ICONS} from '../../Utilities/Icons';
type FileUploadProps = {
  file: FileType | null;
};
type FileType = {
  type: string;
  name: string;
  uri: string;
};
const validationSchema = Yup.object().shape({
  file: Yup.mixed().required('* File is required.'),
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
    setFieldTouched,
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
        getCatchMessage(err);
      })
      .finally(() => isLoading(false));
  };

  const handleUploadMachines = (values: FileUploadProps) => {
    isLoading(true);
    let finalObj = {
      token: token,
      upload_file: {
        type: values?.file?.type,
        name: values?.file?.name,
        uri: values?.file?.uri,
      },
    };

    ImportMachineFileService(ConvertJSONtoFormData(finalObj))
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
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx, DocumentPicker.types.csv], // Supports both Excel & CSV
      });
      setFieldValue('file', res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
      }
    }
  };

  return (
    <View style={styles.UploadContainer}>
      <View style={styles.fileBox}>
        <CustomImageBox alt="ExcelIcon" src={ICONS.ExcelIcon} />
        <StyledText
          onPress={handleDownloadSampleFile}
          style={{
            paddingVertical: 10,
            color: COLORS.green,
            fontSize: FONTSIZES.small,
            fontFamily: FONTS.poppins.medium,
          }}>
          Download Sample Excel File
        </StyledText>
      </View>
      <CustomButton
        onPress={() => {
          pickExcelFile();
        }}
        type="export">
        Choose File
      </CustomButton>
      {errors.file && touched?.file ? (
        <StyledText style={{color: COLORS.red}}>{errors?.file}</StyledText>
      ) : null}
      {values?.file && <StyledText>{values?.file?.name}</StyledText>}
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
        <CustomButton
          style={{width: '45%'}}
          onPress={() => {
            setFieldTouched('file', true);
            handleSubmit();
          }}>
          {type || 'SUbmit'}
        </CustomButton>
      </View>
    </View>
  );
};

export default ImportFileModal;

const styles = StyleSheet.create({
  fileBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: COLORS.green,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  UploadContainer: {
    gap: 10,
  },
});
