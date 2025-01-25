import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HOCView from '../../Components/HOCView';
import {
  BOX_SHADOW,
  COLORS,
  FONTSIZES,
  PERMISSION_KEY,
  WINDOW_WIDTH,
  activeOpacityValue,
} from '../../Utilities/Constants';
import {GetUserData, UseToken} from '../../Utilities/StoreData';
import StyledText from '../../Components/StyledText';
import {FONTS} from '../../Utilities/Fonts';
import {AlertBox} from '../../Utilities/GeneralUtilities';
import {useDispatch} from 'react-redux';
import {clearStorage, storeUserSession} from '../../Utilities/SecureStorage';
import {StoreToken, StoreUserDetails} from '../../Store/Slices/LoginSlice';
import instance from '../../Services/Axios';
import {baseUrl} from '../../Services/ServiceConstatnts';
import {getAccessUserService} from '../../Services/Services';
import Toast from '../../Components/Toast';
import {
  GetAccessPermissionApiResponseProps,
  GetAccessPermissionDataProps,
} from '../../@types/api';
import {handleStorePermissions} from '../../Store/Slices/AccessPermissionSlice';

var isMount = true;

const PermisionDeniedStack = () => {
  const dispatch = useDispatch();
  const userData = GetUserData();
  const token = UseToken();
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    isMount = true;
    return () => {
      isMount = false;
    };
  }, []);

  const handleGetAccess = () => {
    if (isMount) {
      setisLoading(true);
    }
    const formData = new FormData();
    formData.append('token', token);
    getAccessUserService(formData)
      .then(async res => {
        const response: GetAccessPermissionApiResponseProps = res.data;
        const permissions: string = res.data.data;
        const permissionData: GetAccessPermissionDataProps =
          JSON.parse(permissions);
        if (response.status === 1) {
          if (permissionData.maintenance) {
            await storeUserSession(PERMISSION_KEY, permissionData.maintenance);
            dispatch(
              handleStorePermissions(permissionData?.maintenance || null),
            );
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisLoading(false);
        }
      });
  };

  return (
    <HOCView
      isShowSecondaryHeader
      secondaryHeaderTitle="Permission Denied"
      isLoading={isLoading}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View style={[styles.cardContainer, BOX_SHADOW]}>
          <StyledText style={styles.boldText}>
            Welcome {userData?.user_name || 'User'}
          </StyledText>
          <StyledText style={{color: COLORS.borderColor, textAlign: 'center'}}>
            You lack necessary authorization Access to the app is denied
          </StyledText>
          <TouchableOpacity
            onPress={() => {
              AlertBox({
                alertMsg: 'Are you sure want to logout?',
                onPressPositiveButton() {
                  clearStorage();
                  dispatch(StoreToken(null));
                  dispatch(StoreUserDetails(null));
                  instance.defaults.baseURL = baseUrl;
                },
              });
            }}
            activeOpacity={activeOpacityValue}
            style={[styles.btn, {backgroundColor: COLORS.orange}]}>
            <StyledText style={[styles.btnTxt, {color: COLORS.white}]}>
              Logout
            </StyledText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleGetAccess}
            activeOpacity={activeOpacityValue}
            style={[
              styles.btn,
              {borderWidth: 1.5, borderColor: COLORS.orange},
            ]}>
            <StyledText style={[styles.btnTxt, {color: COLORS.orange}]}>
              Try Again
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>
    </HOCView>
  );
};

export default PermisionDeniedStack;

const styles = StyleSheet.create({
  cardContainer: {
    width: WINDOW_WIDTH - 30,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
  },
  btn: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 5,
  },
  btnTxt: {
    fontFamily: FONTS.poppins.medium,
  },
  boldText: {
    fontFamily: FONTS.poppins.semibold,
    fontSize: FONTSIZES.large,
    textAlign: 'center',
  },
});
