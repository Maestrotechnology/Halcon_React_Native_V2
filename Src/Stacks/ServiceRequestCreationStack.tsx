import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ServiceRequestCreationScreensNavigationProps,
  ServiceRequestCreationStackParamList,
  ServiceRequestStackParamList,
} from "../@types/navigation";
import TaskDetails from "../Screens/HomeScreens/ServiceRequest/RequestCreation/TaskDetails";
import FileUploading from "../Screens/HomeScreens/ServiceRequest/RequestCreation/FileUploading";
import DeviceFailreInfo from "../Screens/HomeScreens/ServiceRequest/RequestCreation/DeviceFailreInfo";
import { useFormik } from "formik";
import moment from "moment";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ServiceRequestCreationContext } from "../Utilities/Contexts";
import * as Yup from "yup";
import { GetUserData, UseToken } from "../Utilities/StoreData";
import { ServiceRequestFormikDataProps } from "../@types/context";
import {
  closeWorkService,
  createServiceRequestService,
  fileUploadService,
  updateServiceRequestService,
  viewServiceRequestService,
  workStartService,
} from "../Services/Services";
import Toast from "../Components/Toast";
import Loader from "../Components/Loader";
import {
  CloseWorkServiceApiResposneProps,
  CreateServiceReqApiResponseProps,
  FileUploadApiResponseProps,
  ViewServiceRequestApiResponseProps,
  WorkStartApiResposneProps,
} from "../@types/api";
import { ImageProps } from "../@types/general";
import CreateTask from "../Screens/HomeScreens/ServiceRequest/RequestCreation/CreateTask";
import GlobaModal from "../Components/GlobalModal";
import ConfirmationModal from "../Modals/ConfirmationModal";
import {
  MACHINE_WORK_STATUS,
  SHIFT_OPTIONS,
  deviceStatusOptions,
  priorityLevelOptions1,
  requestStatusOptions,
} from "../Utilities/StaticDropdownOptions";

var isMount = true;

const deviceFailureSchema = Yup.object().shape({
  machine: Yup.object().nullable().required("Machine is required"),
  // dateOfErrorOccured: Yup.string().required(
  //   'Date of error occured is required',
  // ),
  deviceStatus: Yup.object().nullable().required("Machine Status is required"),
  reqStatus: Yup.object().nullable().required("Request Status is required"),
  // priorityLevel: Yup.object().nullable().required('Priority level is required'),
});

const Stack =
  createNativeStackNavigator<ServiceRequestCreationStackParamList>();
const ServiceRequestCreationStack = ({
  navigation,
}: ServiceRequestCreationScreensNavigationProps) => {
  const route =
    useRoute<
      RouteProp<
        ServiceRequestStackParamList,
        keyof ServiceRequestStackParamList
      >
    >();
  const token = UseToken();
  const userData = GetUserData();
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [activeTab, setactiveTab] = useState(1);
  const [deviceFailureFiles, setdeviceFailureFiles] = useState<ImageProps[]>(
    []
  );
  const [taskDetailsFiles, settaskDetailsFiles] = useState<ImageProps[]>([]);
  const [closeServiceConfirmation, setCloseServiceConfirmation] =
    useState(false);

  useEffect(() => {
    isMount = true;
    if (!route.params?.isCreate && route.params?.serviceReqData?.request_id) {
      handleGetServiceRequestDetails(route.params?.serviceReqData?.request_id);
    }
    return () => {
      isMount = false;
    };
  }, []);

  const {
    handleChange,
    handleSubmit,
    errors,
    touched,
    values,
    setFieldValue,
    isSubmitting,
    setSubmitting,
    setValues,
  } = useFormik<ServiceRequestFormikDataProps>({
    initialValues: {
      machine: null,
      employee: null,
      dateOfErrorOccured: "",
      dateOfReq: moment().format("DD-MM-YYYY"),
      scheduleDate: "",
      serviceStartedDate: "",
      deviceStatus: null,
      priorityLevel: null,
      reqStatus: null,
      expectedCompletedDate: "",
      shift: null,
      msgOnDisplay: "",
      comments: "",
      deviceFailureFileName: "",
      serviceCompletedDate: "",
      operatorName: "",
      operatorId: "",
      machineStatusWhileAlarm: null,
      service_team_commments: "",
      report_no: "",
      problem_description: "",
      pending_reason: "",
    },
    validationSchema: deviceFailureSchema,
    onSubmit(values) {
      if (activeTab === 1) {
        setactiveTab(2);
        navigation.navigate("FileUploading", {
          isFrom: "deviceFailure",
        });
      } else if (activeTab === 2 && route.params?.isCreate) {
        handleCreateServiceRequest(values);
      } else if (activeTab === 2 && route.params?.isUpdate) {
        handleUpdateServiceRequest(values);
      } else if (
        activeTab === 2 &&
        route.params?.isServiceUpdate &&
        !values.serviceStartedDate
      ) {
        // handleStartService();
        navigation.navigate("TaskDetails");
      } else if (
        activeTab === 2 &&
        (route.params?.isServiceUpdate || route.params?.isView) &&
        values.serviceStartedDate
      ) {
        navigation.navigate("TaskDetails");
      } else if (activeTab === 2 && route.params?.isView) {
        navigation.navigate("TaskDetails");
      } else if (activeTab === 4) {
        handleUpdateServiceRequest(values, true);
        // setCloseServiceConfirmation(true);
      }
    },
  });

  const getCreateOrUpdateServiceRequestFormData = (
    data: ServiceRequestFormikDataProps
  ) => {
    const formData = new FormData();
    formData.append("token", token);
    if (route.params?.isUpdate && route.params?.serviceReqData?.request_id) {
      formData.append("request_id", route.params?.serviceReqData?.request_id);
    }
    formData.append("machineId", data.machine?.machine_id);
    formData.append("deviceStatus", data.deviceStatus?.id);
    formData.append(
      "requested_date",
      moment(data.dateOfReq, "DD-MM-YYYY").format("YYYY-MM-DD HH:mm:ss")
    );
    formData.append(
      "error_occurred",
      moment(data.dateOfErrorOccured, "YYYY-MM-DD hh:mm A").format(
        "YYYY-MM-DD hh:mm:ss"
      )
    );
    formData.append("priority_level", data.priorityLevel?.id);
    formData.append("issue_description", data.msgOnDisplay);
    formData.append(
      "estimated_resolution_time",
      data.scheduleDate
        ? moment(data.scheduleDate, "YYYY-MM-DD hh:mm A").format(
            "YYYY-MM-DD hh:mm:ss"
          )
        : ""
    );
    formData.append("issue_comment", data.comments);
    return formData;
  };

  const handleGetServiceRequestDetails = (serviceReqId: number) => {
    if (isMount) {
      setisLoading(true);
    }
    const formData = new FormData();
    formData.append("token", token);
    formData.append("request_id", serviceReqId);
    viewServiceRequestService(formData)
      .then((res) => {
        const response: ViewServiceRequestApiResponseProps = res.data;

        if (response.status === 1) {
          const {
            machine_id,
            machine_name,
            date_of_error_occur,
            requested_date,
            schedule_date,
            start_date,
            machine_status,
            machine_status_name,
            error_message_alarm,
            service_team_comments,
            completed_date,
            expected_completion_date,
            machine_status_at_alarm,
            operator_id,
            operator_name,
            request_status,
            shift,
            requested_comments,
            work_description,
            report_no,
            technician_name,
            technician_id,
            problem_description,
            availablity_reason,
            priority,
            ...restData
          } = response.data;
          setValues({
            ...values,
            machine: {
              machine_id: machine_id,
              machine_name: machine_name,
            },
            dateOfErrorOccured:
              moment(date_of_error_occur).format("YYYY-MM-DD hh:mm A"),
            dateOfReq: moment(requested_date).format("DD-MM-YYYY"),
            scheduleDate: schedule_date
              ? moment(schedule_date).format("YYYY-MM-DD hh:mm A")
              : "",
            serviceStartedDate: start_date
              ? moment(start_date).format("YYYY-MM-DD hh:mm A")
              : "",
            deviceStatus: {
              id: machine_status,
              name: machine_status_name,
            },
            priorityLevel: priority
              ? [...priorityLevelOptions1]?.find(
                  (ele) => ele?.id === priority
                ) || null
              : null,
            msgOnDisplay: error_message_alarm || "",
            comments: requested_comments || "",
            serviceCompletedDate: completed_date
              ? moment(completed_date).format("YYYY-MM-DD hh:mm A")
              : "",
            deviceFailureFileName: "",
            expectedCompletedDate: expected_completion_date
              ? moment(expected_completion_date).format("YYYY-MM-DD hh:mm A")
              : "",
            machineStatusWhileAlarm: machine_status_at_alarm
              ? [...MACHINE_WORK_STATUS]?.find(
                  (ele) => ele?.id === machine_status_at_alarm
                ) || null
              : null,
            operatorId: operator_id || "",
            operatorName: operator_name || "",
            reqStatus:
              [...requestStatusOptions]?.find(
                (ele) => ele?.id === request_status
              ) || null,
            shift: [...SHIFT_OPTIONS]?.find((ele) => ele?.id === shift) || null,
            service_team_commments: service_team_comments || "",
            report_no: report_no || "",
            employee: technician_id
              ? {
                  name: technician_name,
                  user_id: technician_id,
                }
              : null,
            problem_description: problem_description || "",
            pending_reason: availablity_reason || "",
          });
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

  const handleStartService = () => {
    if (isMount) {
      setisLoading(true);
    }
    const formData = new FormData();
    formData.append("token", token);
    if (route.params?.serviceReqData?.request_id) {
      formData.append("request_id", route.params?.serviceReqData?.request_id);
    }
    workStartService(formData)
      .then((res) => {
        const response: WorkStartApiResposneProps = res.data;
        if (response.status === 1) {
          Toast.success(response.msg);
          setValues({
            ...values,
            serviceStartedDate: moment().format("YYYY-MM-DD HH:mm A"),
          });
          navigation.navigate("TaskDetails");
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

  const handleUpdateServiceRequest = (
    data: ServiceRequestFormikDataProps,
    serviceUpdate = false
  ) => {
    if (isMount) {
      setisLoading(true);
    }
    const payload = {
      token,
      machine_id: values?.machine?.machine_id || 0,
      request_id: route.params?.serviceReqData?.request_id,
      report_no: values?.report_no || "",
      request_status: values?.reqStatus?.id || 0,
      // location: '',
      date_of_error_occur: values?.dateOfErrorOccured
        ? moment(values?.dateOfErrorOccured, "YYYY-MM-DD hh:mm A").format(
            "YYYY-MM-DD HH:mm:ss"
          )
        : null,
      // shift: values?.shift?.id || 0,
      // failure_time: '',
      machine_status: values?.deviceStatus?.id || 0,
      // operator_id: values?.operatorId || '',
      // operator_name: values?.operatorName || '',
      employee_id: values?.employee?.user_id || "",
      // machine_status_at_alarm: values?.machineStatusWhileAlarm?.id || 0,
      error_message_alarm: values?.msgOnDisplay || "",
      requested_date: values?.dateOfReq
        ? moment(values?.dateOfReq, "DD-MM-YYYY").format("YYYY-MM-DD HH:mm:ss")
        : null,
      // division_id: 0,
      requested_comments: values?.comments || "",
      // schedule_date: values?.scheduleDate
      //   ? moment(values?.scheduleDate, "YYYY-MM-DD hh:mm A").format(
      //       "YYYY-MM-DD HH:mm:ss"
      //     )
      //   : null,
      expected_completion_date: values?.expectedCompletedDate
        ? moment(values?.expectedCompletedDate, "YYYY-MM-DD hh:mm A").format(
            "YYYY-MM-DD HH:mm:ss"
          )
        : null,
      for_edit: serviceUpdate ? 2 : 1,
      service_team_comments: values?.service_team_commments || "",
      material_list: [],
      problem_description: values?.problem_description || "",
      availablity_reason: values?.pending_reason || "",
      priority: values?.priorityLevel?.id,
    };

    updateServiceRequestService(payload)
      .then((res) => {
        const response: CreateServiceReqApiResponseProps = res.data;

        if (response.status === 1) {
          if (
            route.params?.serviceReqData?.request_id &&
            !serviceUpdate &&
            deviceFailureFiles?.filter((ele) => ele?.attachment_id)?.length > 0
          ) {
            handleUploadFiles(route.params?.serviceReqData?.request_id);
          } else {
            Toast.success(response?.msg);
            navigation.reset({
              routes: [{ name: "ServiceRequest" }],
            });
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
        }
      });
  };

  const handleCreateServiceRequest = (data: ServiceRequestFormikDataProps) => {
    if (isMount) {
      setisLoading(true);
    }
    const payload = {
      token,
      machine_id: values?.machine?.machine_id || 0,
      // report_no: '',
      request_status: values?.reqStatus?.id || 0,
      // location: '',
      date_of_error_occur: values?.dateOfErrorOccured
        ? moment(values?.dateOfErrorOccured, "YYYY-MM-DD hh:mm A").format(
            "YYYY-MM-DD HH:mm:ss"
          )
        : null,
      // shift: values?.shift?.id || 0,
      // failure_time: '',
      machine_status: values?.deviceStatus?.id || 0,
      // operator_id: values?.operatorId || '',
      // operator_name: values?.operatorName || '',
      // employee_id: userData.user_id,
      employee_id: values?.employee?.user_id || "",
      // machine_status_at_alarm: values?.machineStatusWhileAlarm?.id || 0,
      error_message_alarm: values?.msgOnDisplay || "",
      requested_date: values?.dateOfReq
        ? moment(values?.dateOfReq, "DD-MM-YYYY").format("YYYY-MM-DD HH:mm:ss")
        : null,
      // division_id: 0,
      // requested_comments: values?.comments || "",
      // schedule_date: values?.scheduleDate
      //   ? moment(values?.scheduleDate, "YYYY-MM-DD hh:mm A").format(
      //       "YYYY-MM-DD HH:mm:ss"
      //     )
      //   : null,
      expected_completion_date: values?.expectedCompletedDate
        ? moment(values?.expectedCompletedDate, "YYYY-MM-DD hh:mm A").format(
            "YYYY-MM-DD HH:mm:ss"
          )
        : null,
      requested_comments: values?.comments || "",
      // availablity_reason: values?.pending_reason || "",
      priority: values?.priorityLevel?.id,
    };

    createServiceRequestService(payload)
      .then((res) => {
        const response: CreateServiceReqApiResponseProps = res.data;

        if (response.status === 1) {
          handleUploadFiles(response.request_id);
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

  const handleCloseService = () => {
    if (isMount) {
      setisLoading(true);
    }
    const formData = new FormData();
    formData.append("token", token);
    if (route.params?.serviceReqData?.request_id) {
      formData.append("request_id", route.params?.serviceReqData?.request_id);
    }

    closeWorkService(formData)
      .then((res) => {
        const response: CloseWorkServiceApiResposneProps = res.data;
        if (response.status === 1) {
          Toast.success(response.msg);
          navigation.reset({
            routes: [{ name: "ServiceRequest" }],
          });
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

  const handleUploadFiles = (reqId: number) => {
    if (isMount) {
      setisLoading(true);
    }
    let tempFileNames = [...deviceFailureFiles]
      .filter((element) => !element?.attachmentType)
      .map((ele) => ele.file_title);
    const formData = new FormData();
    formData.append("token", token);
    formData.append("request_id", reqId);
    formData.append("upload_for", 1);
    formData.append("file_title", tempFileNames);

    [...deviceFailureFiles]
      .filter((element) => element?.attachment_id)
      .map((ele) => {
        let file = {
          type: ele.type,
          name: ele.file_title,
          uri: ele.file,
        };

        formData.append("upload_file", file);
      });
    fileUploadService(formData)
      .then((res) => {
        const response: FileUploadApiResponseProps = res.data;
        if (response.status === 1) {
          Toast.success(
            `Service request ${
              route.params?.isUpdate ? "updated" : "created"
            } successfully!`
          );
          navigation.reset({
            routes: [{ name: "ServiceRequest" }],
          });
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

  const handleCloseConfirmation = () => setCloseServiceConfirmation(false);

  const ServiceRequestDetails = {
    values,
    errors,
    touched,
    isSubmitting,
    setSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    setactiveTab,
    setValues,
    isCreate: route.params?.isCreate ?? false,
    isView: route.params?.isView ?? false,
    isUpdate: route.params?.isUpdate ?? false,
    deviceFailureFiles,
    setdeviceFailureFiles,
    serviceReqId: route.params?.serviceReqData?.request_id ?? null,
    isServiceUpdate: route.params?.isServiceUpdate ?? false,
    activeTab,
    settaskDetailsFiles,
    taskDetailsFiles,
  };

  return (
    <ServiceRequestCreationContext.Provider value={ServiceRequestDetails}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="DeviceFailreInfo" component={DeviceFailreInfo} />
        <Stack.Screen name="FileUploading" component={FileUploading} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} />
        <Stack.Screen name="CreateTask" component={CreateTask} />
        <Stack.Screen
          name="TaskDetailsFileUploading"
          component={FileUploading}
        />
      </Stack.Navigator>
      <Loader isVisible={isLoading} />
      {closeServiceConfirmation ? (
        <GlobaModal
          visible={closeServiceConfirmation}
          onClose={handleCloseConfirmation}
        >
          <ConfirmationModal
            visible={closeServiceConfirmation}
            onClose={handleCloseConfirmation}
            failureText="OnGoing"
            successText="Close"
            msg="Are you sure you want to close this service completely or still working on it?"
            onCancelPress={() => {
              navigation.reset({
                routes: [{ name: "ServiceRequest" }],
              });
            }}
            onConfirmPress={handleCloseService}
          />
        </GlobaModal>
      ) : null}
    </ServiceRequestCreationContext.Provider>
  );
};

export default ServiceRequestCreationStack;

const styles = StyleSheet.create({});
