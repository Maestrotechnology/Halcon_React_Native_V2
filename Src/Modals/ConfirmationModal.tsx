import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import StyledText from '../Components/StyledText';
import CustomButton from '../Components/CustomButton';
import {useDispatch} from 'react-redux';
import {UseToken} from '../Utilities/StoreData';
import {logoutService} from '../Services/Services';
import {ConvertJSONtoFormData} from '../Utilities/Methods';
import Toast from '../Components/Toast';
import {getCatchMessage} from '../Utilities/GeneralUtilities';
import {clearStorage} from '../Utilities/SecureStorage';
import {COLORS} from '../Utilities/Constants';

const ConfirmationModal = ({
  visible,
  onClose,
  successText = 'Confirm',
  failureText = 'Cancel',
  msg = 'Are you sure you want to logged out?',
  onConfirmPress,
  onCancelPress,
}: {
  visible: boolean;
  onClose: () => void;
  successText?: string;
  failureText?: string;
  msg?: string;
  onConfirmPress?: () => void;
  onCancelPress?: () => void;
}) => {
  const dispatch = useDispatch();
  const token = UseToken();

  return (
    <View>
      <StyledText>{msg}</StyledText>

      <View style={styles.btnContainer}>
        <CustomButton
          type="secondary"
          style={{
            width: '48%',
          }}
          onPress={() => {
            if (onCancelPress) {
              onCancelPress();
            } else {
              onClose();
            }
          }}>
          {failureText}
        </CustomButton>
        <CustomButton
          style={{
            width: '48%',
          }}
          onPress={onConfirmPress}>
          {successText}
        </CustomButton>
      </View>
    </View>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 12,
  },
});
