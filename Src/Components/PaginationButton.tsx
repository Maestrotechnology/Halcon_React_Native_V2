import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from './CustomButton';
import StyledText from './StyledText';
import SVGIcon from './SVGIcon';
import {COLORS} from '../Utilities/Constants';
import {FONTS} from '../Utilities/Fonts';
type PaginationButtonProps = {
  onPressNextButton: (current: number) => void;
  onPressPreviousButton: (current: number) => void;
  CurrectPage?: number;
  totalPages: number;
};
export default function PaginationButton({
  onPressNextButton,
  onPressPreviousButton,
  totalPages,
}: PaginationButtonProps) {
  const [current, setCurrent] = useState(1);
  return (
    <View style={styles.ButtonFlex}>
      <CustomButton
        style={styles.ButtonStyle}
        gradientContainerStyle={styles.gradientContainerStyle}
        type="primary"
        isDisabled={current === 1}
        onPress={() => {
          if (current > 1) {
            setCurrent(pre => pre - 1);
            onPressPreviousButton(current - 1);
          }
        }}>
        <SVGIcon
          icon="leftArrowIcon"
          fill={COLORS.white}
          height={20}
          width={20}
        />
      </CustomButton>
      <StyledText style={styles.CurrentPage}>{current}</StyledText>
      <CustomButton
        style={styles.ButtonStyle}
        type="primary"
        isDisabled={current === totalPages}
        gradientContainerStyle={styles.gradientContainerStyle}
        onPress={() => {
          if (current < totalPages) {
            setCurrent(pre => pre + 1);
            onPressNextButton(current + 1);
          }
        }}>
        <SVGIcon
          icon="rightArrowIcon"
          fill={COLORS.white}
          height={20}
          width={20}
        />
      </CustomButton>
    </View>
  );
}
const styles = StyleSheet.create({
  ButtonFlex: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  CurrentPage: {
    width: '10%',
    alignSelf: 'flex-start',
    textAlign: 'center',
    verticalAlign: 'middle',
    alignItems: 'center',
    paddingTop: 10,
    fontFamily: FONTS.poppins.medium,
  },
  ButtonStyle: {
    borderRadius: 50,
    width: 40,
  },
  gradientContainerStyle: {
    borderRadius: 50,
    paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
});
