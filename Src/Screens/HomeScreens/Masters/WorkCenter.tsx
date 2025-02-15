import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UseToken} from '../../../Utilities/StoreData';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import {WorkCenterListDataProps} from '../../../@types/api';
import {actionListProps} from '../../../Components/types';
import {WorkCenterListFilterProps} from '../../../@types/modals';
import {
  deleteWorkCenterService,
  listWorkCenterService,
} from '../../../Services/Services';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
import Toast from '../../../Components/Toast';
import HOCView from '../../../Components/HOCView';
import {FONTSIZES} from '../../../Utilities/Constants';
import {CommonStyles} from '../../../Utilities/CommonStyles';
import CustomButton from '../../../Components/CustomButton';
import TableView from '../../../Components/TableView';
import GlobaModal from '../../../Components/GlobalModal';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import {MastersStackNavigationProps} from '../../../@types/navigation';
import {
  AddEditModalScreenProsp,
  ApiResponse,
  DeleteApiResposneProps,
} from '../../../@types/Global';
import WorkCenterListFilterModal from '../../../Modals/Filter/WorkCenterListFilterModal';
import AddEditWorkCenterModal from '../../../Modals/ModifyModals/AddEditWorkCenterModal';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const WorkCenter = ({route}: MastersStackNavigationProps) => {
  const token = UseToken();
  const {bottom} = useSafeAreaInsets();
  const focused = useIsFocused();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [WorkCenterList, setWorkCenterList] = useState<
    WorkCenterListDataProps[]
  >([]);
  const [actionsList, setActionList] = useState<actionListProps[]>([
    {
      id: 1,
      name: 'deleteIcon',
      // isShow: ServiceRequestPermissions.delete ? true : false,
      isShow: true,
    },
    {
      id: 2,
      name: 'editIcon',
      // isShow: ServiceRequestPermissions.edit ? true : false,
      isShow: true,
      disableKey: 'disableEditIcon',
    },
  ]);
  const [filterData, setfilterData] =
    useState<WorkCenterListFilterProps | null>({
      name: '',
    });
  const [isShowFilter, setisShowFilter] = useState<boolean>(false);
  const [addEditWorkCenter, setAddEditWorkCenter] = useState<
    AddEditModalScreenProsp<WorkCenterListDataProps>
  >({
    type: '',
    lineData: null,
    show: false,
  });
  const [isShowDelete, setIsShowDelete] = useState({
    id: -1,
    status: false,
  });

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;

    if (token) {
      handleGetWorkCenterList(1);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, route, focused]);

  const handleGetWorkCenterList = (
    page: number = 1,
    filter: WorkCenterListFilterProps | null = filterData,
  ) => {
    const formData = new FormData();
    formData.append('token', token);
    if (filter?.name) {
      formData.append('name', filter?.name);
    }

    listWorkCenterService(formData, page)
      .then(res => {
        const response: ApiResponse<WorkCenterListDataProps> = res.data;

        if (response.status === 1) {
          if (page === 1) {
            totalPages = response.data?.total_page || 1;

            setWorkCenterList(response.data?.items || []);
          } else {
            setWorkCenterList(prev => [...prev, ...response.data?.items]);
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
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
      handleGetWorkCenterList(currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    handleGetWorkCenterList(1);
  };

  const handleDeleteDivision = (work_center_id: number) => {
    handleCloseDelete();
    if (isMount) {
      setisLoading(true);
    }
    let formData = new FormData();
    formData.append('token', token);
    formData.append('work_center_id', work_center_id);
    deleteWorkCenterService(formData)
      .then(res => {
        const response: DeleteApiResposneProps = res.data;

        if (response.status === 1) {
          if (isMount) {
            setWorkCenterList(prev =>
              [...prev].filter(ele => ele.work_center_id !== work_center_id),
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
    setAddEditWorkCenter({show: true, type: 'Create', lineData: null});
  };

  const onApplyFilter = (data: WorkCenterListFilterProps | null) => {
    if (isMount) {
      setisListLoader(true);
      setfilterData(data);
    }

    currentPage = 1;
    totalPages = 1;
    handleGetWorkCenterList(1, data);
  };

  const closeFilterModal = () => {
    if (isMount) {
      setisShowFilter(false);
    }
  };
  const closeTaskModal = () => {
    if (isMount) {
      setAddEditWorkCenter({lineData: null, show: false, type: ''});
    }
  };

  const handleCloseDelete = () => {
    setIsShowDelete(pre => ({...pre, status: false}));
  };

  return (
    <HOCView
      isListLoading={isListLoader}
      secondaryHeaderTitle="Work Center"
      isShowSecondaryHeaderBtn
      secondaryBtnTextStyle={{fontSize: FONTSIZES.small}}
      onHeaderBtnPress={() => {
        handleCheckAccessToAdd();
      }}
      headerProps={{
        headerTitle: 'Work Center',
      }}
      secondaryBtnTitle="Add Work Center"
      isLoading={isLoading}
      isBtnLoading={permissionLoader}>
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
            {key: 'name', label: 'Work Center Name'},
            {key: 'created_at', label: 'Created at', type: 'date'},
          ]}
          dataList={[...WorkCenterList]?.map(ele => ({
            ...ele,
          }))}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          isActionAvailable
          actionsList={actionsList}
          onActionPress={(actionType: number, val: WorkCenterListDataProps) => {
            if (actionType === 1) {
              setIsShowDelete({
                id: val.work_center_id || -1,
                status: true,
              });
            } else if (actionType === 2) {
              setAddEditWorkCenter({
                type: 'Update',
                lineData: val,
                show: true,
              });
            } else if (actionType === 3) {
              setAddEditWorkCenter({
                type: 'View',
                lineData: val,
                show: true,
              });
            }
          }}
        />
      </View>
      {isShowFilter && (
        <GlobaModal
          title="Work Center Filter"
          visible={isShowFilter}
          onClose={closeFilterModal}>
          <WorkCenterListFilterModal
            filterData={filterData}
            onApplyFilter={onApplyFilter}
            onClose={closeFilterModal}
          />
        </GlobaModal>
      )}
      {addEditWorkCenter?.show && (
        <GlobaModal
          title={`${addEditWorkCenter?.type} Work Center`}
          visible={addEditWorkCenter?.show}
          onClose={closeTaskModal}>
          <AddEditWorkCenterModal
            lineData={addEditWorkCenter?.lineData || null}
            type={addEditWorkCenter?.type}
            onApplyChanges={() => {
              handleGetWorkCenterList(1);
            }}
            onClose={closeTaskModal}
          />
        </GlobaModal>
      )}

      {isShowDelete?.status && (
        <GlobaModal visible={isShowDelete?.status} onClose={handleCloseDelete}>
          <ConfirmationModal
            onClose={handleCloseDelete}
            visible={isShowDelete?.status}
            msg="Are you sure want to delete this Work Center?"
            onConfirmPress={() => {
              handleDeleteDivision(isShowDelete?.id);
            }}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
};

export default WorkCenter;

const styles = StyleSheet.create({});
