import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import HOCView from '../../../Components/HOCView';
import {
  GetUserData,
  GetUserProfileData,
  UseToken,
} from '../../../Utilities/StoreData';
import SVGIcon from '../../../Components/SVGIcon';
import {ICONS} from '../../../Utilities/Icons';
import {
  COLORS,
  EMAIL_REGEX,
  FONTSIZES,
  PHONE_NUMBER_REGEX,
  BOX_SHADOW,
} from '../../../Utilities/Constants';
import TextInputBox from '../../../Components/TextInputBox';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import CustomButton from '../../../Components/CustomButton';
import Toast from '../../../Components/Toast';
import {
  getProfileService,
  updateProfileService,
  verifyProfileEmailAndPhoneService,
} from '../../../Services/Services';
import {JSONtoformdata} from '../../../Utilities/Methods';
import {
  generateUniqueId,
  getCatchMessage,
  getFileNameFromUrl,
} from '../../../Utilities/GeneralUtilities';
import GlobaModal from '../../../Components/GlobalModal';
import OtpVerification from '../../AuthScreens/OtpVerification';
import VerificationModal from '../../../Modals/VerificationModal';
import {StoreUserProfileData} from '../../../Store/Slices/LoginSlice';
import {useDispatch} from 'react-redux';
import BottomSheet from '../../../Components/BottomSheet';
import StyledText from '../../../Components/StyledText';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {FONTS} from '../../../Utilities/Fonts';
import {CameraOptionsType} from '../../../@types/general';
import {
  androidCameraAccessPermission,
  getIsGrantedGalleryPermission,
} from '../../../Utilities/Permissions';
import {cameraOptions} from '../../../Utilities/StaticDropdownOptions';
import ImagePicker from 'react-native-image-crop-picker';

type verificationModalProps = {
  status: boolean;
  key: string;
  type: 'email' | 'mobile';
};
type InputKeyProps =
  | 'username'
  | 'userid'
  | 'designation'
  | 'mobile'
  | 'orgcode'
  | 'email'
  | 'rfid'
  | 'alternativemobile';
const MyProfile = () => {
  const userDetails = GetUserProfileData();
  const token = UseToken();
  const dispatch = useDispatch();
  const cameraRef = useRef<BottomSheetModal>(null);

  const [editProfile, setEditProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [verifycationModal, setVerificationModal] =
    useState<verificationModalProps>({
      status: false,
      key: '',
      type: 'email',
    });
  const [verified, setVerified] = useState({
    email: userDetails?.email_id,
    mobile: userDetails?.phone_no,
  });
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Name is required')
      .trim('Remove leading and trailing spaces')
      .strict(true),
    email: Yup.string()
      .matches(EMAIL_REGEX, 'Invalid email address')
      .trim('Remove leading and trailing spaces')
      .strict(true),
    mobile: Yup.string()
      .matches(PHONE_NUMBER_REGEX, 'Enter valid mobile number')
      .trim('Remove leading and trailing spaces')
      .strict(true)
      .required('* Mobile number is required')
      .min(10, 'Mobile number must have 10 digits')
      .max(10, 'Mobile number must have 10 digits'),
    alternativemobile: Yup.string()
      .matches(PHONE_NUMBER_REGEX, 'Enter valid mobile number')
      .min(10, 'Alternative number must have 10 digits')
      .nullable()
      .trim('Remove leading and trailing spaces')
      .strict(true),
  });
  const {
    values,
    touched,
    errors,
    setFieldValue,
    handleChange,
    handleSubmit,
    resetForm,
    initialValues,
  } = useFormik({
    initialValues: {
      username: userDetails?.name ? userDetails?.name : '',
      userid: userDetails?.user_id ? userDetails?.user_id : '',
      designation: userDetails?.designation ? userDetails?.designation : '',
      mobile: userDetails?.phone_no ? userDetails?.phone_no : '',
      orgcode: userDetails?.org_code ? userDetails?.org_code : '',
      email: userDetails?.email_id ? userDetails?.email_id : '',
      rfid: userDetails?.rfid ? userDetails?.rfid : editProfile ? '' : '',
      alternativemobile: userDetails?.alternative_mobile
        ? userDetails?.alternative_mobile
        : '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: () => {
      if (needToVerifyPhone()) {
        Toast.error('Please verify your mobile number');
      } else if (needToVerifyEmail()) {
        Toast.error('Please verify your email');
      } else {
        updateProfile();
      }
    },
  });

  useEffect(() => {
    if (token) {
      handleGetProfile();
    }
  }, [token]);

  const needToVerifyPhone = () => {
    if (values.mobile !== verified?.mobile && !errors?.mobile) {
      return true;
    }
    return false;
  };

  const needToVerifyEmail = () => {
    if (values.email !== verified?.email && !errors?.email) {
      return true;
    }
    return false;
  };
  const updateProfile = () => {
    setIsLoading(true);
    const data = {
      token: token,
      name: values.username,
      email_id: values.email,
      phone_number: values.mobile,
      alternative_mobile: values.alternativemobile,
      image: selectedImage ? selectedImage : '',
    };
    updateProfileService(JSONtoformdata(data))
      .then(res => {
        if (res?.data?.msg) {
          Toast.success(res?.data?.msg);
          handleGetProfile();
          setEditProfile(false);
        } else {
          Toast.error(res?.data?.msg);
        }
      })
      .catch(err => getCatchMessage(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGetProfile = () => {
    const data = {
      token: token,
    };
    getProfileService(JSONtoformdata(data)).then(response => {
      if (response?.data?.status === 1) {
        dispatch(StoreUserProfileData(response.data.data));
      }
    });
  };

  const verifyMobileAndEmail = (isEmail = false) => {
    setIsLoading(true);
    let tempdata = {token: token, project_id: 1};
    let data = {};
    if (isEmail) {
      data = {...tempdata, email: values.email};
    } else {
      data = {
        ...tempdata,
        mobile_no: values.mobile,
      };
    }

    verifyProfileEmailAndPhoneService(JSONtoformdata(data))
      .then(res => {
        if (res?.data?.status) {
          setVerificationModal({
            key: res?.data?.reset_key || '',
            status: true,
            type: isEmail ? 'email' : 'mobile',
          });
        } else {
          Toast.error(res?.data?.msg);
        }
      })
      .catch(err => {
        getCatchMessage(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCloseVerification = () => {
    setVerificationModal({
      key: '',
      status: false,
      type: 'email',
    });
  };

  const getVerifyMail = () => {
    if (verifycationModal?.type === 'email') {
      return values.email;
    }
    return values.mobile;
  };

  const openCameraPopup = useCallback(() => {
    Keyboard.dismiss();
    cameraRef?.current?.present();
  }, []);

  function handleProfilePicOptions(selectedItem: number) {
    switch (selectedItem) {
      case 1:
        handleCamera();
        break;
      case 2:
        handleImage();
        break;
      default:
        break;
    }
  }

  const handleCamera = async () => {
    const cameraPermission = await androidCameraAccessPermission();
    if (cameraPermission) {
      ImagePicker.openCamera({
        width: 500,
        height: 500,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
        forceJpg: true,
      })
        .then(image => {
          const tempData = {
            type: image.mime,
            name: getFileNameFromUrl(image.path),
            uri: image.path,
          };
          cameraRef.current?.close();
          setSelectedImage(tempData);
        })
        .catch(e => {});
    }
  };

  const handleImage = async () => {
    const galleryPermission = await getIsGrantedGalleryPermission();
    if (galleryPermission) {
      ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true,
        mediaType: 'photo',
        smartAlbums: [
          'PhotoStream',
          'Generic',
          'Panoramas',
          'Favorites',
          'Timelapses',
          'AllHidden',
          'RecentlyAdded',
          'Bursts',
          'SlomoVideos',
          'UserLibrary',
          'SelfPortraits',
          'Screenshots',
          'DepthEffect',
          'LivePhotos',
          'Animated',
          'LongExposure',
        ],
      })
        .then(image => {
          const tempData = {
            type: image.mime,
            name: getFileNameFromUrl(image.path),
            uri: image.path,
          };
          cameraRef.current?.close();
          setSelectedImage(tempData);
        })
        .catch(error => {});
    }
  };

  const RenderCameraOptions = ({icon, text = '', id}: CameraOptionsType) => {
    return (
      <View
        style={{
          flexDirection: 'column',
          marginHorizontal: 10,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            cameraRef.current?.close();
            handleProfilePicOptions(id);
            // if (isMount) {
            //   setisDisabled(true);
            // }
          }}
          style={styles.cameraOptionContainer}>
          <SVGIcon
            icon={icon}
            width={25}
            height={25}
            fill={COLORS.dangerColor}
          />
        </TouchableOpacity>
        <StyledText
          style={{
            fontFamily: FONTS.poppins.medium,
            fontSize: FONTSIZES.tiny,
          }}>
          {text}
        </StyledText>
      </View>
    );
  };

  const getInputValue = (key: InputKeyProps) => {
    return values[key] ? values[key] : editProfile ? '' : '-';
  };

  return (
    <HOCView
      isEnableScrollView
      isLoading={isLoading}
      headerProps={{
        headerTitle: 'My Profile',
      }}>
      <View>
        <TouchableOpacity
          onPress={() => {
            setEditProfile(pre => !pre);
            resetForm({
              values: {
                ...initialValues,
                mobile: verified.mobile,
                email: verified.email,
              },
            });
          }}
          style={styles.editContainer}>
          {!editProfile ? (
            <ICONS.profileEditIcon width={22} />
          ) : (
            <ICONS.close_rounded_black fill={COLORS.green} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (editProfile) {
              openCameraPopup();
            }
          }}
          activeOpacity={editProfile ? 0.7 : 1}
          style={styles.imageContainer}>
          {userDetails?.pic ? (
            <Image
              style={styles.image}
              source={{
                uri: selectedImage ? selectedImage?.uri : userDetails?.pic,
              }}
            />
          ) : (
            // <Image
            //   style={styles.image}
            //   source={require('../../../Assets/Images/userImage.jpg')}
            // />
            <SVGIcon icon="profile_vector" width={100} height={100} />
          )}
          {editProfile ? (
            <View style={styles.camContainer}>
              <ICONS.profile_option_camera style={styles.camIcon} />
            </View>
          ) : null}
        </TouchableOpacity>
        <View>
          <TextInputBox
            title="Name"
            value={getInputValue('username')}
            onChangeText={text => {
              setFieldValue('username', text);
            }}
            isEditable={editProfile}
            errorText={
              errors.username && touched?.username ? errors?.username : ''
            }
            customInputBoxContainerStyle={{
              borderColor: editProfile ? COLORS.primary : COLORS.secondary,
            }}
            disableNonEditableBg
            textInputProps={{
              maxLength: 25,
            }}
          />
          <TextInputBox
            title="User Id"
            value={getInputValue('userid')}
            onChangeText={text => {
              setFieldValue('userid', text);
            }}
            isEditable={editProfile}
            errorText={errors.userid && touched?.userid ? errors?.userid : ''}
            customInputBoxContainerStyle={{
              borderColor: editProfile ? COLORS.primary : COLORS.secondary,
            }}
            disableNonEditableBg
            textInputProps={{
              readOnly: true,
            }}
          />
          <TextInputBox
            title="Designation"
            value={getInputValue('designation')}
            onChangeText={text => {
              setFieldValue('designation', text);
            }}
            isEditable={editProfile}
            errorText={
              errors.designation && touched?.designation
                ? errors?.designation
                : ''
            }
            customInputBoxContainerStyle={{
              borderColor: editProfile ? COLORS.primary : COLORS.secondary,
            }}
            disableNonEditableBg
            textInputProps={{
              readOnly: true,
            }}
          />
          <TextInputBox
            title="Mobile Number"
            value={getInputValue('mobile')}
            onChangeText={text => {
              setFieldValue('mobile', text);
            }}
            isEditable={editProfile}
            errorText={errors.mobile && touched?.mobile ? errors?.mobile : ''}
            customInputBoxContainerStyle={{
              borderColor: editProfile ? COLORS.primary : COLORS.secondary,
            }}
            disableNonEditableBg
            hasVerify={needToVerifyPhone()}
            onVerifyPress={() => {
              verifyMobileAndEmail(false);
            }}
            keyboardType="number-pad"
            textInputProps={{
              maxLength: 10,
            }}
          />
          <TextInputBox
            title="Organization Code"
            value={getInputValue('orgcode')}
            onChangeText={text => {
              setFieldValue('orgcode', text);
            }}
            isEditable={editProfile}
            errorText={
              errors.orgcode && touched?.orgcode ? errors?.orgcode : ''
            }
            customInputBoxContainerStyle={{
              borderColor: editProfile ? COLORS.primary : COLORS.secondary,
            }}
            disableNonEditableBg
            textInputProps={{
              readOnly: true,
            }}
          />
          <TextInputBox
            title="Email Id"
            value={getInputValue('email')}
            onChangeText={text => {
              setFieldValue('email', text);
            }}
            isEditable={editProfile}
            errorText={errors.email && touched?.email ? errors?.email : ''}
            customInputBoxContainerStyle={{
              borderColor: editProfile ? COLORS.primary : COLORS.secondary,
            }}
            disableNonEditableBg
            hasVerify={needToVerifyEmail()}
            onVerifyPress={() => {
              verifyMobileAndEmail(true);
            }}
          />
          <TextInputBox
            title="RFID Reference Number"
            value={getInputValue('rfid')}
            onChangeText={text => {
              setFieldValue('rfid', text);
            }}
            isEditable={editProfile}
            errorText={errors.rfid && touched?.rfid ? errors?.rfid : ''}
            customInputBoxContainerStyle={{
              borderColor: editProfile ? COLORS.primary : COLORS.secondary,
            }}
            disableNonEditableBg
            textInputProps={{
              maxLength: 15,
            }}
          />
          <TextInputBox
            title="Alternative Number"
            value={getInputValue('alternativemobile')}
            onChangeText={text => {
              setFieldValue('alternativemobile', text);
            }}
            isEditable={editProfile}
            errorText={
              errors.alternativemobile && touched?.alternativemobile
                ? errors?.alternativemobile
                : ''
            }
            customInputBoxContainerStyle={{
              borderColor: editProfile ? COLORS.primary : COLORS.secondary,
            }}
            disableNonEditableBg
            keyboardType="number-pad"
            textInputProps={{
              maxLength: 10,
            }}
          />
        </View>

        {editProfile && (
          <CustomButton
            onPress={() => {
              handleSubmit();
            }}
            style={{
              marginTop: 8,
            }}>
            Update
          </CustomButton>
        )}
      </View>
      {verifycationModal.status ? (
        <GlobaModal
          visible={verifycationModal.status}
          onClose={handleCloseVerification}>
          <VerificationModal
            resetkey={verifycationModal.key}
            verifymail={getVerifyMail()}
            type={verifycationModal.type}
            onClose={handleCloseVerification}
            token={token}
            onVerificationComplete={value => {
              if (value === 'email') {
                setVerified(pre => ({...pre, email: values.email}));
                return;
              }
              setVerified(pre => ({...pre, mobile: values.mobile}));
            }}
          />
        </GlobaModal>
      ) : null}

      <BottomSheet
        bottomSheetModalRef={cameraRef}
        onClose={() => {
          cameraRef.current?.close();
        }}
        snapPoints={['22%']}>
        <StyledText
          style={{fontFamily: FONTS.poppins.bold, fontSize: FONTSIZES.medium}}>
          {'Choose your image'}
        </StyledText>
        <View style={{flexDirection: 'row'}}>
          {[...cameraOptions].map(ele => {
            return (
              <RenderCameraOptions
                key={ele.id.toString()}
                icon={ele.icon}
                text={ele.name}
                id={ele.id}
              />
            );
          })}
        </View>
      </BottomSheet>
    </HOCView>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 100,
    alignSelf: 'center',
    position: 'relative',
    borderWidth: 10,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  camIcon: {
    // position: 'absolute',
    // bottom: 10,
    // right: 10,
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    borderColor: COLORS.secondary,
  },
  editContainer: {
    backgroundColor: COLORS.white,

    borderRadius: 10,
    width: 35,
    height: 35,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  cameraOptionContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 50,
    marginVertical: 10,
    ...BOX_SHADOW,
  },
  camContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 50,
  },
  errorTxt: {
    fontFamily: FONTS.poppins.medium,
    fontSize: FONTSIZES.tiny,
    color: COLORS.red,
  },
});
