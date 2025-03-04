import React, {useCallback} from 'react';
import {ChildRolePermission, RolePermission} from '../../../@types/api';
import {StyleSheet, View} from 'react-native';
import CheckBox from '../../../Components/CheckBox';
import {BOX_SHADOW, COLORS, WINDOW_WIDTH} from '../../../Utilities/Constants';

export const RenderChildItems = React.memo(
  ({
    item,
    handleChangePermissionStatus,
    selectedPermissions,
  }: {
    item: RolePermission;
    handleChangePermissionStatus: any;
    selectedPermissions: number[];
  }) => {
    return (
      <View style={styles.ChildPermissionsCart}>
        {item?.child?.map((childItem: ChildRolePermission) => {
          const handleChildChange = useCallback(
            (status: boolean) => {
              handleChangePermissionStatus(item, 'child', childItem?.id);
            },
            [handleChangePermissionStatus, item, childItem?.id],
          );

          return (
            <View key={childItem?.id} style={styles.childItemCard}>
              <CheckBox
                checked={
                  selectedPermissions.includes(childItem?.id) ? true : false
                }
                label={childItem?.name}
                onChange={handleChildChange}
              />
            </View>
          );
        })}
      </View>
    );
  },
);
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
