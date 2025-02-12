import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTSIZES} from '../Utilities/Constants';
import {FONTS} from '../Utilities/Fonts';
import StyledText from './StyledText';
import SVGIcon from './SVGIcon';
import ItemSelectionMiniList from './ItemSelectionMiniList';
import {DropdownBoxProps} from '../@types/general';
import SearchDropdownBoxModal from '../Modals/SearchDropdownBoxModal';

const DropdownBox = ({
  value,
  options = [],
  type = 'miniList',
  fieldName = '',
  errorText,
  icon = 'down_arrow',
  isDisabled = false,
  title,
  onSelect,
  searchFieldName,
  isEndReached = false,
  isRefreshing = false,
  onEndReached,
  onRefresh,
  apiType,
  isRequired,
  placeHolder,
  containerWidth,
  maxHeight,
  iconHeight = 15,
  iconWidth = 15,
  onIconPress,
  isEnableRightIcon = true,
  isLocalSearch = false,
  bigListProps,
}: DropdownBoxProps) => {
  const [isOpenModal, setisOpenModal] = useState<boolean>(false);

  const getPlaceHolder = () => {
    return 'Select' + ' ' + title;
  };

  const getValue = () => {
    if (value) {
      if (fieldName) {
        return value[fieldName];
      }
      return value;
    }
    return placeHolder ?? getPlaceHolder();
  };
  return (
    <>
      <View style={styles.container}>
        {title && (
          <StyledText style={{fontFamily: FONTS.poppins.medium}}>
            {title}{' '}
            {isRequired && (
              <StyledText style={{color: COLORS.red}}>*</StyledText>
            )}
          </StyledText>
        )}
        <TouchableOpacity
          onPress={() => {
            setisOpenModal(true);
          }}
          disabled={isDisabled}
          style={[
            styles.inputContainer,
            {
              backgroundColor: COLORS.white,
              borderColor: errorText ? COLORS.red : COLORS.primary,
            },
          ]}>
          <View style={styles.inputField}>
            <StyledText
              style={{
                color: value ? COLORS.black : COLORS.placeHolderColor,
              }}>
              {getValue()}
            </StyledText>
          </View>
          {isEnableRightIcon && (
            <TouchableOpacity
              onPress={() => {
                if (value && onIconPress) {
                  onIconPress();
                }
              }}
              style={styles.iconContainer}>
              <SVGIcon
                icon={value ? 'close_rounded_black' : 'down_arrow'}
                width={value ? 20 : iconWidth}
                height={value ? 20 : iconHeight}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {errorText ? (
          <StyledText style={styles.errorTxt}>
            {errorText.toString()}
          </StyledText>
        ) : null}
      </View>
      <Modal
        visible={isOpenModal}
        onRequestClose={() => {
          setisOpenModal(false);
        }}
        transparent>
        {type === 'miniList' && (
          <ItemSelectionMiniList
            onClose={() => {
              setisOpenModal(false);
            }}
            listData={[...options]}
            fieldName={fieldName}
            containerWidth={containerWidth}
            maxHeight={maxHeight}
            onSelectItem={value => {
              if (onSelect) {
                onSelect(value);
              }
              setisOpenModal(false);
            }}
          />
        )}
        {type === 'search' && (
          <SearchDropdownBoxModal
            title={title || ''}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            isLocalSearch={isLocalSearch}
            apiType={apiType}
            icon={icon}
            isEndReached={isEndReached}
            isRefreshing={isRefreshing}
            options={[...options]}
            fieldName={fieldName}
            searchFieldName={searchFieldName}
            onClose={() => {
              setisOpenModal(false);
            }}
            onSelect={value => {
              if (onSelect) {
                onSelect(value);
              }
              setisOpenModal(false);
            }}
            {...bigListProps}
          />
        )}
      </Modal>
    </>
  );
};

export default DropdownBox;

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  inputContainer: {
    height: 43,
    width: '100%',
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
  },
  errorTxt: {
    fontFamily: FONTS.poppins.medium,
    fontSize: FONTSIZES.tiny,
    color: COLORS.red,
  },
  iconContainer: {
    width: '13%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    width: '87%',
    height: '100%',
    justifyContent: 'center',
    borderRadius: 11,
    paddingHorizontal: 15,
    fontSize: FONTSIZES.tiny,
    fontFamily: FONTS.poppins.medium,
    color: COLORS.black,
  },
});
