import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Toast from '../../../Components/Toast';
import HOCView from '../../../Components/HOCView';
import {UseToken} from '../../../Utilities/StoreData';
import {
  deleteUserService,
  listAccessRoleService,
} from '../../../Services/Services';
import {AccessRoleListDataProps} from '../../../@types/api';
import TableView from '../../../Components/TableView';
import {actionListProps} from '../../../Components/types';
import {FONTSIZES} from '../../../Utilities/Constants';
import CustomButton from '../../../Components/CustomButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RoleListFilterdataProps} from '../../../@types/modals';
import GlobaModal from '../../../Components/GlobalModal';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import {CommonStyles} from '../../../Utilities/CommonStyles';
import {useIsFocused} from '@react-navigation/native';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
import {UserScreensNavigationProps} from '../../../@types/navigation';
import {ApiResponse, DeleteApiResposneProps} from '../../../@types/Global';
import AccessRoleFilterModal from '../../../Modals/Filter/AccessRoleFilterModal';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const AccessRoleList = ({navigation, route}: UserScreensNavigationProps) => {
  const token = UseToken();
  const {bottom} = useSafeAreaInsets();
  const focused = useIsFocused();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [RoleList, setRoleList] = useState<AccessRoleListDataProps[]>([]);
  const [actionsList, setActionList] = useState<actionListProps[]>([
    {
      id: 4,
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
  const [filterData, setfilterData] = useState<RoleListFilterdataProps | null>({
    role_name: '',
  });
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
      handleGetRoleList(1);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, route, focused]);

  const handleGetRoleList = (
    page: number = 1,
    filter: RoleListFilterdataProps | null = filterData,
  ) => {
    const formData = new FormData();
    formData.append('token', token);

    if (filter?.role_name) {
      formData.append('role_name', filter?.role_name);
    }

    listAccessRoleService(formData, page)
      .then(res => {
        const response: ApiResponse<AccessRoleListDataProps> = res.data;

        if (response.status === 1) {
          if (page === 1) {
            totalPages = response.data?.total_page || 1;

            setRoleList(response.data?.items || []);
          } else {
            setRoleList(prev => [...prev, ...response.data?.items]);
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
      handleGetRoleList(currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    handleGetRoleList(1);
  };

  const handleDelete = (role_id: number) => {
    handleCloseDelete();
    if (isMount) {
      setisLoading(true);
    }
    let formData = new FormData();
    formData.append('token', token);
    formData.append('role_id', role_id);
    deleteUserService(formData)
      .then(res => {
        const response: DeleteApiResposneProps = res.data;

        if (response.status === 1) {
          if (isMount) {
            setRoleList(prev =>
              [...prev].filter(ele => ele.role_id !== role_id),
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
    navigation.navigate('AddEditRole', {type: 'Create'});
  };

  const onApplyFilter = (data: RoleListFilterdataProps | null) => {
    if (isMount) {
      setisListLoader(true);
      setfilterData(data);
    }

    currentPage = 1;
    totalPages = 1;
    handleGetRoleList(1, data);
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
      secondaryHeaderTitle="Role"
      isShowSecondaryHeaderBtn
      secondaryBtnTextStyle={{fontSize: FONTSIZES.small}}
      onHeaderBtnPress={() => {
        handleCheckAccessToAdd();
      }}
      headerProps={{
        headerTitle: 'Role',
      }}
      secondaryBtnTitle="Add"
      isLoading={isLoading}
      isShowFilterBtn
      onPressisShowFilterBtn={() => {
        setisShowFilter(true);
      }}
      isBtnLoading={permissionLoader}>
      {/* <View style={CommonStyles.flexRow}>
        <CustomButton
          onPress={() => {
            setisShowFilter(true);
          }}
          type="secondary"
          style={{width: '30%', marginVertical: 8}}>
          Filter
        </CustomButton>
      </View> */}
      <View style={{marginBottom: bottom, flex: 1}}>
        <TableView
          rowData={[
            {key: 'role_name', label: 'Role Name'},
            {key: 'role_description', label: 'Description'},
          ]}
          dataList={[...RoleList]?.map(ele => ({
            ...ele,
          }))}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          isActionAvailable
          actionsList={actionsList}
          lineTextNumberofLines={3}
          onActionPress={(actionType: number, val: AccessRoleListDataProps) => {
            if (actionType === 4) {
              setIsShowDelete({
                id: val.role_id,
                status: true,
              });
            } else if (actionType === 2) {
              navigation.navigate('AddEditRole', {
                type: 'Update',
                lineData: val,
              });
            } else if (actionType === 1) {
              navigation.navigate('AddEditRole', {type: 'View', lineData: val});
            }
          }}
        />
      </View>
      {isShowFilter && (
        <GlobaModal
          title="Role Filter"
          visible={isShowFilter}
          onClose={closeFilterModal}>
          <AccessRoleFilterModal
            filterData={filterData}
            onApplyFilter={onApplyFilter}
            onClose={closeFilterModal}
          />
        </GlobaModal>
      )}

      {isShowDelete?.status && (
        <GlobaModal visible={isShowDelete?.status} onClose={handleCloseDelete}>
          <ConfirmationModal
            onClose={handleCloseDelete}
            visible={isShowDelete?.status}
            msg="Are you sure want to delete this User?"
            onConfirmPress={() => {
              handleDelete(isShowDelete?.id);
            }}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
};

export default AccessRoleList;

const styles = StyleSheet.create({});
