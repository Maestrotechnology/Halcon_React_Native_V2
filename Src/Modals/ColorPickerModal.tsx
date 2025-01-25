import {Modal, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import ColorPicker, {
  HueSlider,
  OpacitySlider,
  Panel1,
  PreviewText,
} from 'reanimated-color-picker';
import StyledText from '../Components/StyledText';
import CustomButton from '../Components/CustomButton';
import {COLORS} from '../Utilities/Constants';
import {FONTS} from '../Utilities/Fonts';
import {ColorPickerModalProps} from '../@types/general';
import SVGIcon from '../Components/SVGIcon';

const ColorPickerModal = ({
  isVisible = false,
  colorValueType = 'hex',
  colorValue,
  onClose,
  onSelect,
  title = 'Select color',
}: ColorPickerModalProps) => {
  const [color, setcolor] = useState(colorValue ?? '');

  return (
    <Modal visible={isVisible} transparent onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.childContainer}>
          <View style={styles.rowStyle}>
            <StyledText style={{fontFamily: FONTS.poppins.semibold}}>
              {title}
            </StyledText>
            <SVGIcon isButton onPress={onClose} icon="close_rounded_black" />
          </View>
          <ColorPicker
            thumbSize={20}
            value={color}
            onChange={color => {
              setcolor(color[colorValueType]);
            }}>
            <Panel1 style={{marginBottom: 18}} />
            <HueSlider style={{marginBottom: 20}} />
            <OpacitySlider style={{marginBottom: 20}} />
            <PreviewText colorFormat="hex" />
          </ColorPicker>
          <CustomButton
            style={{
              width: '50%',
              alignSelf: 'center',
              marginTop: 8,
            }}
            onPress={() => {
              onSelect(color);
              onClose();
            }}>
            Ok
          </CustomButton>
        </View>
      </View>
    </Modal>
  );
};

export default ColorPickerModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.transparentDimColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childContainer: {
    width: '90%',
    padding: 10,
    borderRadius: 6,
    backgroundColor: COLORS.white,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
});
