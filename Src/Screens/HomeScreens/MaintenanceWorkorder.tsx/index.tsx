import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HOCView from '../../../Components/HOCView';
import {FONTSIZES} from '../../../Utilities/Constants';
import CustomButton from '../../../Components/CustomButton';
import TableView from '../../../Components/TableView';
import {GetUserPermissions, UseToken} from '../../../Utilities/StoreData';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {actionListProps} from '../../../Components/types';
import {MaintenanceWorkOrderPermissions} from '../../../Utilities/Reducertype';
import Toast from '../../../Components/Toast';
import {
  deleteWorkOrderService,
  listWorkOrderService,
} from '../../../Services/Services';
import {
  DeleteWorkOrderApiResposneProps,
  MaintenacneWorkOrderApiResponseProps,
  MaintenacneWorkOrderItemsProps,
} from '../../../@types/api';
import GlobaModal from '../../../Components/GlobalModal';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import WorkOrderFilter from '../../../Modals/Filter/WorkOrderFilter';
import {MaintenanceWorkOrderFilterItemsDataProps} from './@types/WorkOrderTypes';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const itemHeaderList = ['Work Order Title', 'Work Order Code'];
const itemKeyList: any[] = [{key: 'work_title'}, {key: 'work_order'}];

const MaintenacneWorkOrder = () => {
  const token = UseToken();
  const navigation = useNavigation();
  // const MainteanceWorkorder: MaintenanceWorkOrderPermissions | any =
  //   GetUserPermissions('maintenance_workorder');
  const {bottom} = useSafeAreaInsets();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [workOrderlist, setworkOrderlist] = useState<
    MaintenacneWorkOrderItemsProps[]
  >([]);
  const [isShowFilter, setisShowFilter] = useState<boolean>(false);
  const [filterData, setfilterData] =
    useState<MaintenanceWorkOrderFilterItemsDataProps | null>(null);
  const [isShowDelete, setIsShowDelete] = useState({
    id: -1,
    status: false,
  });

  const [actionsList, setActionList] = useState<actionListProps[]>([
    {
      id: 1,
      name: 'editIcon',
      isShow: true,
      // isShow: MainteanceWorkorder.edit ? true : false,
    },
    {
      id: 2,
      name: 'deleteIcon',
      isShow: true,
      // isShow: MainteanceWorkorder.delete ? true : false,
    },
  ]);

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;
    handleWorkOrderListRequest(1, null);
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, []);

  const handleWorkOrderListRequest = (
    page: number = 1,
    filterData: MaintenanceWorkOrderFilterItemsDataProps | null,
  ) => {
    const formData = new FormData();
    formData.append('token', token);
    if (filterData?.work_title) {
      formData.append('work_title', filterData?.work_title);
    }
    if (filterData?.work_order) {
      formData.append('work_order', filterData?.work_order);
    }

    listWorkOrderService(formData, page)
      .then(res => {
        const response: MaintenacneWorkOrderApiResponseProps = res.data;

        if (response.status === 1) {
          if (page === 1) {
            totalPages = response.data.total_page;
            if (isMount) {
              setworkOrderlist([...response.data.items]);
            }
          } else {
            if (isMount) {
              setworkOrderlist(prev => [...prev, ...response.data.items]);
            }
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

  const handleDeleteWorderOrder = (reqId: number) => {
    handleCloseDelete();
    if (isMount) {
      setisLoading(true);
    }
    let formData = new FormData();
    formData.append('token', token);
    formData.append('work_order_id', reqId);
    deleteWorkOrderService(formData)
      .then(res => {
        const response: DeleteWorkOrderApiResposneProps = res.data;
        if (response.status === 1) {
          if (isMount) {
            setworkOrderlist(prev =>
              [...prev].filter(ele => ele.work_order_id !== reqId),
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

  const handleCloseDelete = () => {
    setIsShowDelete(pre => ({...pre, status: false}));
  };

  const closeFilterModal = () => {
    if (isMount) {
      setisShowFilter(false);
    }
  };

  const onApplyFilter = (
    data: MaintenanceWorkOrderFilterItemsDataProps | null,
  ) => {
    if (isMount) {
      setisListLoader(true);
      setfilterData(data);
    }
    handleWorkOrderListRequest(1, data);
  };

  const onEndReached = () => {
    currentPage = currentPage + 1;
    if (currentPage <= totalPages) {
      if (isMount) {
        setisEndRefreshing(true);
      }
      handleWorkOrderListRequest(currentPage, filterData);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    totalPages = 1;
    currentPage = 1;
    handleWorkOrderListRequest(1, filterData);
  };

  return (
    <HOCView
      isListLoading={isListLoader}
      secondaryHeaderTitle="Work Order"
      isShowSecondaryHeaderBtn
      secondaryBtnTextStyle={{fontSize: FONTSIZES.small}}
      onHeaderBtnPress={() => {
        //@ts-ignore
        navigation.navigate('AddWorkOrder');
      }}
      secondaryBtnTitle="Add Work Order"
      isLoading={isLoading}>
      <CustomButton
        onPress={() => {
          setisShowFilter(true);
        }}
        type="secondary"
        style={{width: '30%', marginVertical: 8}}>
        Filter
      </CustomButton>
      <View style={{marginBottom: bottom, flex: 1}}>
        <TableView
          dataList={[...workOrderlist]}
          headingList={itemHeaderList}
          itemKeysList={itemKeyList}
          rowData={[
            {key: 'work_title', label: 'Work Order Title'},
            {key: 'work_order', label: 'Work Order Code'},
          ]}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          isActionAvailable
          actionsList={actionsList}
          onActionPress={(actionType: number, val: any) => {
            if (actionType === 1) {
              //@ts-ignore
              navigation.navigate('AddWorkOrder', {work: val});
            } else if (actionType === 2) {
              setIsShowDelete({
                id: val.work_order_id,
                status: true,
              });
            }
          }}
        />
      </View>
      {isShowFilter && (
        <GlobaModal
          title="Work Order Filter"
          visible={isShowFilter}
          onClose={closeFilterModal}>
          <WorkOrderFilter
            //@ts-ignore
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
            msg="Are you sure want to delete this work?"
            onConfirmPress={() => {
              handleDeleteWorderOrder(isShowDelete?.id);
            }}
          />
        </GlobaModal>
      )}
    </HOCView>
  );
};

export default MaintenacneWorkOrder;

const styles = StyleSheet.create({});
