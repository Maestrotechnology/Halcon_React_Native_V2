import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HOCView from '../../../Components/HOCView';
import {UseToken} from '../../../Utilities/StoreData';
import {
  deleteServiceRequestService,
  exportServiceRequestService,
  getServiceRequestListService,
} from '../../../Services/Services';
import Toast from '../../../Components/Toast';
import {
  DeleteServiceRequestApiResposneProps,
  ServiceRequestItemsProps,
  ServiceRequestListApiResponseProps,
} from '../../../@types/api';
import TableView from '../../../Components/TableView';
import {ItemKeyListProps, actionListProps} from '../../../Components/types';
import {
  downloadPdf,
  getCatchMessage,
} from '../../../Utilities/GeneralUtilities';
import {FONTSIZES} from '../../../Utilities/Constants';
import CustomButton from '../../../Components/CustomButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  ServiceRequestFilterDataProps,
  ServiceRequestFilterInitialProp,
} from '../../../@types/modals';
import GlobaModal from '../../../Components/GlobalModal';
import ServiceRequestListFilterModal from '../../../Modals/Filter/ServiceRequestListFilterModal';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import {CommonStyles} from '../../../Utilities/CommonStyles';
import moment from 'moment';
import {ConvertJSONtoFormData} from '../../../Utilities/Methods';
import {useDispatch} from 'react-redux';
import {openLoader} from '../../../Store/Slices/LoaderSlice';
import {useIsFocused, useRoute} from '@react-navigation/native';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const ServiceRequest = ({navigation, route}: any) => {
  const token = UseToken();
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const isFoucused = useIsFocused();
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [serviceRequestList, setserviceRequestList] = useState<
    ServiceRequestItemsProps[]
  >([]);
  const [actionsList, setActionList] = useState<actionListProps[]>([
    // {
    //   id: 1,
    //   name: 'viewIcon',
    //   width: 22,
    //   // isShow: ServiceRequestPermissions.view ? true : false,
    //   isShow: true,
    // },
    {
      id: 4,
      name: 'deleteIcon',
      // isShow: ServiceRequestPermissions.delete ? true : false,
      isShow: true,
    },
    {
      id: 3,
      name: 'editIcon',
      // isShow: ServiceRequestPermissions.edit ? true : false,
      isShow: true,
      disableKey: 'disableEditIcon',
    },
    {
      id: 2,
      name: 'updateIcon',
      // isShow: ServiceRequestPermissions.update ? true : false,
      isShow: true,
      disableKey: 'disableUpdateIcon',
    },
    {
      id: 5,
      name: 'ApprovalIcon',
      // isShow: ServiceRequestPermissions.update ? true : false,
      isShow: true,
      disableKey: 'disableApprovalIcon',
    },
  ]);
  const [filterData, setfilterData] =
    useState<ServiceRequestFilterDataProps | null>({
      machine: route?.params?.machineId
        ? {
            // @ts-ignore
            machine_id: route?.params?.machineId || '',
            machine_name: '',
          }
        : null,
      sort_type: null,
      reqStatus: route?.params?.serviceType
        ? {
            // @ts-ignore
            id: route?.params?.serviceType || '',
            name: '',
          }
        : null,
      division: null,
      work_center: null,
      from_date: route?.params?.date
        ? route?.params?.date?.start_date
        : moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD'),
      to_date: route?.params?.date
        ? route?.params?.date?.end_date
        : moment(new Date()).format('YYYY-MM-DD'),
    });
  const [StateFilterData, setStateFilterData] =
    useState<null | ServiceRequestFilterInitialProp>(null);
  const [isShowFilter, setisShowFilter] = useState<boolean>(false);
  const [isShowDelete, setIsShowDelete] = useState({
    id: -1,
    status: false,
  });

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;

    if (token) {
      let filterDatas = {
        machine: route?.params?.machineId
          ? {
              // @ts-ignore
              machine_id: route?.params?.machineId || '',
              machine_name: '',
            }
          : null,
        sort_type: null,
        reqStatus: route?.params?.serviceType
          ? {
              // @ts-ignore
              id: route?.params?.serviceType || '',
              name: '',
            }
          : null,
        division: null,
        work_center: null,
        from_date: route?.params?.date
          ? route?.params?.date?.start_date
          : moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD'),
        to_date: route?.params?.date
          ? route?.params?.date?.end_date
          : moment(new Date()).format('YYYY-MM-DD'),
      };
      handleGetServiceRequestList(1, filterDatas);

      setfilterData(filterDatas);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, route]);

  useEffect(() => {
    setStateFilterData({
      // @ts-ignore
      type: route?.params?.serviceType || 0,
    });
  }, [route]);
  const handleGetServiceRequestList = (
    page: number = 1,
    filter: ServiceRequestFilterDataProps | null = filterData,
  ) => {
    const formData = new FormData();
    formData.append('token', token);
    if (filter?.machine) {
      formData.append('machine_id', filter?.machine.machine_id);
    }
    if (filter?.division) {
      formData.append('division_id', filter?.division.division_id);
    }
    if (filter?.reqStatus) {
      formData.append('request_status', filter?.reqStatus.id);
    }
    if (filter?.from_date) {
      formData.append(
        'from_date',
        moment(filter?.from_date).format('YYYY-MM-DD 00:00:00'),
      );
    }
    if (filter?.to_date) {
      formData.append(
        'to_date',
        moment(filter?.to_date).format('YYYY-MM-DD 23:59:59'),
      );
    }
    if (filter?.sort_type) {
      formData.append('sort_type', filter?.sort_type?.id);
    }
    if (filter?.work_center) {
      formData.append('work_center_id', filter?.work_center.work_center_id);
    }
    formData.append('report_no', filter?.report_no || '');
    if (!filter) {
      setStateFilterData(null);
    }
    if (route?.params?.requestId) {
      formData.append('request_id', route?.params?.requestId);
    }

    getServiceRequestListService(formData, page)
      .then(res => {
        const response: ServiceRequestListApiResponseProps = res.data;
        if (response.status === 1) {
          if (page === 1) {
            totalPages = response.data?.total_page || 1;
            // currentPage = response.data?.page || 1;
            // if (isMount) {
            setserviceRequestList(response.data?.items || []);
            // }
          } else {
            // if (isMount) {

            setserviceRequestList(prev => [...prev, ...response.data?.items]);
            // }
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisListLoader(false);
          setisEndRefreshing(false);
          setisRefreshing(false);
        }
      });
  };

  const handleExportService = () => {
    dispatch(openLoader(true));
    const data = {
      token,
      from_date: moment(new Date())
        .subtract(1, 'month')
        .format('YYYY-MM-DD HH:mm:s'),
      to_date: moment(new Date()).format('YYYY-MM-DD HH:mm:s'),
    };
    exportServiceRequestService(ConvertJSONtoFormData(data))
      .then(res => {
        if (typeof res?.data === 'string') {
          downloadPdf(
            res?.data,
            `Service Request${moment(new Date()).format('YYYY-MM-DD hh:mm A')}`,
            'pdf_download',
            setisLoading,
          );
        }
      })
      .catch(err => getCatchMessage(err))
      .finally(() => {
        dispatch(openLoader(false));
      });
  };

  const onEndReached = () => {
    currentPage = currentPage + 1;
    if (currentPage <= totalPages) {
      if (isMount) {
        setisEndRefreshing(true);
      }

      handleGetServiceRequestList(currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    handleGetServiceRequestList(1);
  };

  const handleDeleteServiceRequest = (reqId: number) => {
    handleCloseDelete();
    if (isMount) {
      setisLoading(true);
    }
    let formData = new FormData();
    formData.append('token', token);
    formData.append('request_id', reqId);
    deleteServiceRequestService(formData)
      .then(res => {
        const response: DeleteServiceRequestApiResposneProps = res.data;

        if (response.status === 1) {
          if (isMount) {
            setserviceRequestList(prev =>
              [...prev].filter(ele => ele.request_id !== reqId),
            );
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

  const handleCheckAccessToAdd = () => {
    navigation.navigate('ServiceRequestCreationStack', {
      isCreate: true,
    });
  };

  const onApplyFilter = (data: ServiceRequestFilterDataProps | null) => {
    if (isMount) {
      setisListLoader(true);
      setfilterData(data);
    }

    currentPage = 1;
    totalPages = 1;
    handleGetServiceRequestList(1, data);
  };

  const closeFilterModal = () => {
    if (isMount) {
      setisShowFilter(false);
    }
  };

  const handleCloseDelete = () => {
    setIsShowDelete(pre => ({...pre, status: false}));
  };

  return (
    <HOCView
      isListLoading={isListLoader}
      secondaryHeaderTitle="Downtime SR"
      isShowSecondaryHeaderBtn
      secondaryBtnTextStyle={{fontSize: FONTSIZES.small}}
      onHeaderBtnPress={() => {
        handleCheckAccessToAdd();
      }}
      headerProps={{
        headerTitle: 'Downtime SR',
      }}
      secondaryBtnTitle="Add Downtime SR"
      isLoading={isLoading}
      isBtnLoading={permissionLoader}>
      {/* {serviceRequestList?.length > 0 ? ( */}
      <View style={CommonStyles.flexRow}>
        <CustomButton
          onPress={() => {
            setisShowFilter(true);
          }}
          type="secondary"
          style={{width: '30%', marginVertical: 8}}>
          Filter
        </CustomButton>
        <CustomButton
          onPress={() => {
            handleExportService();
          }}
          type="export"
          style={{width: '30%', marginVertical: 8, marginLeft: 8}}>
          Export
        </CustomButton>
      </View>
      {/* ) : null} */}
      <View style={{marginBottom: bottom, flex: 1}}>
        <TableView
          rowData={[
            {key: 'equipment_id', label: 'Machine Id'},
            {key: 'machine_name', label: 'Machine Name'},
            // {key: 'work_center_name', label: 'Work Center'},
            {key: 'division_description', label: 'Division Id'},
            {key: 'machine_status_name', label: 'Machine Status'},
            // {key: 'report_no', label: 'Report Number'},
            {key: 'date_of_error_occur', label: 'Error Occurred At'},
            {key: 'requested_date', label: 'Request Date', type: 'date'},
            {key: 'completed_date', label: 'Completed Date'},
            // {key: 'total_down_time', label: 'Total Down Time'},
            {key: 'request_status_name', label: 'Request Status'},
          ]}
          dataList={[...serviceRequestList]?.map(ele => ({
            ...ele,
            disableEditIcon: ele?.request_status === 3 ? true : false,
            disableUpdateIcon: ele?.request_status === 3 ? true : false,
            disableApprovalIcon: ele?.request_status === 3 ? true : false,
          }))}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          isActionAvailable
          actionsList={actionsList}
          onActionPress={(
            actionType: number,
            val: ServiceRequestItemsProps,
          ) => {
            if (actionType === 1) {
              navigation.navigate('ServiceRequestCreationStack', {
                serviceReqData: val,
                isView: true,
              });
            } else if (actionType === 2) {
              navigation.navigate('ServiceRequestCreationStack', {
                serviceReqData: val,
                isServiceUpdate: true,
              });
            } else if (actionType === 3) {
              navigation.navigate('ServiceRequestCreationStack', {
                serviceReqData: val,
                isUpdate: true,
              });
            } else if (actionType === 4) {
              setIsShowDelete({
                id: val.request_id,
                status: true,
              });
              // AlertBox({
              //   alertMsg: 'Are you sure want to delete this request?',
              //   onPressPositiveButton() {
              //     handleDeleteServiceRequest(val.serviceId);
              //   },
              // });
            } else {
              navigation.navigate('ApprovalStatusList', {
                request_id: val?.request_id,
              });
            }
          }}
        />
      </View>
      {isShowFilter && (
        <GlobaModal
          title="Service Request Filter"
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

      {isShowDelete?.status && (
        <GlobaModal visible={isShowDelete?.status} onClose={handleCloseDelete}>
          <ConfirmationModal
            onClose={handleCloseDelete}
            visible={isShowDelete?.status}
            msg="Are you sure want to delete this request?"
            onConfirmPress={() => {
              handleDeleteServiceRequest(isShowDelete?.id);
            }}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
};

export default ServiceRequest;

const styles = StyleSheet.create({});
