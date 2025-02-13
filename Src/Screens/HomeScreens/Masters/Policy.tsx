import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UseToken} from '../../../Utilities/StoreData';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import {PolicyListDataProps, RoleItemProps} from '../../../@types/api';
import {actionListProps} from '../../../Components/types';
import {
  listPolicyService,
  UpdatePlicyService,
} from '../../../Services/Services';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
import Toast from '../../../Components/Toast';
import HOCView from '../../../Components/HOCView';
import TableView, {TableItemProps} from '../../../Components/TableView';
import GlobaModal from '../../../Components/GlobalModal';
import {addEdittaskProps, UpdatePolicyProps} from '../../../@types/general';
import AddEditTaskModal from '../../../Modals/ModifyModals/AddEditTaskModal';
import {MastersStackNavigationProps} from '../../../@types/navigation';
import {ApiResponse} from '../../../@types/Global';
import {
  BOX_SHADOW,
  COLORS,
  FONTSIZES,
  INPUT_SIZE,
  PolicyColorList,
} from '../../../Utilities/Constants';
import StyledText from '../../../Components/StyledText';
import {ICONS} from '../../../Utilities/Icons';
import {FONTS} from '../../../Utilities/Fonts';
import DropdownBox from '../../../Components/DropdownBox';
import CheckBox from '../../../Components/CheckBox';
import TextInputBox from '../../../Components/TextInputBox';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const Policy = ({route}: MastersStackNavigationProps) => {
  const token = UseToken();
  const {bottom} = useSafeAreaInsets();
  const focused = useIsFocused();
  const [isListLoader, setisListLoader] = useState<boolean>(true);
  const [isRefreshing, setisRefreshing] = useState<boolean>(false);
  const [isEndRefreshing, setisEndRefreshing] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [updatePolicy, setUpdatePolicy] = useState<any>({
    policy_id: 0,
    role_ids: [],
    variable_value: null,
    input_value: '',
    policy_type: null,
  });
  const [PolicyList, setPolicyList] = useState<PolicyListDataProps[]>([]);
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
  const [addEdittask, setAddEditTask] = useState<UpdatePolicyProps>({
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
      handleGetPolicyList(1);
    }
    return () => {
      isMount = false;
      currentPage = 1;
      totalPages = 1;
    };
  }, [token, route, focused]);

  const handleGetPolicyList = (page: number = 1) => {
    const formData = new FormData();
    formData.append('token', token);

    listPolicyService(formData, page)
      .then(res => {
        const response: ApiResponse<PolicyListDataProps> = res.data;

        if (response.status === 1) {
          if (page === 1) {
            totalPages = response.data?.total_page || 1;

            setPolicyList(response.data?.items || []);
          } else {
            setPolicyList(prev => [...prev, ...response.data?.items]);
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
      handleGetPolicyList(currentPage);
    }
  };

  const onRefresh = () => {
    if (isMount) {
      setisRefreshing(true);
    }
    setUpdatePolicy({
      input_value: '',
      policy_id: 0,
      role_ids: [],
      variable_value: null,
      policy_type: null,
    });
    totalPages = 1;
    currentPage = 1;
    handleGetPolicyList(1);
  };

  const handleUpdatePolicy = (item: PolicyListDataProps) => {
    setisLoading(true);
    let formData = new FormData();
    formData.append('token', token);
    formData.append('policy_id', item?.id);
    if (item?.type === 1 || item?.type === 3) {
      formData.append(
        'role_ids',
        updatePolicy?.role_ids?.map((item: RoleItemProps) => item?.role_id),
      );
    }
    if (item?.type === 3) {
      formData.append('input_value', updatePolicy?.policy_type);
    }
    if (item?.type === 2) {
      formData.append('variable_value', updatePolicy?.variable_value);
    }

    UpdatePlicyService(formData)
      .then(async res => {
        if (res.data.status === 1) {
          Toast.success(res?.data?.msg);
          setUpdatePolicy({
            input_value: '',
            policy_id: 0,
            role_ids: [],
            variable_value: null,
            policy_type: null,
          });
          handleGetPolicyList(1);
        } else {
          Toast.error(res.data.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => setisLoading(false));
  };
  const renderCardItem = ({item, index}: TableItemProps) => {
    let cartStyle = PolicyColorList[(index + 1) % 3];

    return (
      <>
        <View
          key={JSON.stringify(item)}
          style={[styles.tableContainer, cartStyle]}>
          <TouchableOpacity
            style={{
              flex: 1,
            }}
            onPress={() => {}}
            activeOpacity={1}>
            <StyledText style={styles.descriptionText}>
              {item?.description}
            </StyledText>
            <View style={styles.ActionLine}>
              {updatePolicy?.policy_id === item?.id ? (
                item?.type === 1 || item?.type === 3 ? (
                  <DropdownBox
                    title="Role"
                    value={updatePolicy.role_ids}
                    placeHolder="Select Role"
                    apiType="roleList"
                    onMultipleSelect={val => {
                      setUpdatePolicy((pre: any) => ({...pre, role_ids: val}));
                    }}
                    multiSelect
                    ContainerStyle={{width: '90%'}}
                    isEnableRightIcon
                    isRequired
                    uniqueKey="role_id"
                    type="search"
                    fieldName="role_name"
                    isLocalSearch
                    searchFieldName="role_name"
                    onIconPress={() => {
                      setUpdatePolicy((pre: any) => ({
                        ...pre,
                        role_ids: [],
                      }));
                    }}
                  />
                ) : (
                  <TextInputBox
                    customContainerStyle={{width: '85%'}}
                    value={updatePolicy?.variable_value}
                    onChangeText={(val: string) => {
                      setUpdatePolicy((pre: any) => ({
                        ...pre,
                        variable_value: val,
                      }));
                    }}
                    customInputBoxContainerStyle={{
                      borderColor: COLORS.primary,
                      width: '100%',
                    }}
                    textInputProps={{
                      maxLength: INPUT_SIZE.AMOUNT_LENGTH,
                      keyboardType: 'number-pad',
                    }}
                    isRequired
                    placeHolder="Enter Hours"
                    title="Hours"
                  />
                )
              ) : (
                <StyledText
                  style={[
                    styles.normalText,
                    {
                      color: cartStyle.color,
                      textAlign: item?.type === 2 ? 'center' : 'left',
                    },
                  ]}>
                  {item?.type === 1 || item?.type === 3
                    ? item?.role
                        ?.map((ele: RoleItemProps) => ele?.role_name)
                        ?.toString()
                    : item?.variable_value}
                  {item?.type === 2
                    ? item?.variable_value > 1
                      ? '  Hours'
                      : '  Hour'
                    : ''}
                </StyledText>
              )}

              <View
                style={{
                  top:
                    item?.type === 2 && updatePolicy?.policy_id === item?.id
                      ? 15
                      : 6,
                }}>
                <TouchableOpacity
                  style={[
                    styles.actionIcons,
                    {
                      opacity: 1,
                      marginBottom: index === actionsList?.length - 1 ? 0 : 20,
                    },
                  ]}
                  onPress={() => {
                    if (updatePolicy?.policy_id) {
                      if (updatePolicy?.policy_id === item?.id) {
                        if (item?.type === 2) {
                          if (updatePolicy?.variable_value > 0) {
                            handleUpdatePolicy(item);
                          } else {
                            Toast.error('Please Enter Atlease One hour');
                          }
                        } else {
                          handleUpdatePolicy(item);
                        }
                      } else {
                        Toast.error('Please save any unsaved changes.');
                      }
                    } else {
                      setUpdatePolicy({
                        input_value: '',
                        policy_id: item?.id,
                        role_ids: item?.role,
                        variable_value: item?.variable_value,
                        policy_type: item?.policy_type,
                      });
                    }
                  }}
                  key={index.toString()}>
                  {updatePolicy?.policy_id === item?.id ? (
                    <ICONS.successIcon width={23} height={23} />
                  ) : (
                    <ICONS.editIcon />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            {item?.type === 3 &&
              ((item?.id !== updatePolicy?.policy_id && item?.policy_type) ||
              item?.id === updatePolicy?.policy_id ? (
                <CheckBox
                  checked={
                    item?.id === updatePolicy?.policy_id
                      ? updatePolicy?.policy_type
                      : item?.policy_type
                  }
                  label="Everyone must accept the status"
                  disabled={item?.id !== updatePolicy?.policy_id}
                  onChange={policy_type => {
                    setUpdatePolicy((pre: any) => ({
                      ...pre,
                      policy_type: policy_type ? 1 : 0,
                    }));
                  }}
                />
              ) : (
                ''
              ))}
          </TouchableOpacity>
        </View>
      </>
    );
  };
  return (
    <HOCView
      isListLoading={isListLoader}
      secondaryHeaderTitle="Policy"
      headerProps={{
        headerTitle: 'Policy',
      }}
      isLoading={isLoading}
      isBtnLoading={permissionLoader}>
      <View style={{marginBottom: bottom, flex: 1}}>
        <TableView
          rowData={[
            {key: 'description', label: ''},
            {key: 'control_key', label: 'Control Key'},
          ]}
          dataList={[...PolicyList]?.map(ele => ({
            ...ele,
          }))}
          customRenderer={renderCardItem}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          isEndRefresh={isEndRefreshing}
          isRefreshing={isRefreshing}
          isActionAvailable
          onActionPress={(actionType: number, val: PolicyListDataProps) => {
            if (actionType === 1) {
              setIsShowDelete({
                id: val.id || -1,
                status: true,
              });
            } else if (actionType === 2) {
              setAddEditTask({lineData: val, show: true});
            } else if (actionType === 3) {
              setAddEditTask({lineData: val, show: true});
            }
          }}
        />
      </View>

      {/* {addEdittask?.show && (
        <GlobaModal
          title={`${addEdittask?.type} Task`}
          visible={addEdittask?.show}
          onClose={closeTaskModal}>
          <AddEditTaskModal
            lineData={addEdittask?.lineData}
            type={addEdittask?.type}
            onApplyChanges={() => {
              handleGetPolicyList(1);
            }}
            onClose={closeTaskModal}
          />
        </GlobaModal>
      )} */}
    </HOCView>
  );
};

export default Policy;

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: '#d8ffdb',
    marginBottom: 10,
    borderRadius: 15,
    padding: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 15,
    borderWidth: 1,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionIcons: {
    backgroundColor: COLORS.white,
    width: 33,
    height: 33,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    ...BOX_SHADOW,
  },
  descriptionText: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: FONTS.poppins.bold,
    color: COLORS.darkBlue,
    marginBottom: 25,
  },
  normalText: {
    // textAlign: 'center',
    // lineHeight: 18,
    flexWrap: 'wrap',
    textTransform: 'capitalize',
    fontFamily: FONTS.poppins.regular,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    width: '85%',
  },
  ActionLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center',
    // backgroundColor: COLORS.gray,
  },
});
