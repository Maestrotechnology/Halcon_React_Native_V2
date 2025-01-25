import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UpdatePreventiveRequest from "../Screens/HomeScreens/PreventiveSR/UpdatePreventiveRequest";
import PreventiveSR from "../Screens/HomeScreens/PreventiveSR";
import { PreventiveSRStackParamList } from "../@types/navigation";
import PreventiveFileUploading from "../Screens/HomeScreens/PreventiveSR/PreventiveFileUploading";
import { PreventiveRequestUpdateContext } from "../Utilities/Contexts";
import {
  PreventiveViewApiDataProps,
  PreventiveViewSelectedTaskProps,
} from "../@types/api";
import PreventiveTasks from "../Screens/HomeScreens/PreventiveSR/PreventiveTasks";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import AssignTasks from "../Screens/HomeScreens/PreventiveSR/AssignTasks";
import { PreventiveRequestFormikDataProps } from "../@types/context";
import moment from "moment";

const Stack = createNativeStackNavigator<PreventiveSRStackParamList>();

const PreventiveSRStatck = ({ route }: any) => {
  const navigation: any = useNavigation();
  const [preventiveViewData, setPreventiveViewData] =
    useState<PreventiveViewApiDataProps | null>(null);
  const [selectedId, setselectedId] = useState<number | null>(null);
  const [isView, setIsView] = useState(false);

  const defaultValues: PreventiveRequestFormikDataProps = {
    machine: null,
    requestStatus: null,
    dateOfReq: moment().format("DD-MM-YYYY"),
    scheduleDate: "",
    expectedCompletionDate: "",
    completedDate: "",
    comments: "",
    selected_tasks: [],
  };
  const validationSchema = yup.object().shape({
    selected_tasks: yup.array().of(
      yup.object().shape({
        start_date: yup
          .string()
          .required("* Start Date is required")
          .test(
            "start_date",
            "Start date should be greater than end date",
            function (value) {
              const { end_date } = this.parent;

              if (
                moment(value, "YYYY-MM-DD hh:mm A").isAfter(
                  moment(end_date, "YYYY-MM-DD hh:mm A")
                )
              ) {
                return false;
              }
              return true;
            }
          ),
        end_date: yup.string().required("* End Date is required"),
      })
    ),
  });

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
  } = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    validateOnChange: true,
    onSubmit(values) {
      navigation.navigate("PreventiveFileUpload", {
        preventiveId: selectedId,
        isView:
          route?.params?.preventiveType === 1 ||
          preventiveViewData?.request_status === 3,
      });
    },
  });

  const updatePreventiveValues = {
    preventiveViewData,
    setPreventiveViewData,
    type: route?.params?.preventiveType,
    selectedId,
    setselectedId,
    values,
    touched,
    errors,
    setFieldValue,
    handleSubmit,
    setValues,
    isView,
    setIsView,
  };
  return (
    <PreventiveRequestUpdateContext.Provider value={updatePreventiveValues}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          // @ts-ignore
          initialParams={{
            preventiveType: route?.params?.preventiveType,
            date: route?.params?.date,
          }}
          name="PreventiveSR"
          component={PreventiveSR}
        />
        <Stack.Screen
          name="UpdatePreventiveRequest"
          component={UpdatePreventiveRequest}
        />
        <Stack.Screen name="PreventiveTasks" component={PreventiveTasks} />
        <Stack.Screen name="AssignTasks" component={AssignTasks} />
        <Stack.Screen
          name="PreventiveFileUpload"
          component={PreventiveFileUploading}
        />
      </Stack.Navigator>
    </PreventiveRequestUpdateContext.Provider>
  );
};

export default PreventiveSRStatck;

const styles = StyleSheet.create({});
