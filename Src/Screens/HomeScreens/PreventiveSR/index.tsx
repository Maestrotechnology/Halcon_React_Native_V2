import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HOCView from '../../../Components/HOCView';
import {
  deletePreventiveRequestService,
  getPreventiveSRListService,
} from '../../../Services/Services';
import {GetUserPermissions, UseToken} from '../../../Utilities/StoreData';
import {
  PreventiveSRListApiDataProps,
  PreventiveSRListApiProps,
  PreventiveSRListDataProps,
} from '../../../@types/api';
import Toast from '../../../Components/Toast';
import TableView from '../../../Components/TableView';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {openLoader} from '../../../Store/Slices/LoaderSlice';
import {useNavigation} from '@react-navigation/native';
import {ConvertJSONtoFormData} from '../../../Utilities/Methods';
import GlobaModal from '../../../Components/GlobalModal';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
import {PreventivePermissionProps} from '../../../Utilities/Reducertype';
import ServiceRequestListFilterModal from '../../../Modals/Filter/ServiceRequestListFilterModal';
import {
  ServiceRequestFilterDataProps,
  ServiceRequestFilterInitialProp,
} from '../../../@types/modals';
import CustomButton from '../../../Components/CustomButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {usePreventiveRequestContext} from '../../../Utilities/Contexts';
import {CommonStyles} from '../../../Utilities/CommonStyles';
import {requestStatusOptions} from '../../../Utilities/StaticDropdownOptions';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const PreventiveSR = ({route}: any) => {
  const {setselectedId, setIsView} = usePreventiveRequestContext();
  const token = UseToken();
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();
  // @ts-ignore
  // const PreventivePermissions: PreventivePermissionProps =
  //   GetUserPermissions('preventive_sr');
  const navigation: any = useNavigation();
  const [preventiveList, setPreventiveList] = useState<
    PreventiveSRListDataProps[]
  >([]);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePreventiveModal, setDeletePreventiveModal] = useState({
    status: false,
    id: -1,
  });
  const [filterData, setfilterData] =
    useState<ServiceRequestFilterDataProps | null>({
      division: null,
      machine: null,
      reqStatus: route?.params?.preventiveType
        ? [...requestStatusOptions]?.find(
            ele => ele?.id === route?.params?.preventiveType,
          ) || null
        : null,
      sort_type: null,
      work_center: null,
      report_no: '',
      from_date: route?.params?.date ? route?.params?.date?.start_date : '',
      //  moment(new Date()).startOf("month").format("YYYY-MM-DD")
      to_date: route?.params?.date ? route?.params?.date?.end_date : '',
      // moment(new Date()).endOf("month").format("YYYY-MM-DD")
    });
  const [StateFilterData, setStateFilterData] =
    useState<null | ServiceRequestFilterInitialProp>(null);
  const [isShowFilter, setisShowFilter] = useState<boolean>(false);

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;
    if (token) {
      handleGetPreventiveServiceList(1);
      // @ts-ignore
      setfilterData(pre => ({
        ...pre,
        reqStatus:
          [...requestStatusOptions]?.find(
            ele => ele?.id === route?.params?.preventiveType || 0,
          ) || null,
      }));
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [route?.params?.render, token]);

  useEffect(() => {
    if (route) {
      setStateFilterData({
        // @ts-ignore
        type: route?.params?.preventiveType || 0,
      });
    }
  }, [route]);

  const handleGetPreventiveServiceList = (
    page = 1,
    requestStatus = 0,
    data = filterData,
  ) => {
    const formData = new FormData();
    formData.append('token', token);
    if (requestStatus || data?.reqStatus) {
      formData.append(
        'request_status',
        requestStatus ? requestStatus : data?.reqStatus?.id,
      );
    }
    if (data?.machine) {
      formData.append('machine_id', data?.machine.machine_id);
    }
    // if (data?.priority) {
    //   formData.append('priority', data?.priority.id);
    // }

    if (data?.from_date) {
      formData.append('start_date', `${data?.from_date} 00:00`);
    }
    if (data?.to_date) {
      formData.append('end_date', `${data?.to_date} 23:59`);
    }
    if (data?.division) {
      formData.append('division_id', data?.division?.division_id);
    }
    if (route?.params?.preventive_id) {
      formData.append('preventive_id', route?.params?.requestId);
    }

    if (!data && !requestStatus) {
      setStateFilterData(null);
    }

    getPreventiveSRListService(formData, page)
      .then(res => {
        const response: PreventiveSRListApiProps = res.data;
        if (response.status === 1) {
          if (page === 1) {
            totalPages = response.data.total_page;
            if (isMount) {
              setPreventiveList([...response.data.items]);
            }
          } else {
            if (isMount) {
              setPreventiveList(prev => [...prev, ...response.data.items]);
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
        setIsRefreshing(false);
        setIsLoading(false);
        setisEndRefreshing(false);
      });
  };

  const deletePreventiveRequest = () => {
    handleClose();
    dispatch(openLoader(true));
    const data = {
      token: token,
      request_id: deletePreventiveModal?.id,
    };
    deletePreventiveRequestService(ConvertJSONtoFormData(data))
      .then(res => {
        if (res?.data?.status) {
          Toast.success(res?.data?.msg);
          handleGetPreventiveServiceList();
        } else {
          Toast.error(res?.data?.msg);
        }
      })
      .catch(err => getCatchMessage(err))
      .finally(() => {
        dispatch(openLoader(false));
      });
  };

  const getPreventiveList = () => {
    return [...preventiveList]?.map(ele => ({
      ...ele,
      req_date: moment(ele?.req_date).format('YYYY-MM-DD hh:mm A'),
      disableUpdateKey: ele?.request_status === 3 ? true : false,
      disableApprovalIcon: ele?.request_status === 3 ? true : false,
    }));
  };

  const onEndReached = () => {
    currentPage = currentPage + 1;
    if (currentPage <= totalPages) {
      if (isMount) {
        setisEndRefreshing(true);
      }
      handleGetPreventiveServiceList(currentPage);
    }
  };

  const onRefresh = () => {
    totalPages = 1;
    currentPage = 1;
    if (isMount) {
      setIsRefreshing(true);
    }
    handleGetPreventiveServiceList(1);
  };

  const handleClose = () => {
    setDeletePreventiveModal(pre => ({...pre, status: false}));
  };

  const onApplyFilter = (data: ServiceRequestFilterDataProps | null) => {
    if (isMount) {
      setIsLoading(true);
      setfilterData(data);
    }
    handleGetPreventiveServiceList(1, 0, data);
  };

  const closeFilterModal = () => {
    if (isMount) {
      setisShowFilter(false);
    }
  };
  return (
    <HOCView
      isListLoading={isLoading}
      headerProps={{
        headerTitle: 'Preventive Request',
      }}>
      <View
        style={{
          ...CommonStyles.flexRow,
          justifyContent: 'flex-end',
          paddingBottom: 15,
        }}>
        <CustomButton
          onPress={() => {
            setisShowFilter(true);
          }}
          type="secondary"
          style={{
            width: '30%',
            alignSelf: 'flex-end',
            // , marginRight: 8
          }}>
          Filter
        </CustomButton>
        {/* <CustomButton
          onPress={() => {
            navigation.navigate('UpdatePreventiveRequest', {
              type: 4,
            });
          }}
          type="primary"
          style={{alignSelf: 'flex-end', maxWidth: 150}}>
          Add Preventive
        </CustomButton> */}
      </View>

      <View style={{flex: 1, marginBottom: bottom}}>
        <TableView
          dataList={[...getPreventiveList()]}
          rowData={[
            {key: 'equipment_id', label: 'Machine Id'},
            {key: 'machine_name', label: 'Machine Name'},
            {key: 'work_center_name', label: 'Work Center'},
            {key: 'division_description', label: 'Division Id'},
            {key: 'schedule_date', label: 'Request Date'},
            {key: 'request_status_name', label: 'Request Status'},
          ]}
          isActionAvailable
          viewPortColumnDivisionCount={4.5}
          // viewAction
          onEndReached={onEndReached}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
          actionsList={[
            // {
            //   id: 1,
            //   name: 'viewIcon',
            //   width: 20,
            //   isShow: true,
            //   // isShow: PreventivePermissions?.view ? true : false,
            // },
            {
              id: 3,
              name: 'deleteIcon',
              width: 14,
              isShow: true,
              // isShow: PreventivePermissions?.delete ? true : false,
            },
            {
              id: 2,
              name: 'updateIcon',
              width: 16,
              isShow: true,
              disableKey: 'disableUpdateKey',
              // isShow: PreventivePermissions?.update ? true : false,
            },
            {
              id: 4,
              name: 'ApprovalIcon',
              // isShow: ServiceRequestPermissions.update ? true : false,
              isShow: true,
              disableKey: 'disableApprovalIcon',
            },
          ]}
          onActionPress={(type: number, val: PreventiveSRListDataProps) => {
            setselectedId(val?.request_id);

            if (type === 1) {
              setIsView(true);
              navigation.navigate('UpdatePreventiveRequest', {
                type: 1,
                data: val?.request_id,
                preventiveType: 1,
              });
              return;
            } else if (type === 3) {
              setIsView(false);
              setDeletePreventiveModal({
                status: true,
                id: val?.request_id,
              });
              return;
            } else if (type === 4) {
              navigation.navigate('ApprovalStatusList', {
                request_id: val?.request_id,
              });
              return;
            }
            navigation.navigate('UpdatePreventiveRequest', {
              type: type,
              data: val?.request_id,
            });
            setIsView(false);
          }}
        />
      </View>

      {isShowFilter && (
        <GlobaModal
          title="Preventive Request Filter"
          visible={isShowFilter}
          onClose={closeFilterModal}>
          <ServiceRequestListFilterModal
            filterData={filterData}
            onApplyFilter={onApplyFilter}
            onClose={closeFilterModal}
            //@ts-ignore
            initialValue={StateFilterData}
          />
        </GlobaModal>
      )}

      {deletePreventiveModal.status && (
        <GlobaModal
          visible={deletePreventiveModal.status}
          onClose={handleClose}>
          <ConfirmationModal
            onClose={handleClose}
            visible={deletePreventiveModal.status}
            onConfirmPress={deletePreventiveRequest}
            msg="Are you sure you want to delete this preventive request?"
          />
        </GlobaModal>
      )}
    </HOCView>
  );
};

export default PreventiveSR;

const styles = StyleSheet.create({});
