import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UseToken} from '../../../../Utilities/StoreData';
import {useIsFocused} from '@react-navigation/native';
import {MastersStackNavigationProps} from '../../../../@types/navigation';
import {useEffect, useState} from 'react';
import {MaterialListDataProps} from '../../../../@types/api';
import {actionListProps} from '../../../../Components/types';
import {MeterialListFilterdataProps} from '../../../../@types/modals';
import {
  deleteMaterialService,
  listMaterialService,
} from '../../../../Services/Services';
import {ApiResponse, DeleteApiResposneProps} from '../../../../@types/Global';
import Toast from '../../../../Components/Toast';
import {getCatchMessage} from '../../../../Utilities/GeneralUtilities';
import HOCView from '../../../../Components/HOCView';
import {FONTSIZES} from '../../../../Utilities/Constants';
import {StyleSheet, View} from 'react-native';
import {CommonStyles} from '../../../../Utilities/CommonStyles';
import CustomButton from '../../../../Components/CustomButton';
import GlobaModal from '../../../../Components/GlobalModal';
import TableView from '../../../../Components/TableView';
import MeterialListFilterModal from '../../../../Modals/Filter/MeterialListFilterModal';
import ConfirmationModal from '../../../../Modals/ConfirmationModal';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const Material = ({navigation, route}: MastersStackNavigationProps) => {
  const token = UseToken();
  const {bottom} = useSafeAreaInsets();
  const focused = useIsFocused();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [UserList, setUserList] = useState<MaterialListDataProps[]>([]);
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
  ]);
  const [filterData, setfilterData] =
    useState<MeterialListFilterdataProps | null>({
      material_name: '',
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
      handleGetMaterialList(1);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, route, focused]);

  const handleGetMaterialList = (
    page: number = 1,
    filter: MeterialListFilterdataProps | null = filterData,
  ) => {
    const formData = new FormData();
    formData.append('token', token);

    if (filter?.material_name) {
      formData.append('material_name', filter?.material_name);
    }

    listMaterialService(formData, page)
      .then(res => {
        const response: ApiResponse<MaterialListDataProps> = res.data;

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
      handleGetMaterialList(currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    handleGetMaterialList(1);
  };

  const handleDelete = (material_id: number) => {
    handleCloseDelete();
    if (isMount) {
      setisLoading(true);
    }
    let formData = new FormData();
    formData.append('token', token);
    formData.append('material_id', material_id);
    deleteMaterialService(formData)
      .then(res => {
        const response: DeleteApiResposneProps = res.data;

        if (response.status === 1) {
          if (isMount) {
            setUserList(prev =>
              [...prev].filter(ele => ele.material_id !== material_id),
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
    navigation.navigate('AddEditMaterial', {type: 'Create'});
  };

  const onApplyFilter = (data: MeterialListFilterdataProps | null) => {
    if (isMount) {
      setisListLoader(true);
      setfilterData(data);
    }

    currentPage = 1;
    totalPages = 1;
    handleGetMaterialList(1, data);
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
      secondaryHeaderTitle="Material"
      isShowSecondaryHeaderBtn
      secondaryBtnTextStyle={{fontSize: FONTSIZES.small}}
      onHeaderBtnPress={() => {
        handleCheckAccessToAdd();
      }}
      headerProps={{
        headerTitle: 'Material',
      }}
      secondaryBtnTitle="Add Material"
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
            {key: 'name', label: 'Name'},
            {key: 'description', label: 'Description'},
            {key: 'unit_id', label: 'Unit'},
            {key: 'created_at', label: 'Start Date'},
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
          onActionPress={(actionType: number, val: MaterialListDataProps) => {
            if (actionType === 4) {
              setIsShowDelete({
                id: val.material_id || 0,
                status: true,
              });
            } else if (actionType === 2) {
              navigation.navigate('AddEditMaterial', {
                type: 'Update',
                lineData: val,
              });
            } else if (actionType === 3) {
              navigation.navigate('AddEditMaterial', {type: 'View'});
            } else if (actionType === 1) {
              navigation.navigate('AddEditMaterial', {
                type: 'View',
                lineData: val,
              });
            }
          }}
        />
      </View>
      {isShowFilter && (
        <GlobaModal
          title="Material Filter"
          visible={isShowFilter}
          onClose={closeFilterModal}>
          <MeterialListFilterModal
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
            msg="Are you sure want to delete this Material?"
            onConfirmPress={() => {
              handleDelete(isShowDelete?.id);
            }}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
};

export default Material;

const styles = StyleSheet.create({});
