import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Toast from '../../../Components/Toast';
import HOCView from '../../../Components/HOCView';
import {UseToken} from '../../../Utilities/StoreData';
import {
  ChangeStatusUserService,
  deleteUserService,
  listUserService,
} from '../../../Services/Services';
import {UserRequestListDataProps} from '../../../@types/api';
import TableView from '../../../Components/TableView';
import {actionListProps} from '../../../Components/types';
import {FONTSIZES} from '../../../Utilities/Constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UserListFilterdataProps} from '../../../@types/modals';
import GlobaModal from '../../../Components/GlobalModal';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import UserFilterModal from '../../../Modals/Filter/UserFilterModal';
import {useIsFocused} from '@react-navigation/native';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
import {UserScreensNavigationProps} from '../../../@types/navigation';
import {ApiResponse, DeleteApiResposneProps} from '../../../@types/Global';
import {ChangesPasswordProps} from '../../../@types/general';
import ChangePasswordModal from '../../../Modals/ModifyModals/ChangePasswordModal';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const UserList = ({navigation, route}: UserScreensNavigationProps) => {
  const token = UseToken();
  const {bottom} = useSafeAreaInsets();
  const focused = useIsFocused();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [UserList, setUserList] = useState<UserRequestListDataProps[]>([]);
  const [showPasswordModal, setShowPasswordModal] =
    useState<ChangesPasswordProps>({
      lineData: null,
      show: false,
    });
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
    {
      id: 3,
      name: 'updateIcon',
      // isShow: ServiceRequestPermissions.update ? true : false,
      isShow: true,
      disableKey: 'disableUpdateIcon',
    },
    {
      id: 5,
      name: 'LockIcon',
      // isShow: ServiceRequestPermissions.delete ? true : false,
      isShow: true,
    },
  ]);
  const [filterData, setfilterData] = useState<UserListFilterdataProps | null>({
    role_id: null,
    username: '',
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
      handleGetUserList(1);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, route, focused]);

  const handleGetUserList = (
    page: number = 1,
    filter: UserListFilterdataProps | null = filterData,
  ) => {
    const formData = new FormData();
    formData.append('token', token);
    if (filter?.role_id) {
      formData.append('role_id', filter?.role_id?.role_id);
    }
    if (filter?.username) {
      formData.append('username', filter?.username);
    }

    listUserService(formData, page)
      .then(res => {
        const response: ApiResponse<UserRequestListDataProps> = res.data;
        if (response.status === 1) {
          if (page === 1) {
            totalPages = response.data?.total_page || 1;
            setUserList(response.data?.items || []);
          } else {
            setUserList(prev => [...prev, ...response.data?.items]);
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

  const handleChangeUserStatus = (
    status: number,
    lineData: UserRequestListDataProps,
  ) => {
    setisLoading(true);

    let formData = new FormData();
    formData.append('token', token);
    formData.append('user_id', lineData?.user_id);
    formData.append('active', status);

    ChangeStatusUserService(formData)
      .then(res => {
        const response: DeleteApiResposneProps = res.data;

        if (response.status === 1) {
          handleGetUserList(1, filterData);
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
  const handleDelete = (user_id: number) => {
    handleCloseDelete();
    if (isMount) {
      setisLoading(true);
    }
    let formData = new FormData();
    formData.append('token', token);
    formData.append('user_id', user_id);
    deleteUserService(formData)
      .then(res => {
        const response: DeleteApiResposneProps = res.data;

        if (response.status === 1) {
          if (isMount) {
            setUserList(prev =>
              [...prev].filter(ele => ele.user_id !== user_id),
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

  const closeChangePassswordModal = () => {
    if (isMount) {
      setShowPasswordModal({show: false, lineData: null});
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
      secondaryBtnTitle="Add"
      onPressisShowFilterBtn={() => {
        setisShowFilter(true);
      }}
      isLoading={isLoading}
      isShowFilterBtn={true}>
      <View style={{marginBottom: bottom, flex: 1}}>
        <TableView
          rowData={[
            {key: 'name', label: 'Name'},
            {key: 'username', label: 'User Name'},
            {key: 'email', label: 'Email'},
            {key: 'role_name', label: 'Role'},
            {key: 'mobile_no', label: 'Mobile No'},
            {key: 'status', label: 'Status'},
          ]}
          dataList={[...UserList]?.map(ele => ({
            ...ele,
          }))}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          isActionAvailable
          actionsList={actionsList}
          onChangeStatus={(
            status: number,
            lineData: UserRequestListDataProps,
          ) => {
            handleChangeUserStatus(status, lineData);
          }}
          onActionPress={(
            actionType: number,
            val: UserRequestListDataProps,
          ) => {
            if (actionType === 4) {
              setIsShowDelete({
                id: val.user_id,
                status: true,
              });
            } else if (actionType === 2) {
              navigation.navigate('AddEditUser', {
                type: 'Update',
                lineData: val,
              });
            } else if (actionType === 3) {
              navigation.navigate('UpdateUserAccessPermission', {
                type: 'Update',
                lineData: val,
              });
            } else if (actionType === 1) {
              navigation.navigate('AddEditUser', {type: 'View', lineData: val});
            } else if (actionType === 5) {
              setShowPasswordModal({lineData: val, show: true});
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
          />
        </GlobaModal>
      )}

      {showPasswordModal?.show && (
        <GlobaModal
          title="Change Password"
          visible={showPasswordModal?.show}
          onClose={closeChangePassswordModal}>
          <ChangePasswordModal
            type=""
            lineData={showPasswordModal?.lineData}
            onApplyChanges={closeChangePassswordModal}
            onClose={() => {}}
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

export default UserList;

const styles = StyleSheet.create({});
