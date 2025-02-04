import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HOCView from '../../../Components/HOCView';
import {UseToken} from '../../../Utilities/StoreData';
import {
  checkSubscriptionService,
  deleteServiceRequestService,
  exportServiceRequestService,
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
import {UserListFilterdataProps} from '../../../@types/modals';
import GlobaModal from '../../../Components/GlobalModal';
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

const UserList = ({navigation, route}: any) => {
  const token = UseToken();
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [serviceRequestList, setserviceRequestList] = useState<
    ServiceRequestItemsProps[]
  >([]);
  const [actionsList, setActionList] = useState<actionListProps[]>([
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
  const [filterData, setfilterData] = useState<UserListFilterdataProps | null>({
    role_id: null,
    username: '',
  });
  const [StateFilterData, setStateFilterData] =
    useState<null | UserListFilterdataProps>(null);
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
    filter: UserListFilterdataProps | null = filterData,
  ) => {
    const formData = new FormData();
    formData.append('token', token);
    if (filter?.role_id) {
      formData.append('role_id', filter?.role_id);
    }
    if (filter?.username) {
      formData.append('division_id', filter?.username);
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
        console.log(err, 'ERROR===');

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
    navigation.navigate('AddEditUser', {type: 'Create'});
  };

  const onApplyFilter = (data: UserListFilterdataProps | null) => {
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

export default UserList;

const styles = StyleSheet.create({});
