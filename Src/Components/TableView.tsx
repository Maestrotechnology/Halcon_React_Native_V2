import {
  StyleSheet,
  View,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import StyledText from './StyledText';
import {COLORS, WINDOW_WIDTH} from '../Utilities/Constants';
import {FONTS} from '../Utilities/Fonts';
import {ICONS} from '../Utilities/Icons';
import {TableViewProps} from './types';
import ListEmptyComponent from './ListEmptyComponent';
import CommonSwitch from './CommonSwitch';
import lodash from 'lodash';
export type TableItemProps = {
  item: any;
  index: number;
};

const TableView = ({
  viewPortColumnDivisionCount = 4,
  dataList,
  rowData,
  headingList,
  itemKeysList,
  isActionAvailable = false,
  isRefreshing = false,
  actionsList = [],
  onActionPress,
  isEndRefresh = false,
  onEndReached,
  onPressItem,
  onRefresh,
  isDisabled = false,
  removeActionsIds = [],
  removeActionItemKey = '',
  removeActionRefKey = '',
  viewAction,
  showFullText,
  selectable,
  selectedIds,
  checkedKey,
  onCheckPress,
  customRenderer,
  onChangeStatus,
}: TableViewProps) => {
  const isScrollBeginRef = useRef(true);
  const columnWidth: number =
    (WINDOW_WIDTH - 40) / (viewPortColumnDivisionCount - 1);
  const debounceOnEndReached = onEndReached
    ? lodash.debounce(onEndReached, 500)
    : undefined;

  const ItemSeparator = ({my = 5}: {my?: number}) => {
    return (
      <View
        style={{
          height: 1,
          marginVertical: my,
          marginHorizontal: 10,
          backgroundColor: 'rgba(0,0,0,0.05)',
        }}
      />
    );
  };

  const getDisplayData = (value: any) => {
    if ((value && value !== '') || value === 0) {
      return value;
    } else {
      return '-';
    }
  };

  const renderTableHeader = () => {
    return (
      <>
        <View
          style={[
            styles.headingContainer,
            {backgroundColor: 'transparent', marginBottom: 5},
          ]}>
          <View style={[styles.heading, {width: 50, alignItems: 'center'}]}>
            <StyledText
              style={[
                styles.headingtext,
                {
                  textAlign: 'center',
                  color: COLORS.black,
                },
              ]}>
              {checkedKey ? '' : 'S.No'}
            </StyledText>
          </View>
          {headingList?.map((title, index) => {
            return (
              <View
                key={index.toString()}
                style={[styles.heading, {width: columnWidth}]}>
                <StyledText
                  style={[
                    styles.headingtext,
                    {
                      textAlign: 'left',
                      color: COLORS.black,
                    },
                  ]}>
                  {title}
                </StyledText>
              </View>
            );
          })}
          {isActionAvailable && (
            <View
              style={[
                styles.heading,
                {width: columnWidth, alignItems: 'center'},
              ]}>
              <StyledText
                style={[
                  styles.headingtext,
                  {
                    textAlign: 'center',
                    color: COLORS.black,
                  },
                ]}>
                Actions
              </StyledText>
            </View>
          )}
        </View>
        <ItemSeparator my={0} />
      </>
    );
  };

  const getActionsList = (item: any) => {
    if (
      removeActionsIds &&
      removeActionsIds.length > 0 &&
      item &&
      removeActionItemKey &&
      removeActionRefKey
    ) {
      if (item[removeActionItemKey] === removeActionRefKey) {
        let actionData = [...actionsList].filter(
          ele => !removeActionsIds.includes(ele.id),
        );
        return [...actionData];
      } else {
        return [...actionsList];
      }
    }
    return [...actionsList];
  };

  const renderCardItem = ({item, index}: TableItemProps) => {
    return (
      <>
        <View key={JSON.stringify(item)} style={styles.tableContainer}>
          <TouchableOpacity
            style={{
              flex: 1,
              // maxWidth: WINDOW_WIDTH - 100,
            }}
            onPress={() => {
              if (onActionPress) onActionPress(1, item);
            }}
            activeOpacity={1}>
            <View style={[styles.flexRow]}>
              <StyledText style={styles.headerLabel}>
                S.No &ensp;:&ensp;
              </StyledText>
              <StyledText style={styles.valueLabel}>{index + 1}</StyledText>
            </View>
            {[...rowData]?.map((cardItem, cardIndex) => {
              return (
                <View
                  style={[
                    styles.flexRow,
                    {
                      flex: 1,
                    },
                  ]}>
                  <StyledText style={styles.headerLabel}>
                    {cardItem?.label} &ensp;:&ensp;
                  </StyledText>
                  <View style={{flex: 1}}>
                    {cardItem?.key === 'status' ? (
                      <View style={styles.StatusActiveView}>
                        {item?.[cardItem?.key] == 1 ? (
                          <StyledText style={{color: COLORS.green}}>
                            Active
                          </StyledText>
                        ) : (
                          <StyledText style={{color: COLORS.red}}>
                            Inactive
                          </StyledText>
                        )}
                        <CommonSwitch
                          onChangeSwitch={status => {
                            onChangeStatus?.(status ? 1 : 0, item);
                          }}
                          isEnabled={item?.[cardItem?.key]}
                        />
                      </View>
                    ) : (
                      <StyledText
                        numberOfLines={1}
                        textProps={{
                          numberOfLines: 1,
                        }}
                        style={{
                          ...styles.valueLabel,
                          color: item?.color ? item?.color : '#000',
                        }}>
                        {item?.[cardItem?.key]}
                      </StyledText>
                    )}
                  </View>
                </View>
              );
            })}
          </TouchableOpacity>
          <View style={[styles.actionContainer]}>
            {[...getActionsList(item)].map((ele, index) => {
              let isSHowIcon = ele.isShow ?? true;
              // @ts-ignore
              const Icon = ICONS[ele?.name];
              const ActiveIcon = ele?.activename
                ? ICONS[ele?.activename]
                : ICONS[ele?.name];
              const width = ele.width ?? 15;
              const height = ele.height ?? 15;
              if (ele?.disableKey && item[ele?.disableKey]) {
                return null;
              }
              return (
                <TouchableOpacity
                  disabled={ele?.isDisabled || item?.actionDisable || false}
                  style={[
                    styles.actionListContainer,
                    styles.actionIcons,
                    {
                      display: isSHowIcon ? 'flex' : 'none',
                      opacity:
                        ele?.isDisabled || item?.actionDisable || false
                          ? 0.5
                          : 1,
                      marginBottom: index === actionsList?.length - 1 ? 0 : 20,
                    },
                  ]}
                  onPress={() => {
                    if (onActionPress) onActionPress(ele.id, item);
                  }}
                  key={index.toString()}>
                  <Icon width={width} height={height} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={dataList}
        bounces={false}
        alwaysBounceVertical={false}
        initialNumToRender={30}
        showsVerticalScrollIndicator={false}
        renderItem={customRenderer ? customRenderer : renderCardItem}
        style={{flexGrow: 0}}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => {
          return (
            <ListEmptyComponent errorText="No data found" alignItems="center" />
          );
        }}
        ListFooterComponent={() => {
          return isEndRefresh ? (
            <View style={{width: '100%'}}>
              <ActivityIndicator size={'small'} color={COLORS.darkBlue} />
            </View>
          ) : null;
        }}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          if (onEndReached) {
            isScrollBeginRef.current = true;
            onEndReached();
          }
        }}
        onMomentumScrollBegin={() => {
          isScrollBeginRef.current = false;
        }}
        keyExtractor={(item: any, index: number) => JSON.stringify(item)}
      />
    </View>
  );
};

export default TableView;

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: COLORS.white,
    marginBottom: 10,
    borderRadius: 15,
    padding: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  headingContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderRadius: 15,
  },
  heading: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
  },
  headingtext: {
    fontSize: 12,
    fontFamily: FONTS.poppins.medium,
    color: COLORS.black,
  },
  actionListContainer: {
    width: 15,
    height: 15,
  },
  viewActionContainer: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: 5,
    borderRadius: 100,
  },
  headerLabel: {
    fontFamily: FONTS.poppins.medium,
  },
  valueLabel: {},
  rowContainer: {},
  actionContainer: {
    paddingTop: 6,
  },
  actionIcons: {
    backgroundColor: COLORS.backgroundColor,
    width: 33,
    height: 33,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  StatusActiveView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
