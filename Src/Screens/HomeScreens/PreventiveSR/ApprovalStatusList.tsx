import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HOCView from '../../../Components/HOCView';
import {UseToken} from '../../../Utilities/StoreData';
import {getServiceRequestApprovalStatusListService} from '../../../Services/Services';
import Toast from '../../../Components/Toast';
import {
  ApprovalStatusListDataProps,
  ServiceRequestListApiResponseProps,
} from '../../../@types/api';
import TableView from '../../../Components/TableView';
import {actionListProps} from '../../../Components/types';
import CustomButton from '../../../Components/CustomButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ApprovalStatusFilterProps} from '../../../@types/modals';
import GlobaModal from '../../../Components/GlobalModal';
import {CommonStyles} from '../../../Utilities/CommonStyles';
import {useDispatch} from 'react-redux';
import ApprovalStatusFilterModal from '../../../Modals/Filter/ApprovalStatusFilterModal';
import {AddEditModalScreenProsp, ApiResponse} from '../../../@types/Global';
import ModifyApprovalStatusModal from '../../../Modals/ModifyModals/ModifyApprovalStatusModal';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const ApprovalStatusList = ({navigation, route}: any) => {
  const token = UseToken();
  const {bottom} = useSafeAreaInsets();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [editStatusModal, setEditStatusModal] = useState<
    AddEditModalScreenProsp<ApprovalStatusListDataProps>
  >({
    type: 'Update',
    show: false,
    lineData: null,
  });
  const [serviceRequestList, setApprovalStatusList] = useState<
    ApprovalStatusListDataProps[]
  >([]);
  const [actionsList, setActionList] = useState<actionListProps[]>([
    {
      id: 1,
      name: 'ApprovalIcon',
      // isShow: ServiceRequestPermissions.update ? true : false,
      isShow: true,
      disableKey: 'disableUpdateIcon',
    },
  ]);
  const [filterData, setfilterData] =
    useState<ApprovalStatusFilterProps | null>({
      role_name: '',
      status: null,
    });
  const [StateFilterData, setStateFilterData] =
    useState<null | ApprovalStatusFilterProps>(null);
  const [isShowFilter, setisShowFilter] = useState<boolean>(false);

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;

    if (token) {
      handleGetServiceRequestApprovalStatusList(1);
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

  const handleGetServiceRequestApprovalStatusList = (
    page: number = 1,
    filter: ApprovalStatusFilterProps | null = filterData,
  ) => {
    const formData = new FormData();
    formData.append('token', token);

    if (filter?.role_name) {
      formData.append('role_name', filter?.role_name);
    }
    if (filter?.status) {
      formData.append('status', filter?.status?.id);
    }
    if (route?.params?.request_id) {
      formData.append('preventive_sr_id', route?.params?.request_id);
    }

    getServiceRequestApprovalStatusListService(formData, page)
      .then(res => {
        const response: ApiResponse<ApprovalStatusListDataProps> = res.data;
        if (response.status === 1) {
          if (page === 1) {
            totalPages = response.data?.total_page || 1;
            setApprovalStatusList(response.data?.items || []);
          } else {
            setApprovalStatusList(prev => [...prev, ...response.data?.items]);
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

  const onEndReached = () => {
    currentPage = currentPage + 1;
    if (currentPage <= totalPages) {
      if (isMount) {
        setisEndRefreshing(true);
      }

      handleGetServiceRequestApprovalStatusList(currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    handleGetServiceRequestApprovalStatusList(1);
  };

  const onApplyFilter = (data: ApprovalStatusFilterProps | null) => {
    if (isMount) {
      setisListLoader(true);
      setfilterData(data);
    }

    currentPage = 1;
    totalPages = 1;
    handleGetServiceRequestApprovalStatusList(1, data);
  };

  const closeFilterModal = () => {
    if (isMount) {
      setisShowFilter(false);
    }
  };
  const closeTaskModal = () => {
    if (isMount) {
      setEditStatusModal({show: false, lineData: null, type: 'Update'});
    }
  };
  return (
    <HOCView
      isListLoading={isListLoader}
      secondaryHeaderTitle="Approval Status : Preventive Request"
      headerProps={{
        headerTitle: 'Approval Status',
      }}
      isLoading={isLoading}>
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
      <View style={{marginBottom: bottom, flex: 1}}>
        <TableView
          rowData={[
            {key: 'role_name', label: 'Role Id'},
            {
              key: 'action',
              label: 'Status',
              ListType: 'APPROVAL_STATUS_OPTIONS',
            },

            {key: 'updated_by', label: 'Updated By'},
            {key: 'comment', label: 'Comment'},
          ]}
          dataList={[...serviceRequestList]}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          isActionAvailable
          actionsList={actionsList}
          onActionPress={(
            actionType: number,
            val: ApprovalStatusListDataProps,
          ) => {
            if (actionType === 1) {
              setEditStatusModal({
                show: true,
                lineData: val || null,
                type: 'Update',
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
          <ApprovalStatusFilterModal
            filterData={filterData}
            onApplyFilter={onApplyFilter}
            onClose={closeFilterModal}
            //@ts-ignore
            initialValue={StateFilterData}
          />
        </GlobaModal>
      )}
      {editStatusModal?.show && (
        <GlobaModal
          title={`Approval Status`}
          visible={editStatusModal?.show}
          onClose={closeTaskModal}>
          <ModifyApprovalStatusModal
            lineData={editStatusModal?.lineData || null}
            type={'Update'}
            onApplyChanges={() => {
              handleGetServiceRequestApprovalStatusList(1);
            }}
            onClose={closeTaskModal}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
};

export default ApprovalStatusList;

const styles = StyleSheet.create({});
