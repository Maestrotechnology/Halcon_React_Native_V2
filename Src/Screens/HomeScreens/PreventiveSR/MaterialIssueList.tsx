import React, {useState} from 'react';
import {View} from 'react-native';
import {renderTitleText} from '../../../Utilities/UiComponents';
import {usePreventiveRequestContext} from '../../../Utilities/Contexts';
import {MaterialListProps} from '../../../@types/context';
import MaterialList from '../ServiceRequest/RequestCreation/MaterialList';
import moment from 'moment';
import {updatePreventiveTaskService} from '../../../Services/Services';
import Toast from '../../../Components/Toast';
import {openLoader} from '../../../Store/Slices/LoaderSlice';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
import {useDispatch} from 'react-redux';
import {UseToken} from '../../../Utilities/StoreData';
import CustomButton from '../../../Components/CustomButton';
import HOCView from '../../../Components/HOCView';
import {useRoute} from '@react-navigation/native';

export default function MaterialissueList({navigation}: any) {
  const route = useRoute<any>();
  const ContextValue = usePreventiveRequestContext();
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState<boolean>(false);
  const token = UseToken();
  const handleUpdatePreventiveTask = () => {
    setisLoading(true);
    dispatch(openLoader(true));
    const data = {
      token,
      comments: ContextValue.values?.comments || '',
      completed_date:
        ContextValue.values?.completedDate &&
        ContextValue.values?.completedDate?.replace('-', '')
          ? `${moment(
              ContextValue.values?.completedDate,
              'YYYY-MM-DD hh:mm A',
            ).format('YYYY-MM-DD HH:mm:ss')}`
          : null,
      expected_completion_date:
        ContextValue.values?.expectedCompletionDate &&
        ContextValue.values?.expectedCompletionDate?.replace('-', '')
          ? `${moment(
              ContextValue.values?.expectedCompletionDate,
              'YYYY-MM-DD hh:mm A',
            ).format('YYYY-MM-DD HH:mm:ss')}`
          : null,
      machine_id: ContextValue.values?.machine?.machine_id || '',
      material_list: ContextValue?.values?.material_list?.map(item => ({
        request_id: item?.material_id?.request_id || 0,
        material_id: item?.material_id?.material_id,
        quantity: item?.quantity,
        material_map_id: item?.material_id?.material_map_id || 0,
      })),
      preventive_status: ContextValue.values?.requestStatus?.id || '',
      req_date:
        ContextValue.values?.dateOfReq &&
        ContextValue.values?.dateOfReq?.replace('-', '')
          ? `${moment(ContextValue.values?.dateOfReq, 'DD-MM-YYYY').format(
              'YYYY-MM-DD HH:mm:ss',
            )}`
          : null,
      schedule_date:
        ContextValue.values?.scheduleDate &&
        ContextValue.values?.scheduleDate?.replace('-', '')
          ? `${moment(
              ContextValue.values?.scheduleDate,
              'YYYY-MM-DD hh:mm A',
            ).format('YYYY-MM-DD HH:mm:ss')}`
          : null,
      task_list: ContextValue?.values?.selected_tasks?.map(ele => ({
        id: ele?.task_id,
        end_date: moment(ele?.end_date, 'YYYY-MM-DD hh:mm A').format(
          'YYYY-MM-DD HH:mm:ss',
        ),
        start_date: moment(ele?.start_date, 'YYYY-MM-DD hh:mm A').format(
          'YYYY-MM-DD HH:mm:ss',
        ),
      })),
      request_id: ContextValue.selectedId,
    };

    updatePreventiveTaskService(data)
      .then(res => {
        if (res?.data?.status) {
          Toast.success(res?.data?.msg);
          navigation.navigate('PreventiveSR', {
            render: true,
          });
        } else {
          Toast.error(res?.data?.msg);
          navigation.navigate('PreventiveSR', {
            render: true,
          });
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => {
        setisLoading(false);
        dispatch(openLoader(false));
      });
  };
  return (
    <HOCView
      isEnableKeyboardAware={false}
      headerProps={{
        headerTitle: 'Preventive Material issue',
        isEnableMenu: false,
        isRightIconEnable: false,
        onBackPress() {
          navigation.goBack();
        },
      }}
      isLoading={isLoading}
      isEnableScrollView={false}>
      <View style={{flex: 1}}>
        {renderTitleText('Material issue')}
        {!ContextValue?.isView && (
          <MaterialList
            isEditable={!ContextValue?.isView}
            handleAddMeterialList={(materialItem: MaterialListProps) => {
              ContextValue.setFieldValue('material_list', [
                ...ContextValue?.values?.material_list,
                materialItem,
              ]);
            }}
            CheckisEditable={!ContextValue.isView}
            contextValue={ContextValue}
          />
        )}
      </View>
      {!ContextValue.isView &&
        route?.params?.isFrom === 'PreventiveFileUploading' && (
          <CustomButton
            style={{
              marginTop: 10,
            }}
            onPress={() => {
              handleUpdatePreventiveTask();
            }}>
            Update
          </CustomButton>
        )}
    </HOCView>
  );
}
