import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HOCView from '../../../Components/HOCView';
import {UseToken} from '../../../Utilities/StoreData';
import {
  checkSubscriptionService,
  deleteServiceRequestService,
  exportServiceRequestService,
  getServiceRequestListService,
  listUserService,
} from '../../../Services/Services';
import Toast from '../../../Components/Toast';
import {
  DeleteServiceRequestApiResposneProps,
  ServiceRequestItemsProps,
  ServiceRequestListApiResponseProps,
  ServiceRequestSubscriptionProps,
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
import {JSONtoformdata} from '../../../Utilities/Methods';
import {useDispatch} from 'react-redux';
import {openLoader} from '../../../Store/Slices/LoaderSlice';
import UserFilterModal from '../../../Modals/Filter/UserFilterModal';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const itemHeaderList = [
  'Service Number',
  'Machine',
  'Priority',
  'Request Status',
];
const itemKeyList: ItemKeyListProps[] = [
  {key: 'serviceNumber'},
  {key: 'machineName'},
  {key: 'priority'},
  {key: 'requestStatus'},
];

const UserList = ({navigation, route}: any) =>
  // ServiceRequestScreensNavigationProps
  {
    const token = UseToken();
    const dispatch = useDispatch();
    const {bottom} = useSafeAreaInsets();
    // @ts-ignore
    // const ServiceRequestPermissions: ServiceRequestPermissionProps =
    //   GetUserPermissions('service_request');
    const [isListLoader, setisListLoader] = useState<boolean>(true);
    const [isRefreshing, setisRefreshing] = useState<boolean>(false);
    const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
    const [isLoading, setisLoading] = useState<boolean>(false);
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
        handleGetUserList(1);
      }
      return () => {
        isMount = false;
        currentPage = 1;
        totalPages = 1;
      };
    }, [token, route]);

    useEffect(() => {
      if (route) {
        setStateFilterData({
          // @ts-ignore
          type: route?.params?.serviceType || 0,
        });
      }
    }, [route]);

    const handleGetUserList = (
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
        formData.append('from_date', `${filter?.from_date} 00:00:00`);
      }
      if (filter?.to_date) {
        formData.append('to_date', `${filter?.to_date} 23:59:59`);
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

      listUserService(formData, page)
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
      exportServiceRequestService(JSONtoformdata(data))
        .then(res => {
          if (typeof res?.data === 'string') {
            downloadPdf(
              res?.data,
              `Service Request${moment(new Date()).format(
                'YYYY-MM-DD hh:mm A',
              )}`,
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

        handleGetUserList(currentPage);
      }
    };

    const onRefresh = () => {
      if (isMount) {
        setisRefreshing(true);
      }
      totalPages = 1;
      currentPage = 1;
      handleGetUserList(1);
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
      setPermissionLoader(true);
      const data = {
        token,
      };
      checkSubscriptionService(JSONtoformdata(data))
        .then(res => {
          if (res?.data?.status) {
            const {
              is_subscription,
              available_machine_credits,
            }: ServiceRequestSubscriptionProps = res?.data;
            if (is_subscription === 1) {
              navigation.navigate('ServiceRequestCreationStack', {
                isCreate: true,
              });
            } else {
              Toast.error(
                'You do not have Subscription. Please subscribe to get access via web portal.',
              );
            }
          } else {
            Toast.error(res?.data?.msg);
          }
        })
        .catch(err => getCatchMessage(err))
        .finally(() => {
          setPermissionLoader(false);
        });
    };

    const onApplyFilter = (data: ServiceRequestFilterDataProps | null) => {
      if (isMount) {
        setisListLoader(true);
        setfilterData(data);
      }

      currentPage = 1;
      totalPages = 1;
      handleGetUserList(1, data);
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
        secondaryHeaderTitle="User"
        isShowSecondaryHeaderBtn
        secondaryBtnTextStyle={{fontSize: FONTSIZES.small}}
        onHeaderBtnPress={() => {
          handleCheckAccessToAdd();
        }}
        headerProps={{
          headerTitle: 'User',
        }}
        secondaryBtnTitle="Add User"
        isLoading={isLoading}
        isBtnLoading={permissionLoader}>
        {serviceRequestList?.length > 0 ? (
          <View style={CommonStyles.flexRow}>
            <CustomButton
              onPress={() => {
                setisShowFilter(true);
              }}
              type="secondary"
              style={{width: '30%', marginVertical: 8}}>
              Filter
            </CustomButton>
          </View>
        ) : null}
        <View style={{marginBottom: bottom, flex: 1}}>
          <TableView
            rowData={[
              {key: 'name', label: 'Name'},
              {key: 'username', label: 'User Name'},
              {key: 'division', label: 'Division'},
              {key: 'email', label: 'Email'},
              {key: 'mobile_no', label: 'Mobile No'},
            ]}
            dataList={[...serviceRequestList]?.map(ele => ({
              ...ele,
              disableEditIcon: ele?.request_status === 3 ? true : false,
              disableUpdateIcon: ele?.request_status === 3 ? true : false,
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
              } else {
                setIsShowDelete({
                  id: val.request_id,
                  status: true,
                });
              }
            }}
          />
        </View>
        {isShowFilter && (
          <GlobaModal
            title="User Filter"
            visible={isShowFilter}
            onClose={closeFilterModal}>
            <UserFilterModal
              filterData={filterData}
              onApplyFilter={onApplyFilter}
              onClose={closeFilterModal}
              //@ts-ignore
              initialValue={StateFilterData}
            />
          </GlobaModal>
        )}

        {isShowDelete?.status && (
          <GlobaModal
            visible={isShowDelete?.status}
            onClose={handleCloseDelete}>
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

export default UserList;

const styles = StyleSheet.create({});
