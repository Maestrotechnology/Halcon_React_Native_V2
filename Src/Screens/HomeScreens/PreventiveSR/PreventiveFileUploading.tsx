import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import HOCView from "../../../Components/HOCView";
import { ImageInputBoxOptionsProps, ImageProps } from "../../../@types/general";
import { UseToken } from "../../../Utilities/StoreData";
import {
  deleteAttachmentsService,
  fileUploadService,
  getAttachmentsListService,
  updatePreventiveTaskService,
} from "../../../Services/Services";
import {
  AttachmentsListApiResponseProps,
  DeleteAttachmentApiResposneProps,
  FileUploadApiResponseProps,
} from "../../../@types/api";
import Toast from "../../../Components/Toast";
import { SafeAreaView } from "react-native-safe-area-context";
import SVGIcon from "../../../Components/SVGIcon";
import StyledText from "../../../Components/StyledText";
import { FONTS } from "../../../Utilities/Fonts";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../../../Utilities/Constants";
import TextInputBox from "../../../Components/TextInputBox";
import { useFormik } from "formik";
import GlobaModal from "../../../Components/GlobalModal";
import CustomButton from "../../../Components/CustomButton";
import { AlertBox, getCatchMessage } from "../../../Utilities/GeneralUtilities";
import ImageUpload from "../../../Components/ImageUpload";
import { openLoader } from "../../../Store/Slices/LoaderSlice";
import { useDispatch } from "react-redux";
import { usePreventiveRequestContext } from "../../../Utilities/Contexts";
import moment from "moment";

type ViewImageStateProps = {
  status: boolean;
  uri: string;
};

var isMount = true;
var currentPage = 1;
var totalPages = 1;
const PreventiveFileUploading = ({ route, navigation }: any) => {
  const ContextValue = usePreventiveRequestContext();
  const token = UseToken();
  const dispatch = useDispatch();
  const [isViewImage, setisViewImage] = useState<ViewImageStateProps>({
    status: false,
    uri: "",
  });
  const preventivReqId = route?.params?.preventiveId;
  // const isView = route?.params?.isView;
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const imgOptions: ImageInputBoxOptionsProps[] = [
    {
      id: 1,
      buttonName: "View",
      isVisible: true,
    },
    {
      id: 2,
      buttonName: "Delete",
      isVisible: !ContextValue.isView,
    },
  ];

  const [deviceFailureFiles, setdeviceFailureFiles] = useState<ImageProps[]>(
    []
  );

  const [selectedImages, setSelectedImages] = useState<ImageProps[]>([]);

  const { values, errors, touched, setFieldValue, handleChange } = useFormik({
    initialValues: {
      deviceFailureFileName: "",
    },
    onSubmit: () => {},
  });
  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;
    if (preventivReqId) {
      setisLoading(true);
      handlegetUploadedImages(preventivReqId);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, []);

  const handlegetUploadedImages = (preventivReqId: number, page = 1) => {
    if (isMount) {
      setisLoading(true);
    }
    const formData = new FormData();
    formData.append("token", token);
    formData.append("preventive_request_id", preventivReqId);
    formData.append("upload_for", 3);
    getAttachmentsListService(formData, page)
      .then((res) => {
        const response: AttachmentsListApiResponseProps = res.data;
        if (response.status === 1) {
          let tempData: ImageProps[] = [...response.data.items].map((ele) => {
            return {
              file_title: ele.file_title,
              type: "image/jpeg",
              file: ele.file,
              attachment_id: ele.id,
              attachmentType: ele.upload_for,
            };
          });

          if (page === 1) {
            totalPages = response.data.total_page;
            if (isMount) {
              setdeviceFailureFiles([...tempData]);
            }
          } else {
            if (isMount) {
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
      .catch((err) => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisLoading(false);
          setisEndRefreshing(false);
          setisRefreshing(false);
        }
      });
  };

  const onEndReached = () => {
    if (preventivReqId) {
      currentPage = currentPage + 1;
      if (currentPage <= totalPages) {
        if (isMount) {
          setisEndRefreshing(true);
        }
        handlegetUploadedImages(preventivReqId, currentPage);
      }
    }
  };

  const onRefresh = () => {
    if (preventivReqId) {
      if (isMount) {
        setisRefreshing(true);
      }
      totalPages = 1;
      currentPage = 1;
      handlegetUploadedImages(preventivReqId, 1);
    }
  };

  const closeViewImageModal = () => {
    setisViewImage({
      status: false,
      uri: "",
    });
  };

  const handleDeleteImage = (val: ImageProps) => {
    if (val.attachmentType && val.attachment_id) {
      handleDeleteAttachment(val.attachment_id);
    } else {
      let tempData = [...deviceFailureFiles].filter(
        (ele) => ele.attachment_id !== val.attachment_id
      );
      setdeviceFailureFiles([...tempData]);
      setSelectedImages((pre) =>
        [...pre]?.filter((ele) => ele?.attachment_id !== val?.attachment_id)
      );
      Toast.success("Attachment deleted successfully");
    }
  };

  const handleDeleteAttachment = (attchmentId: number) => {
    if (isMount) {
      setisLoading(true);
    }
    const formData = new FormData();
    formData.append("token", token);
    formData.append("file_id", attchmentId);

    deleteAttachmentsService(formData)
      .then((res) => {
        const response: DeleteAttachmentApiResposneProps = res.data;
        if (response.status === 1) {
          let tempData = [...deviceFailureFiles].filter(
            (ele) => ele.attachment_id !== attchmentId
          );
          setdeviceFailureFiles([...tempData]);
          Toast.success(response.msg);
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch((err) => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisLoading(false);
        }
      });
  };

  const handleUploadFiles = () => {
    if (isMount) {
      setisLoading(true);
    }
    let tempFileNames = [...selectedImages].map((ele) => ele.file_title);
    const formData = new FormData();
    formData.append("token", token);
    formData.append("preventive_request_id", preventivReqId);
    formData.append("upload_for", 3);
    formData.append("file_title", tempFileNames);
    [...selectedImages].map((ele) => {
      let file = {
        type: ele.type,
        // @ts-ignore
        name: ele.name,
        uri: ele.file,
      };

      formData.append("upload_file", file);
    });

    fileUploadService(formData)
      .then((res) => {
        const response: FileUploadApiResponseProps = res.data;
        if (response.status === 1) {
          Toast.success(response?.msg);
          setSelectedImages([]);
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch((err) => {
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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: 10 }}>
          <TouchableOpacity
            onPress={closeViewImageModal}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <SVGIcon fill="#000" icon="back_arrow" />
            {/* <StyledText style={{fontFamily: FONTS.poppins.medium}}>
              Back
            </StyledText> */}
          </TouchableOpacity>
          <Image
            source={{ uri: isViewImage.uri }}
            style={{ width: WINDOW_WIDTH - 20, height: "100%" }}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    );
  };

  const handleUpdatePreventiveTask = () => {
    dispatch(openLoader(true));
    const data = {
      token,
      comments: ContextValue.values?.comments || "",
      completed_date:
        ContextValue.values?.completedDate &&
        ContextValue.values?.completedDate?.replace("-", "")
          ? `${moment(
              ContextValue.values?.completedDate,
              "YYYY-MM-DD hh:mm A"
            ).format("YYYY-MM-DD HH:mm:ss")}`
          : null,
      expected_completion_date:
        ContextValue.values?.expectedCompletionDate &&
        ContextValue.values?.expectedCompletionDate?.replace("-", "")
          ? `${moment(
              ContextValue.values?.expectedCompletionDate,
              "YYYY-MM-DD hh:mm A"
            ).format("YYYY-MM-DD HH:mm:ss")}`
          : null,
      machine_id: ContextValue.values?.machine?.machine_id || "",
      material_list: [],
      preventive_status: ContextValue.values?.requestStatus?.id || "",
      req_date:
        ContextValue.values?.dateOfReq &&
        ContextValue.values?.dateOfReq?.replace("-", "")
          ? `${moment(ContextValue.values?.dateOfReq, "DD-MM-YYYY").format(
              "YYYY-MM-DD HH:mm:ss"
            )}`
          : null,
      schedule_date:
        ContextValue.values?.scheduleDate &&
        ContextValue.values?.scheduleDate?.replace("-", "")
          ? `${moment(
              ContextValue.values?.scheduleDate,
              "YYYY-MM-DD hh:mm A"
            ).format("YYYY-MM-DD HH:mm:ss")}`
          : null,
      task_list: ContextValue?.values?.selected_tasks?.map((ele) => ({
        task_id: ele?.task_id,
        end_date: moment(ele?.end_date, "YYYY-MM-DD hh:mm A").format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        start_date: moment(ele?.start_date, "YYYY-MM-DD hh:mm A").format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      })),
      request_id: ContextValue.selectedId,
    };

    updatePreventiveTaskService(data)
      .then((res) => {
        if (res?.data?.status) {
          Toast.success(res?.data?.msg);
          navigation.navigate("PreventiveSR", {
            render: true,
          });
        } else {
          Toast.error(res?.data?.msg);
          navigation.navigate("PreventiveSR", {
            render: true,
          });
        }
      })
      .catch((err) => getCatchMessage(err))
      .finally(() => {
        dispatch(openLoader(false));
      });
  };

  return (
    <HOCView
      isEnableKeyboardAware={false}
      headerProps={{
        headerTitle: "Preventive File Upload",
        isEnableMenu: false,
        isRightIconEnable: false,
        onBackPress() {
          navigation.goBack();
        },
      }}
      isLoading={isLoading}
      isEnableScrollView={false}
      secondaryHeaderTitle={
        ContextValue.isView ? "Uploaded Files" : "File Upload"
      }
    >
      <View
        style={{
          flex: 1,
        }}
      >
        {!ContextValue.isView && (
          <TextInputBox
            title="File name"
            placeHolder="Enter file name"
            value={values.deviceFailureFileName}
            onChangeText={handleChange("deviceFailureFileName")}
            errorText={
              errors.deviceFailureFileName && touched.deviceFailureFileName
                ? errors.deviceFailureFileName
                : ""
            }
            textInputProps={{ maxLength: 25 }}
          />
        )}

        <ImageUpload
          isPreventive
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          isShowSelectImage={!ContextValue.isView}
          value={[...deviceFailureFiles]}
          onSelect={(val) => {
            setSelectedImages((prev: ImageProps[]) => [
              ...prev,
              {
                ...val,
                name: val.file_title,
                file_title: values.deviceFailureFileName
                  ? values.deviceFailureFileName
                  : val.file_title,
              },
            ]);
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
            setFieldValue("deviceFailureFileName", "");
          }}
          imgOptions={[...imgOptions]?.filter((ele) => ele?.isVisible)}
          onPressImgOption={(id, val) => {
            if (id === 1) {
              setisViewImage({
                status: true,
                uri: val.file,
              });
            } else if (id === 2) {
              AlertBox({
                alertMsg: "Are you sure that want to delete this image?",
                onPressPositiveButton() {
                  if (val.attachment_id) {
                    handleDeleteImage(val);
                  }
                },
              });
            }
          }}
        />
        {/* <GlobaModal visible={isViewImage.status} onClose={closeViewImageModal}>
          <RenderImageView />
        </GlobaModal> */}
        <Modal
          visible={isViewImage.status}
          onRequestClose={closeViewImageModal}
        >
          <RenderImageView />
        </Modal>

        {!ContextValue.isView && selectedImages?.length > 0 && (
          <CustomButton
            type="secondary"
            onPress={() => {
              if (selectedImages?.length === 0) {
                Toast.error("Selected images are already uploaded!");
                return;
              }
              handleUploadFiles();
            }}
          >
            Upload
          </CustomButton>
        )}
        {!ContextValue.isView && (
          <CustomButton
            style={{
              marginTop: 10,
            }}
            onPress={() => {
              handleUpdatePreventiveTask();
            }}
          >
            Submit
          </CustomButton>
        )}
      </View>
    </HOCView>
  );
};

export default PreventiveFileUploading;

const styles = StyleSheet.create({});
