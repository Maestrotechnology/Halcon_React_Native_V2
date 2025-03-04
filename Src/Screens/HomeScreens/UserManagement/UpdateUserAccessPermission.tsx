import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {
  UserScreensNavigationProps,
  UserStackStackParamList,
} from '../../../@types/navigation';
import {GetUserAccessPermissions, UseToken} from '../../../Utilities/StoreData';
import {BOX_SHADOW, COLORS, WINDOW_WIDTH} from '../../../Utilities/Constants';
import HOCView from '../../../Components/HOCView';
import CustomButton from '../../../Components/CustomButton';
import {
  CreateAccessRoleService,
  listUserAccessPermissionsService,
  UpdateUserAccessPermissionsService,
} from '../../../Services/Services';
import {
  ConvertJSONtoFormData,
  FilterValidObj,
} from '../../../Utilities/Methods';
import Toast from '../../../Components/Toast';
import {extractIds, getCatchMessage} from '../../../Utilities/GeneralUtilities';
import {RolePermissionList} from '../../../Utilities/AccessConstants';
import {RolePermission} from '../../../@types/api';
import {renderTitleText} from '../../../Utilities/UiComponents';
import {TableItemProps} from '../../../@types/Global';
import CheckBox from '../../../Components/CheckBox';
import {RenderChildItems} from './AccessRolechild';

const UpdateUserAccessPermission = ({
  navigation,
}: UserScreensNavigationProps) => {
  const focused = useIsFocused();
  const token = UseToken();
  const route =
    useRoute<
      RouteProp<UserStackStackParamList, 'UpdateUserAccessPermission'>
    >();
  const {type} = route?.params;
  const [loading, setIsLoading] = useState(false);

  const [accessPermissionList, setAccessPermissionList] =
    useState<RolePermission[]>(RolePermissionList);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<{[key: number]: boolean}>({});

  // update Access Role
  const handleUpdateAccessRole = () => {
    setIsLoading(true);
    let finalObj = FilterValidObj({
      token: token,
      user_id: route?.params?.lineData?.user_id,
      permissionData: selectedPermissions,
    });

    UpdateUserAccessPermissionsService(finalObj)
      .then(async res => {
        if (res.data.status === 1) {
          Toast.success(res?.data?.msg);
          navigation.goBack();
        } else {
          Toast.error(res.data.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleViewAccessRoleData = () => {
    setIsLoading(true);
    let finalObj = {
      token,
      user_id: route?.params?.lineData?.user_id,
    };

    listUserAccessPermissionsService(ConvertJSONtoFormData(finalObj))
      .then(response => {
        if (response?.data?.status === 1) {
          const filteredIds: any = [];

          extractIds(response?.data?.data?.user_permission, filteredIds);
          setSelectedPermissions(filteredIds);
        } else {
          Toast.error(response?.data?.msg);
        }
      })
      .catch(error => {
        getCatchMessage(error);
      })
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    if (focused && type !== 'Create' && route?.params?.lineData) {
      handleViewAccessRoleData();
    }
  }, [focused]);

  const onItemPress = useCallback((item: RolePermission) => {
    setExpanded((prev: any) => ({
      ...prev,
      [item.id]: !prev[item.id], // Toggle only the clicked item
    }));
  }, []);

  const handleChangePermissionStatus = (
    item: any,
    type: 'parent' | 'child' | 'Innerchild',
    parentId?: number,
  ) => {
    if (type === 'parent') {
      let childIds = item?.child?.map((ele: any) => ele?.id);
      if (selectedPermissions?.includes(item?.id)) {
        setSelectedPermissions(pre =>
          pre?.filter(ele => ele !== item?.id && !childIds?.includes(ele)),
        );
      } else {
        setSelectedPermissions(pre => [...pre, item?.id, ...childIds]);
      }
    } else if (type === 'child') {
      if (selectedPermissions?.includes(parentId || 0)) {
        setSelectedPermissions(pre => pre?.filter(ele => ele !== parentId));
      } else {
        setSelectedPermissions(pre => [...pre, parentId || 0]);
      }
    }
  };

  const RenderCardItem = React.memo(
    ({item}: TableItemProps<RolePermission>) => {
      const isExpanded = expanded[item.id] ?? false;

      const memoizedChildItems = useMemo(() => {
        return (
          <RenderChildItems
            item={item}
            selectedPermissions={selectedPermissions}
            handleChangePermissionStatus={handleChangePermissionStatus}
          />
        );
      }, [isExpanded, item]);

      const handleParentChange = useCallback(
        (status: boolean) => handleChangePermissionStatus(item, 'parent'),
        [item],
      );

      return (
        <View key={item?.id}>
          <TouchableOpacity
            style={styles.tableContainer}
            onPress={() => onItemPress(item)}>
            <View>
              <CheckBox
                checked={selectedPermissions?.includes(item?.id) ? true : false}
                label={item?.name}
                onChange={handleParentChange}
              />
            </View>
          </TouchableOpacity>
          {memoizedChildItems}
        </View>
      );
    },
    (prevProps, nextProps) => prevProps.item === nextProps.item,
  );
  return (
    <HOCView
      isLoading={loading}
      headerProps={{
        isEnableMenu: false,
        isRightIconEnable: false,

        onBackPress() {
          navigation.goBack();
        },
        headerTitle: `Access Permissions`,
      }}
      isEnableKeyboardAware>
      {renderTitleText('Access Permission')}

      {accessPermissionList?.map((item, index) => {
        return <RenderCardItem item={item} index={index} />;
      })}

      {type !== 'View' && (
        <CustomButton
          onPress={() => {
            handleUpdateAccessRole();
          }}
          style={{marginVertical: 10, marginBottom: 20}}>
          Submit
        </CustomButton>
      )}
    </HOCView>
  );
};

export default UpdateUserAccessPermission;

const styles = StyleSheet.create({
  tabCard: {
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  tableContainer: {
    // backgroundColor: COLORS.lightOrange,
    backgroundColor: COLORS.white,
    marginBottom: 10,
    padding: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    ...BOX_SHADOW,
  },
  ChildPermissionsCart: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.lightWhite,
    width: WINDOW_WIDTH - 30,
    marginBottom: 5,
    borderRadius: 10,
    gap: 10,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...BOX_SHADOW,
  },
  childItemCard: {
    width: '48%',
  },
});
