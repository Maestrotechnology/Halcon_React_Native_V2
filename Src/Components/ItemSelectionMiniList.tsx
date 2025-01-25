import {
  DimensionValue,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import StyledText from './StyledText';
import {FONTS} from '../Utilities/Fonts';
import SVGIcon from './SVGIcon';
import {COLORS, FONTSIZES, activeOpacityValue} from '../Utilities/Constants';
import {ItemSelectionMiniListProps} from '../@types/general';

type RenderItemProps = {
  item: any;
  index: number;
};

const ItemSelectionMiniList = ({
  title = 'test',
  listData = [],
  fieldName = '',
  containerWidth = '70%',
  onClose,
  maxHeight = '80%',
  onSelectItem,
  secondaryName = '',
}: ItemSelectionMiniListProps) => {
  const ItemSeperator = () => {
    return <View style={styles.divider} />;
  };

  const renderItem = ({item}: RenderItemProps) => {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacityValue}
        style={styles.itemContainer}
        onPress={() => {
          if (onSelectItem) {
            onSelectItem(item);
          }
        }}>
        <StyledText style={{paddingVertical: 5, textAlign: 'center'}}>
          {fieldName ? item[fieldName] : item}{' '}
        </StyledText>
        {secondaryName && (
          <StyledText style={{fontSize: FONTSIZES.small}}>
            {' '}
            {item[secondaryName]}
          </StyledText>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity
      style={styles.mainContainer}
      activeOpacity={1}
      onPress={onClose}>
      <View style={[styles.subContainer, {width: containerWidth, maxHeight}]}>
        <FlatList
          data={listData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContentContainer}
          ItemSeparatorComponent={() => {
            return <ItemSeperator />;
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ItemSelectionMiniList;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: COLORS.transparentDimColor,
  },
  subContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 8,
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  divider: {
    height: 1,
    opacity: 0.2,
    backgroundColor: COLORS.transparentDimColor,
    marginTop: 5,
  },
  itemContainer: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
