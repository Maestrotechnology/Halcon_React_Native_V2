import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import StyledText from '../Components/StyledText';
import {FONTS} from '../Utilities/Fonts';
import {COLORS, FONTSIZES, activeOpacityValue} from '../Utilities/Constants';
import CustomButton from '../Components/CustomButton';

type ButtonItemProp = {
  id: number;
  buttonName: string;
  isVisible?: boolean;
};

type ButtonProp = {
  item: ButtonItemProp;
  onPress: () => void;
};

type Props = {
  setModal: (val: boolean) => void;
  buttonsOptions: ButtonItemProp[];
  onPressOption: (id: number) => void;
};

const MenuContainer = ({
  setModal,
  buttonsOptions = [],
  onPressOption,
}: Props) => {
  const ButtonItem = ({item, onPress}: ButtonProp) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.buttonItemContainer]}
        activeOpacity={0.7}>
        <StyledText style={styles.buttonText}>{item.buttonName}</StyledText>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity
      style={styles.mainContainer}
      onPress={() => {
        setModal(false);
      }}>
      <TouchableOpacity
        style={styles.contentContainer}
        activeOpacity={activeOpacityValue}>
        <View style={styles.optionsContainer}>
          <FlatList
            removeClippedSubviews={false}
            data={buttonsOptions}
            renderItem={({item}) => {
              return (
                <ButtonItem
                  item={item}
                  onPress={() => {
                    onPressOption(item.id);
                  }}
                />
              );
            }}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => {
              return <View style={styles.divider} />;
            }}
          />
        </View>
        <CustomButton
          buttonProps={{
            activeOpacity: activeOpacityValue,
          }}
          onPress={() => {
            setModal(false);
          }}
          style={{marginTop: 5}}>
          Cancel
        </CustomButton>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MenuContainer;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  contentContainer: {
    padding: 15,
  },
  optionsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginVertical: 6,
  },
  buttonItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  buttonText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: FONTSIZES.small,
  },
});
