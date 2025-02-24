import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UseToken} from '../../../Utilities/StoreData';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import {MachinesListDataProps} from '../../../@types/api';
import {actionListProps} from '../../../Components/types';
import {MachinesListFilterProps} from '../../../@types/modals';
import {
  DeleteMachineService,
  deleteWorkCenterService,
  listMachinesService,
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
import MachinesListFilterModal from '../../../Modals/Filter/MachinesListFilterModal';
import AddEditMachinesModal from '../../../Modals/ModifyModals/AddEditMachinesModal';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const Machines = ({navigation, route}: MastersStackNavigationProps) => {
  const token = UseToken();
  const {bottom} = useSafeAreaInsets();
  const focused = useIsFocused();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [WorkCenterList, setWorkCenterList] = useState<MachinesListDataProps[]>(
    [],
  );
  const [actionsList, setActionList] = useState<actionListProps[]>([
    {
      id: 2,
      name: 'editIcon',
      // isShow: ServiceRequestPermissions.edit ? true : false,
      isShow: true,
      disableKey: 'disableEditIcon',
    },
    {
      id: 4,
      name: 'TaskAssignIcon',
      // isShow: ServiceRequestPermissions.edit ? true : false,
      isShow: true,
      disableKey: 'disableEditIcon',
    },
    {
      id: 1,
      name: 'deleteIcon',
      // isShow: ServiceRequestPermissions.delete ? true : false,
      isShow: true,
    },
  ]);
  const [filterData, setfilterData] = useState<MachinesListFilterProps | null>({
    machine_name: '',
    machine_id: '',
    division_id: '',
  });
  const [isShowFilter, setisShowFilter] = useState<boolean>(false);
  const [addEditWorkCenter, setAddEditWorkCenter] = useState<
    AddEditModalScreenProsp<MachinesListDataProps>
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
      handleGetMachineList(1);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, route, focused]);

  const handleGetMachineList = (
    page: number = 1,
    filter: MachinesListFilterProps | null = filterData,
  ) => {
    const formData = new FormData();
    formData.append('token', token);

    if (filter?.machine_name) {
      formData.append('machine_name', filter?.machine_name);
    }
    if (filter?.machine_id) {
      formData.append('machine_id', filter?.machine_id?.machine_id);
    }
    if (filter?.division_id) {
      formData.append('division_id', filter?.division_id?.division_id);
    }

    listMachinesService(formData, page)
      .then(res => {
        const response: ApiResponse<MachinesListDataProps> = res.data;

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
      handleGetMachineList(currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    handleGetMachineList(1);
  };

  const handleDeleteDivision = (machine_id: number) => {
    handleCloseDelete();
    if (isMount) {
      setisLoading(true);
    }
    let formData = new FormData();
    formData.append('token', token);
    formData.append('machine_id', machine_id);

    DeleteMachineService(formData)
      .then(res => {
        const response: DeleteApiResposneProps = res.data;

        if (response.status === 1) {
          if (isMount) {
            setWorkCenterList(prev =>
              [...prev].filter(ele => ele.machine_id !== machine_id),
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

  const onApplyFilter = (data: MachinesListFilterProps | null) => {
    if (isMount) {
      setisListLoader(true);
      setfilterData(data);
    }

    currentPage = 1;
    totalPages = 1;
    handleGetMachineList(1, data);
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
      secondaryHeaderTitle="Machines"
      isShowSecondaryHeaderBtn
      secondaryBtnTextStyle={{fontSize: FONTSIZES.small}}
      onHeaderBtnPress={() => {
        handleCheckAccessToAdd();
      }}
      headerProps={{
        headerTitle: 'Machines',
      }}
      secondaryBtnTitle="Add Machine"
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
            {key: 'equipment_id', label: 'Machine ID'},
            {key: 'machine_name', label: 'Machine Name'},
            {key: 'division_description', label: 'Division'},
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
          onActionPress={(actionType: number, val: MachinesListDataProps) => {
            if (actionType === 1) {
              setIsShowDelete({
                id: val.machine_id || -1,
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
            } else if (actionType === 4) {
              navigation.navigate('MachineTasks', {
                item: val,
              });
            }
          }}
        />
      </View>
      {isShowFilter && (
        <GlobaModal
          title="Mahine Filter"
          visible={isShowFilter}
          onClose={closeFilterModal}>
          <MachinesListFilterModal
            filterData={filterData}
            onApplyFilter={onApplyFilter}
            onClose={closeFilterModal}
          />
        </GlobaModal>
      )}
      {addEditWorkCenter?.show && (
        <GlobaModal
          title={`${addEditWorkCenter?.type} Machine`}
          visible={addEditWorkCenter?.show}
          onClose={closeTaskModal}>
          <AddEditMachinesModal
            lineData={addEditWorkCenter?.lineData || null}
            type={addEditWorkCenter?.type}
            onApplyChanges={() => {
              handleGetMachineList(1);
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
            msg="Are you sure want to delete this Machine?"
            onConfirmPress={() => {
              handleDeleteDivision(isShowDelete?.id);
            }}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
};

export default Machines;

const styles = StyleSheet.create({});
