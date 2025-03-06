import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HOCView from '../../../../Components/HOCView';
import StyledText from '../../../../Components/StyledText';
import {
  ServiceRequestCreationScreensNavigationProps,
  ServiceRequestCreationStackParamList,
} from '../../../../@types/navigation';
import ImageUpload from '../../../../Components/ImageUpload';
import TextInputBox from '../../../../Components/TextInputBox';
import {useServiceRequestDetails} from '../../../../Utilities/Contexts';
import CustomButton from '../../../../Components/CustomButton';
import {
  ImageInputBoxOptionsProps,
  ImageProps,
} from '../../../../@types/general';
import SVGIcon from '../../../../Components/SVGIcon';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FONTS} from '../../../../Utilities/Fonts';
import {
  COLORS,
  INPUT_SIZE,
  WINDOW_WIDTH,
  bigInputBoxStyle,
} from '../../../../Utilities/Constants';
import {
  AlertBox,
  downloadPdf,
  getFileNameFromUrl,
} from '../../../../Utilities/GeneralUtilities';
import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {UseToken} from '../../../../Utilities/StoreData';
import {
  deleteAttachmentsService,
  fileUploadService,
  getAttachmentsListService,
} from '../../../../Services/Services';
import Toast from '../../../../Components/Toast';
import Loader from '../../../../Components/Loader';
import {
  AttachmentsListApiResponseProps,
  DeleteAttachmentApiResposneProps,
  FileUploadApiResponseProps,
} from '../../../../@types/api';
import CustomImageBox from '../../../../Components/CustomImageBox';
import DropdownBox from '../../../../Components/DropdownBox';
import {RequiringProblemsList} from '../../../../Utilities/StaticDropdownOptions';
import DateTimePicker from '../../../../Components/DateTimePicker';
import {renderTitleText} from '../../../../Utilities/UiComponents';

type ViewImageStateProps = {
  status: boolean;
  uri: string;
};

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const FileUploading = ({
  navigation,
}: ServiceRequestCreationScreensNavigationProps) => {
  const token = UseToken();
  const focused = useIsFocused();
  const route =
    useRoute<
      RouteProp<
        ServiceRequestCreationStackParamList,
        keyof ServiceRequestCreationStackParamList
      >
    >();
  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    isCreate,
    isUpdate,
    isView,
    deviceFailureFiles,
    setdeviceFailureFiles,
    setactiveTab,
    serviceReqId,
    handleSubmit,
    isServiceUpdate,
    activeTab,
    settaskDetailsFiles,
    taskDetailsFiles,
    routeData,
  } = useServiceRequestDetails();
  const [isViewImage, setisViewImage] = useState<ViewImageStateProps>({
    status: false,
    uri: '',
  });
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const imgOptions: ImageInputBoxOptionsProps[] = [
    {
      id: 1,
      buttonName: 'View',
    },
    {
      id: 2,
      buttonName:
        isUpdate || (activeTab === 4 && !isView) || isCreate
          ? 'Delete'
          : 'Download',
    },
  ];

  useEffect(() => {
    if (focused) {
      setactiveTab(route.params?.isFrom === 'deviceFailure' ? 2 : 4);
      if (!isCreate && serviceReqId) {
        setisLoading(true);
        handlegetUploadedImages(serviceReqId, 1);
      }
    }
  }, [focused]);

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;

    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, []);

  const handlegetUploadedImages = (serviceReqId: number, page = 1) => {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('request_id', serviceReqId);
    formData.append('upload_for', activeTab === 4 ? 2 : 1);
    getAttachmentsListService(formData, page)
      .then(res => {
        const response: AttachmentsListApiResponseProps = res.data;

        if (response.status === 1) {
          let tempData: ImageProps[] = [...response.data.items].map(ele => {
            return {
              file_title: ele.file_title,
              type: 'image/jpeg',
              file: ele.file,
              attachment_id: ele.id,
              id: ele?.id,
              attachmentType: ele.upload_for,
            };
          });
          if (page === 1) {
            totalPages = response.data.total_page;
            if (activeTab === 4) {
              settaskDetailsFiles([...tempData]);
            } else {
              setdeviceFailureFiles([...tempData]);
            }
          } else {
            if (activeTab === 4) {
              settaskDetailsFiles((prev: ImageProps[]) => [
                ...prev,
                ...tempData,
              ]);
            } else {
              setdeviceFailureFiles((prev: ImageProps[]) => [
                ...prev,
                ...tempData,
              ]);
            }
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        setisLoading(false);
        setisEndRefreshing(false);
        setisRefreshing(false);
      });
  };

  const onEndReached = () => {
    if (!isCreate && serviceReqId) {
      currentPage = currentPage + 1;
      if (currentPage <= totalPages) {
        if (isMount) {
          setisEndRefreshing(true);
        }
        handlegetUploadedImages(serviceReqId, currentPage);
      }
    }
  };

  const onRefresh = () => {
    if (!isCreate && serviceReqId) {
      if (isMount) {
        setisRefreshing(true);
      }
      totalPages = 1;
      currentPage = 1;
      handlegetUploadedImages(serviceReqId, 1);
    }
  };

  const closeViewImageModal = () => {
    setisViewImage({
      status: false,
      uri: '',
    });
  };

  const handleDeleteImage = (val: ImageProps) => {
    if (val.attachmentType && val.attachment_id) {
      handleDeleteAttachment(val.attachment_id);
    } else {
      let tempData = [...deviceFailureFiles].filter(
        ele => ele.attachment_id !== val.attachment_id,
      );
      let tempTaskFiles = [...taskDetailsFiles].filter(
        ele => ele.attachment_id !== val.attachment_id,
      );
      if (activeTab === 4) {
        settaskDetailsFiles([...tempTaskFiles]);
      } else {
        setdeviceFailureFiles([...tempData]);
      }
      Toast.success('Attachment deleted successfully');
    }
  };

  const handleUploadFiles = () => {
    if (isMount) {
      setisLoading(true);
    }
    let tempFileNames = [...taskDetailsFiles]
      .filter(element => !element?.attachmentType)
      .map(ele => ele.file_title);

    const formData = new FormData();
    formData.append('token', token);
    formData.append('request_id', serviceReqId);
    formData.append('upload_for', 2);
    formData.append('file_title', tempFileNames?.toString());
    [...taskDetailsFiles]
      .filter(element => !element?.attachmentType)
      .map(ele => {
        let file = {
          type: ele.type,
          // @ts-ignore
          name: ele.name,
          uri: ele.file,
        };

        formData.append('upload_file', file);
      });

    fileUploadService(formData)
      .then(res => {
        const response: FileUploadApiResponseProps = res.data;
        if (response.status === 1) {
          Toast.success(response.msg);
          if (serviceReqId) {
            handlegetUploadedImages(serviceReqId, 1);
          }
          setFieldValue('deviceFailureFileName', '');
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisLoading(false);
        }
      });
  };

  const handleDeleteAttachment = (attchmentId: number) => {
    if (isMount) {
      setisLoading(true);
    }
    const formData = new FormData();
    formData.append('token', token);
    formData.append('file_id', attchmentId);
    deleteAttachmentsService(formData)
      .then(res => {
        const response: DeleteAttachmentApiResposneProps = res.data;
        if (response.status === 1) {
          let tempData = [...deviceFailureFiles].filter(
            ele => ele.attachment_id !== attchmentId,
          );
          let tempTaskFiles = [...taskDetailsFiles].filter(
            ele => ele.attachment_id !== attchmentId,
          );
          if (activeTab === 4) {
            settaskDetailsFiles([...tempTaskFiles]);
          } else {
            setdeviceFailureFiles([...tempData]);
          }
          Toast.success(response.msg);
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisLoading(false);
        }
      });
  };

  const RenderImageView = () => {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{padding: 10}}>
          <TouchableOpacity
            onPress={closeViewImageModal}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <SVGIcon icon="back_arrow" />
            <StyledText style={{fontFamily: FONTS.poppins.medium}}>
              Back
            </StyledText>
          </TouchableOpacity>
          <CustomImageBox
            alt="file"
            src={{uri: isViewImage.uri}}
            ImageStyle={{width: WINDOW_WIDTH - 20, height: '100%'}}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    );
  };

  const getFiles = () => {
    if (activeTab === 4) {
      return [...taskDetailsFiles];
    }

    return [...deviceFailureFiles];
  };

  const getBtnTitle = () => {
    return isView
      ? activeTab === 2
        ? 'Next'
        : ''
      : isCreate
      ? 'Save'
      : isUpdate
      ? 'Update'
      : isServiceUpdate
      ? activeTab === 2
        ? 'Next'
        : 'Update'
      : activeTab === 4
      ? 'Close Service'
      : activeTab === 2 && isView && !values.serviceStartedDate
      ? 'Back'
      : 'Next';
  };

  const isShowUploadFilesBtn = () => {
    return [...taskDetailsFiles].some(ele => !ele.attachmentType);
  };

  const isShowUploadFileOption = () => {
    return (
      (isCreate ||
        isUpdate ||
        (activeTab === 4 && !values.serviceCompletedDate)) &&
      !isView
    );
  };
  return (
    <>
      <HOCView
        isEnableKeyboardAware
        headerProps={{
          isEnableMenu: false,
          isRightIconEnable: false,
          onBackPress() {
            navigation.goBack();
          },
          headerTitle: 'File Upload',
        }}
        secondaryHeaderTitle="File Upload">
        {isShowUploadFileOption() && (
          <TextInputBox
            title="File name"
            placeHolder="Enter file name"
            value={values.deviceFailureFileName}
            onChangeText={handleChange('deviceFailureFileName')}
            errorText={
              errors.deviceFailureFileName && touched.deviceFailureFileName
                ? errors.deviceFailureFileName
                : ''
            }
            textInputProps={{maxLength: INPUT_SIZE.Name}}
          />
        )}
        <ImageUpload
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          isShowSelectImage={isShowUploadFileOption()}
          value={getFiles()}
          onSelect={val => {
            if (activeTab === 4) {
              settaskDetailsFiles((prev: ImageProps[]) => [
                ...prev,
                {
                  ...val,
                  name: val.file_title,
                  file_title: values.deviceFailureFileName
                    ? values.deviceFailureFileName
                    : val.file_title,
                },
              ]);
            } else {
              setdeviceFailureFiles((prev: ImageProps[]) => [
                ...prev,
                {
                  ...val,
                  name: val.file_title,
                  file_title: values.deviceFailureFileName
                    ? values.deviceFailureFileName
                    : val.file_title,
                },
              ]);
            }

            setFieldValue('deviceFailureFileName', '');
          }}
          imgOptions={[...imgOptions]}
          onPressImgOption={(id, val) => {
            if (id === 1) {
              setisViewImage({
                status: true,
                uri: val.file,
              });
            } else if (id === 2) {
              if (isUpdate || (activeTab === 4 && !isView) || isCreate) {
                AlertBox({
                  alertMsg: 'Are you sure that want to delete this image?',
                  onPressPositiveButton() {
                    if (val.attachment_id) {
                      handleDeleteImage(val);
                    }
                  },
                });
              } else {
                let fileName = getFileNameFromUrl(val.file);
                downloadPdf(val.file, fileName, 'pdf_download', setisLoading);
              }
            }
          }}
        />
        {activeTab === 4 &&
          taskDetailsFiles.length > 0 &&
          isShowUploadFilesBtn() && (
            <CustomButton
              onPress={handleUploadFiles}
              type="secondary"
              style={{width: '50%', marginTop: 15}}>
              Upload Files
            </CustomButton>
          )}
        <View style={{marginVertical: 10}} />
        {isServiceUpdate && activeTab === 4 && renderTitleText('FMEA')}
        {isServiceUpdate && activeTab === 4 && (
          <DropdownBox
            title="Was this failure mode identified in the FMEA?"
            // isRequired
            options={[...RequiringProblemsList]}
            value={values.efmea_status}
            placeHolder="Status"
            onSelect={val => {
              setFieldValue('efmea_status', val);
            }}
            type="miniList"
            fieldName="name"
            onIconPress={() => {
              setFieldValue('efmea_status', null);
            }}
            errorText={
              errors.efmea_status && touched.efmea_status
                ? errors.efmea_status
                : ''
            }
            isDisabled={!isServiceUpdate}
            isEnableRightIcon={!isServiceUpdate}
          />
        )}
        {isServiceUpdate &&
          activeTab === 4 &&
          values?.efmea_status?.id === 2 && (
            <DateTimePicker
              isDisabled={isView}
              mode="datetime"
              format="YYYY-MM-DD hh:mm A"
              title="If No, date FMEA was updated to include this failure mode"
              value={values.efmea_date}
              onSelect={date => {
                setFieldValue('efmea_date', date);
              }}
              minimumDate={new Date()}
            />
          )}

        {isServiceUpdate && activeTab === 4 && (
          <TextInputBox
            title="If machine is not fully operational, list limitations"
            value={values?.machine_limitations}
            placeHolder="If machine is not fully operational, list limitations"
            onChangeText={handleChange('machine_limitations')}
            textInputProps={{
              ...bigInputBoxStyle,
            }}
            multiline
            customInputBoxContainerStyle={{
              height: 100,
              backgroundColor: COLORS.white,
              borderColor: isView ? COLORS.white : COLORS.primary,
            }}
            isEditable={isServiceUpdate}
          />
        )}
        {isServiceUpdate && activeTab === 4 && (
          <TextInputBox
            title="Service Team Comments"
            value={values?.service_team_commments}
            placeHolder="Service Team Comments"
            onChangeText={handleChange('service_team_commments')}
            textInputProps={{
              ...bigInputBoxStyle,
            }}
            multiline
            customInputBoxContainerStyle={{
              height: 100,
              backgroundColor: COLORS.white,
              borderColor: isView ? COLORS.white : COLORS.primary,
            }}
            isEditable={isServiceUpdate}
          />
        )}
        {((activeTab === 4 && !isView) || activeTab === 2) && (
          <CustomButton
            onPress={() => {
              if (isCreate || isUpdate) {
                handleSubmit();
              } else if (
                activeTab === 2 &&
                routeData?.isServiceUpdate &&
                !values.serviceStartedDate
              ) {
                navigation.navigate('TaskDetails');
              } else if (
                activeTab === 2 &&
                (routeData?.isServiceUpdate || routeData?.isView) &&
                values.serviceStartedDate
              ) {
                navigation.navigate('TaskDetails');
              } else if (activeTab === 2 && routeData?.isView) {
                navigation.navigate('TaskDetails');
              } else if (isServiceUpdate) {
                handleSubmit();
              }
            }}
            style={{marginVertical: 20}}>
            {getBtnTitle()}
          </CustomButton>
        )}
        <Modal
          visible={isViewImage.status}
          onRequestClose={closeViewImageModal}>
          <RenderImageView />
        </Modal>
      </HOCView>
      <Loader isVisible={isLoading} />
    </>
  );
};

export default FileUploading;

const styles = StyleSheet.create({});
