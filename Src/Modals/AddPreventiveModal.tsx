import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import DateTimePicker from '../Components/DateTimePicker';
import TextInputBox from '../Components/TextInputBox';
import DropdownBox from '../Components/DropdownBox';
import {
  DeviceStatusProps,
  requestStatusOptions,
} from '../Utilities/StaticDropdownOptions';
import {useFormik} from 'formik';
import {COLORS, bigInputBoxStyle} from '../Utilities/Constants';
import moment from 'moment';
import {
  ConvertJSONtoFormData,
  secondsToHourMinutes,
} from '../Utilities/Methods';
import CustomButton from '../Components/CustomButton';
import * as Yup from 'yup';
import {
  createPreventiveTaskService,
  editPreventiveTaskService,
} from '../Services/Services';
import {UseToken} from '../Utilities/StoreData';
import Toast from '../Components/Toast';
import {getCatchMessage} from '../Utilities/GeneralUtilities';
import {openLoader} from '../Store/Slices/LoaderSlice';
import {useDispatch} from 'react-redux';
import {PreventiveTaskListProps} from '../@types/api';
import StyledText from '../Components/StyledText';

export type AddPreventiveProp = {
  start_date: string;
  end_date: string;
  total_hours: string;
  preventive_status: null | DeviceStatusProps;
  comments: string;
};
const AddPreventiveModal = ({
  preventive_request_id,
  onClose,
  updateData,
  data,
  isView,
}: {
  preventive_request_id: number;
  onClose: () => void;
  updateData: () => void;
  data: PreventiveTaskListProps;
  isView: boolean;
}) => {
  const token = UseToken();
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    start_date: Yup.string().required('* Start date is required'),
    end_date: Yup.string()
      .required('* End date is required')
      .test(
        'end Date',
        '* End date must be after start date',
        function (value) {
          const {start_date} = this.parent;
          if (start_date && value) {
            if (
              moment(start_date, 'YYYY-MM-DD hh:mm A')?.isAfter(
                moment(value, 'YYYY-MM-DD hh:mm A'),
              )
            ) {
              return false;
            }
            return true;
          }
          return true;
        },
      ),
    preventive_status: Yup.mixed()
      .transform(val => (val ? val : undefined))
      .required('* Preventive status is required'),
  });
  const defaultValues: AddPreventiveProp = {
    start_date: data?.startDatetime ? data?.startDatetime : '',
    end_date: data?.endDatetime ? data?.endDatetime : '',
    total_hours: data?.totalDuration ? `${data?.totalDuration} hours` : '0',
    preventive_status:
      data?.service_status && typeof data?.service_status === 'string'
        ? [...requestStatusOptions]?.find(
            ele => ele?.name === data?.service_status,
          ) || null
        : null,
    comments: data?.comment ? data?.comment : '',
  };
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
    onSubmit(values) {
      onClose();
      handlePreventiveTask();
    },
  });
  useEffect(() => {
    if (values.start_date && values.end_date) {
      const getHoursMinutes = secondsToHourMinutes(
        (
          moment(values.end_date, 'YYYY-MM-DD hh:mm A').diff(
            moment(values.start_date, 'YYYY-MM-DD hh:mm A'),
            'minutes',
          ) * 60
        )?.toString(),
      );

      setFieldValue(
        'total_hours',
        `${getHoursMinutes?.hours} hours ${getHoursMinutes?.minutes} minutes`,
      );
    } else {
      setFieldValue('total_hours', '0 hours');
    }
  }, [values.start_date, values.end_date]);

  const handlePreventiveTask = () => {
    dispatch(openLoader(true));
    const requestdata = {
      token: token,
      preventive_id: preventive_request_id,
      started_at: values.start_date
        ? moment(values.start_date, 'YYYY-MM-DD hh:mm A').format(
            'YYYY-MM-DD HH:mm',
          )
        : '',
      end_at: values.end_date
        ? moment(values.end_date, 'YYYY-MM-DD hh:mm A').format(
            'YYYY-MM-DD HH:mm',
          )
        : '',
      service_status: values.preventive_status?.id,
      comment: values.comments,
      totalHours: values.total_hours
        ? `${values.total_hours?.split(' ')?.[0]}.${Math.floor(
            (parseInt(values.total_hours?.split(' ')?.[2]) / 60) * 100,
          )}`
        : '',
    };
    const PreventiveTask = data
      ? editPreventiveTaskService(
          ConvertJSONtoFormData({
            ...requestdata,
            preventive_task_id: data?.taskId,
          }),
        )
      : createPreventiveTaskService(ConvertJSONtoFormData(requestdata));
    PreventiveTask.then(res => {
      if (res?.data?.status) {
        Toast.success(res?.data?.msg);
        updateData();
      }
    })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => {
        dispatch(openLoader(false));
      });
  };
  return (
    <View>
      {isView ? (
        <View>
          <View style={styles.textContainer}>
            <StyledText style={styles.headerText}>{`Start Date : `}</StyledText>
            <StyledText>
              {data?.startDatetime ? `${data?.startDatetime}` : '-'}
            </StyledText>
          </View>
          <View style={styles.textContainer}>
            <StyledText style={styles.headerText}>{`End Date : `}</StyledText>
            <StyledText>
              {data?.endDatetime ? `${data?.endDatetime}` : '-'}
            </StyledText>
          </View>
          <View style={styles.textContainer}>
            <StyledText
              style={styles.headerText}>{`Total Hours : `}</StyledText>
            <StyledText>
              {data?.totalDuration ? `${data?.totalDuration} hours` : '-'}
            </StyledText>
          </View>
          <View style={styles.textContainer}>
            <StyledText
              style={styles.headerText}>{`Preventive Status : `}</StyledText>
            <StyledText>
              {data?.service_status ? `${data?.service_status}` : '-'}
            </StyledText>
          </View>
          <View style={{...styles.textContainer, paddingBottom: 0}}>
            <StyledText style={styles.headerText}>{`Comments : `}</StyledText>
            <StyledText>{data?.comment ? `${data?.comment}` : '-'}</StyledText>
          </View>
        </View>
      ) : (
        <>
          <DateTimePicker
            mode="datetime"
            format="YYYY-MM-DD hh:mm A"
            title="Start Date"
            value={values.start_date}
            onSelect={date => {
              setFieldValue('start_date', date);
            }}
            errorText={
              errors?.start_date && touched.start_date ? errors?.start_date : ''
            }
            minimumDate={new Date()}
          />
          <DateTimePicker
            mode="datetime"
            format="YYYY-MM-DD hh:mm A"
            title="End Date"
            value={values.end_date}
            onSelect={date => {
              setFieldValue('end_date', date);
            }}
            errorText={
              errors?.end_date && touched.end_date ? errors?.end_date : ''
            }
            minimumDate={
              values.start_date
                ? new Date(
                    moment(values.start_date, 'YYYY-MM-DD hh:mm A').format(
                      'YYYY-MM-DD',
                    ),
                  )
                : new Date()
            }
          />
          <TextInputBox
            title="Total Hours"
            value={values.total_hours}
            placeHolder="Total hours"
            onChangeText={handleChange('total_hours')}
            textInputProps={{
              readOnly: true,
            }}
          />
          <DropdownBox
            title="Preventive Status"
            isRequired
            options={[...requestStatusOptions]}
            value={values.preventive_status}
            placeHolder="Select preventive status"
            onSelect={val => {
              setFieldValue('preventive_status', val);
            }}
            type="miniList"
            fieldName="name"
            onIconPress={() => {
              setFieldValue('preventive_status', null);
            }}
            errorText={
              errors.preventive_status && touched.preventive_status
                ? errors.preventive_status
                : ''
            }
          />
          <TextInputBox
            title="Comments"
            value={values.comments}
            placeHolder="Comments"
            onChangeText={handleChange('comments')}
            textInputProps={{
              ...bigInputBoxStyle,
            }}
            customInputBoxContainerStyle={{
              height: 130,
              backgroundColor: COLORS.white,
            }}
          />
          <CustomButton onPress={handleSubmit}>Submit</CustomButton>
        </>
      )}
    </View>
  );
};

export default AddPreventiveModal;

const styles = StyleSheet.create({
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  headerText: {
    fontWeight: '700',
  },
});
