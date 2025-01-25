import {
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, WINDOW_WIDTH} from '../Utilities/Constants';
import {ICONS} from '../Utilities/Icons';
import StyledText from './StyledText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FONTS} from '../Utilities/Fonts';

const GlobaModal = ({
  children,
  visible,
  onClose,
  title,
  bgColor,
}: {
  children: JSX.Element;
  visible: boolean;
  onClose: () => void;
  title?: string;
  bgColor?: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Modal
      // statusBarTranslucent
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{
          ...styles.centeredView,
          backgroundColor: bgColor ? bgColor : COLORS.transparentDimColor,
        }}>
        <KeyboardAwareScrollView>
          <TouchableOpacity activeOpacity={1} style={{...styles.modalView}}>
            <View
              style={{
                ...styles.headerContainer,
                justifyContent: title ? 'space-between' : 'flex-end',
              }}>
              {title ? (
                <StyledText style={styles.headerText}>{title}</StyledText>
              ) : null}
              <TouchableOpacity onPress={onClose} activeOpacity={0.5}>
                <ICONS.failureIcon width={20} height={20} />
              </TouchableOpacity>
            </View>
            <View style={{...styles.mW100, ...styles.childContainer}}>
              {children}
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </TouchableOpacity>
    </Modal>
  );
};

export default GlobaModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: COLORS.transparentDimColor,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    // paddingVertical: 35,

    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: WINDOW_WIDTH - 40,
  },
  childContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  mW100: {
    maxWidth: '100%',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: FONTS.poppins.bold,
    fontSize: 16,
    fontWeight: '700',
  },
});
