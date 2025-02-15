import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {
  UserScreensNavigationProps,
  UserStackStackParamList,
} from '../../../@types/navigation';
import {GetUserAccessPermissions, UseToken} from '../../../Utilities/StoreData';
import {BOX_SHADOW, COLORS, WINDOW_WIDTH} from '../../../Utilities/Constants';
import HOCView from '../../../Components/HOCView';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import CustomButton from '../../../Components/CustomButton';
import TextInputBox from '../../../Components/TextInputBox';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  CreateAccessRoleService,
  UpdateAccessRoleService,
} from '../../../Services/Services';
import {FilterValidObj, isLoading} from '../../../Utilities/Methods';
import Toast from '../../../Components/Toast';
import {getCatchMessage} from '../../../Utilities/GeneralUtilities';
import {AccessAddEditDataProps} from '../../../@types/apirequestDatas';
import {RolePermissionList} from '../../../Utilities/AccessConstants';
import {
  ChildRolePermission,
  InnerChildRolePermission,
  RolePermission,
} from '../../../@types/api';
import {renderTitleText} from '../../../Utilities/UiComponents';
import CollapsableContainer from '../../../Components/CollapsableContainer';
import {TableItemProps} from '../../../@types/Global';
import CheckBox from '../../../Components/CheckBox';
import TableView from '../../../Components/TableView';
const UserValidation = Yup.object().shape({
  name: Yup.string().trim().required('* Name is required.'),
});

const AddEditRole = ({navigation}: UserScreensNavigationProps) => {
  const focused = useIsFocused();
  const token = UseToken();
  const UserPermissions = GetUserAccessPermissions();
  const route = useRoute<RouteProp<UserStackStackParamList, 'AddEditRole'>>();
  const {type} = route?.params;
  const isEditable = type === 'View' ? false : true;

  const [accessPermissionList, setAccessPermissionList] =
    useState<RolePermission[]>(RolePermissionList);
  //   const [expanded, setExpanded] = useState({isExpand: false, uniqueId: 0});
  const [expanded, setExpanded] = useState<{[key: number]: boolean}>({});
  const {values, errors, touched, setFieldValue, handleSubmit, setValues} =
    useFormik<AccessAddEditDataProps>({
      initialValues: {
        name: '',
        description: '',
      },

      validationSchema: UserValidation,
      onSubmit: values => {
        if (type === 'Create') {
          handleCreateAccessRole(values);
        } else if (type === 'Update') {
          handleUpdateAccessRole(values);
        }
      },
    });

  const handleCreateAccessRole = (values: any) => {
    isLoading(true);
    let finalObj = FilterValidObj({
      ...values,
      token: token,
      role_id: values?.role_id?.role_id || 0,
    });

    CreateAccessRoleService(finalObj)
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
      .finally(() => isLoading(false));
  };

  // update user
  const handleUpdateAccessRole = (values: any) => {
    isLoading(true);
    let finalObj = FilterValidObj({
      ...values,
      token: token,
      role_id: values?.role_id?.role_id || 0,
      isupdate: null,
    });

    UpdateAccessRoleService(finalObj)
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
      .finally(() => isLoading(false));
  };

  const handleUpdateAccessRoleData = () => {
    const updateData = route?.params?.lineData;

    setValues({
      name: updateData?.role_name || '',
      description: updateData?.role_description || '',
    });
  };
  useEffect(() => {
    if (focused && type !== 'Create' && route?.params?.lineData) {
      handleUpdateAccessRoleData();
    }
  }, [focused]);

  const onItemPress = useCallback((item: RolePermission) => {
    setExpanded((prev: any) => ({
      ...prev,
      [item.id]: !prev[item.id], // Toggle only the clicked item
    }));
  }, []);
  //   const onItemPress = (item: RolePermission) => {
  //     setExpanded({
  //       isExpand: item?.id === expanded?.uniqueId ? false : true,
  //       uniqueId: item?.id === expanded?.uniqueId ? 0 : item?.id,
  //     });
  //   };
  const handleChangePermissionStatus = (
    status: boolean,
    item: any,
    type: 'parent' | 'child' | 'Innerchild',
    parentId?: number,
    InnerParentId?: number,
  ) => {
    if (type === 'parent') {
      setAccessPermissionList(prev =>
        prev.map(ele =>
          ele.id !== item.id ? ele : {...ele, status: status ? 1 : 0},
        ),
      );
    } else if (type === 'child') {
      setAccessPermissionList((prevItems: any) =>
        prevItems.map((ele: any) =>
          ele.id !== item.id
            ? ele
            : {
                ...ele,
                child: ele.child.map((childData: ChildRolePermission) =>
                  childData.id !== parentId
                    ? childData
                    : {...childData, status: status ? 1 : 0},
                ),
              },
        ),
      );
    } else if (type === 'Innerchild') {
      let UpdatedInnerChildPermission: InnerChildRolePermission[] =
        accessPermissionList?.map(ele =>
          ele?.id === InnerParentId
            ? {
                ...ele,
                status: status ? 1 : 0,
              }
            : ele,
        );
      let UpdatedChildPermission: ChildRolePermission[] =
        accessPermissionList?.map(ele =>
          ele?.id === parentId
            ? {
                ...ele,
                child: UpdatedInnerChildPermission,
              }
            : ele,
        );
      let UpdatesParentPermissionItem: RolePermission[] =
        accessPermissionList?.map(ele =>
          ele?.id === item?.id
            ? {
                ...ele,
                child: UpdatedChildPermission,
              }
            : ele,
        );
      setAccessPermissionList(UpdatesParentPermissionItem);
    }
  };

  const RenderChildItems = React.memo(({item}: {item: RolePermission}) => {
    return (
      <View style={styles.ChildPermissionsCart}>
        {item?.child?.map((childItem: ChildRolePermission) => {
          const handleChildChange = useCallback(
            (status: boolean) => {
              handleChangePermissionStatus(
                status,
                item,
                'child',
                childItem?.id,
              );
            },
            [handleChangePermissionStatus, item, childItem?.id],
          );

          return (
            <View key={childItem?.id} style={styles.childItemCard}>
              <CheckBox
                checked={childItem?.status ? true : false}
                label={childItem?.name}
                onChange={handleChildChange}
              />
            </View>
          );
        })}
      </View>
    );
  });

  const RenderCardItem = React.memo(
    ({item}: TableItemProps<RolePermission>) => {
      const isExpanded = expanded[item.id] ?? false;

      const memoizedChildItems = useMemo(() => {
        return isExpanded ? <RenderChildItems item={item} /> : null;
      }, [isExpanded, item]);

      const handleParentChange = useCallback(
        (status: boolean) =>
          handleChangePermissionStatus(status, item, 'parent'),
        [item],
      );

      return (
        <View key={item?.id}>
          <TouchableOpacity
            style={styles.tableContainer}
            onPress={() => onItemPress(item)}>
            <View>
              <CheckBox
                checked={!!item?.status}
                label={item?.name}
                onChange={handleParentChange}
              />
            </View>
          </TouchableOpacity>
          <CollapsableContainer expanded={isExpanded}>
            {memoizedChildItems}
          </CollapsableContainer>
        </View>
      );
    },
    (prevProps, nextProps) => prevProps.item === nextProps.item,
  );
  return (
    <HOCView
      headerProps={{
        isEnableMenu: false,
        isRightIconEnable: false,
        onBackPress() {
          navigation.goBack();
        },
        headerTitle: `${type} Role`,
      }}
      isEnableKeyboardAware>
      {renderTitleText('Role Details')}
      <View style={{paddingBottom: 10}}>
        <TextInputBox
          value={values?.name}
          onChangeText={(val: string) => {
            setFieldValue('name', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          placeHolder="Enter Role Name"
          title="Role Name"
          isEditable={isEditable}
          disableNonEditableBg={true}
          isRequired
          errorText={errors.name && touched.name ? errors.name : ''}
        />
        <TextInputBox
          value={values?.description}
          onChangeText={(val: string) => {
            setFieldValue('description', val);
          }}
          customInputBoxContainerStyle={{
            borderColor: COLORS.primary,
          }}
          placeHolder="Enter Description"
          title="Description"
          isEditable={isEditable}
          disableNonEditableBg={true}
          multiline
          numberOfLines={3}
          errorText={
            errors.description && touched.description ? errors.description : ''
          }
        />
      </View>
      {renderTitleText('Access Permission')}

      {accessPermissionList?.map((item, index) => {
        return <RenderCardItem item={item} index={index} />;
      })}
      {/* <TableView
        dataList={accessPermissionList}
        rowData={[
          {
            label: 'name',
            key: 'name',
          },
        ]}
        customRenderer={RenderCardItem}
      /> */}

      {type !== 'View' && (
        <CustomButton
          onPress={handleSubmit}
          style={{marginVertical: 10, marginBottom: 20}}>
          Submit
        </CustomButton>
      )}
    </HOCView>
  );
};

export default AddEditRole;

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
