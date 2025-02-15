import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UseToken} from '../../../Utilities/StoreData';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import {DivisionListDataProps} from '../../../@types/api';
import {actionListProps} from '../../../Components/types';
import {DivisionListFilterProps} from '../../../@types/modals';
import {
  deleteDivisionService,
  deleteTasksService,
  listDivisionService,
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
import DivisionListFilterModal from '../../../Modals/Filter/DivisionListFilterModal';
import AddEditDivisionModal from '../../../Modals/ModifyModals/AddEditDivisionModal';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const Division = ({route}: MastersStackNavigationProps) => {
  const token = UseToken();
  const {bottom} = useSafeAreaInsets();
  const focused = useIsFocused();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [TasksList, setTasksList] = useState<DivisionListDataProps[]>([]);
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
  const [filterData, setfilterData] = useState<DivisionListFilterProps | null>({
    description: '',
  });
  const [isShowFilter, setisShowFilter] = useState<boolean>(false);
  const [addEditdivision, setAddEditDevision] = useState<
    AddEditModalScreenProsp<DivisionListDataProps>
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
      handleGetDivisionList(1);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, route, focused]);

  const handleGetDivisionList = (
    page: number = 1,
    filter: DivisionListFilterProps | null = filterData,
  ) => {
    const formData = new FormData();
    formData.append('token', token);
    if (filter?.description) {
      formData.append('description', filter?.description);
    }

    listDivisionService(formData, page)
      .then(res => {
        const response: ApiResponse<DivisionListDataProps> = res.data;

        if (response.status === 1) {
          if (page === 1) {
            totalPages = response.data?.total_page || 1;

            setTasksList(response.data?.items || []);
          } else {
            setTasksList(prev => [...prev, ...response.data?.items]);
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
      handleGetDivisionList(currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    handleGetDivisionList(1);
  };

  const handleDeleteDivision = (division_id: number) => {
    handleCloseDelete();
    if (isMount) {
      setisLoading(true);
    }
    let formData = new FormData();
    formData.append('token', token);
    formData.append('division_id', division_id);
    deleteDivisionService(formData)
      .then(res => {
        const response: DeleteApiResposneProps = res.data;

        if (response.status === 1) {
          if (isMount) {
            setTasksList(prev =>
              [...prev].filter(ele => ele.division_id !== division_id),
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
    setAddEditDevision({show: true, type: 'Create', lineData: null});
  };

  const onApplyFilter = (data: DivisionListFilterProps | null) => {
    if (isMount) {
      setisListLoader(true);
      setfilterData(data);
    }

    currentPage = 1;
    totalPages = 1;
    handleGetDivisionList(1, data);
  };

  const closeFilterModal = () => {
    if (isMount) {
      setisShowFilter(false);
    }
  };
  const closeTaskModal = () => {
    if (isMount) {
      setAddEditDevision({lineData: null, show: false, type: ''});
    }
  };

  const handleCloseDelete = () => {
    setIsShowDelete(pre => ({...pre, status: false}));
  };

  return (
    <HOCView
      isListLoading={isListLoader}
      secondaryHeaderTitle="Division"
      isShowSecondaryHeaderBtn
      secondaryBtnTextStyle={{fontSize: FONTSIZES.small}}
      onHeaderBtnPress={() => {
        handleCheckAccessToAdd();
      }}
      headerProps={{
        headerTitle: 'Division',
      }}
      secondaryBtnTitle="Add Division"
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
            {key: 'description', label: 'Division Name'},
            {key: 'created_at', label: 'Created at', type: 'date'},
          ]}
          dataList={[...TasksList]?.map(ele => ({
            ...ele,
          }))}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          isActionAvailable
          actionsList={actionsList}
          onActionPress={(actionType: number, val: DivisionListDataProps) => {
            if (actionType === 1) {
              setIsShowDelete({
                id: val.division_id || -1,
                status: true,
              });
            } else if (actionType === 2) {
              setAddEditDevision({
                type: 'Update',
                lineData: val,
                show: true,
              });
            } else if (actionType === 3) {
              setAddEditDevision({
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
          title="Division Filter"
          visible={isShowFilter}
          onClose={closeFilterModal}>
          <DivisionListFilterModal
            filterData={filterData}
            onApplyFilter={onApplyFilter}
            onClose={closeFilterModal}
          />
        </GlobaModal>
      )}
      {addEditdivision?.show && (
        <GlobaModal
          title={`${addEditdivision?.type} Division`}
          visible={addEditdivision?.show}
          onClose={closeTaskModal}>
          <AddEditDivisionModal
            lineData={addEditdivision?.lineData || null}
            type={addEditdivision?.type}
            onApplyChanges={() => {
              handleGetDivisionList(1);
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
            msg="Are you sure want to delete this Division?"
            onConfirmPress={() => {
              handleDeleteDivision(isShowDelete?.id);
            }}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
};

export default Division;

const styles = StyleSheet.create({});
