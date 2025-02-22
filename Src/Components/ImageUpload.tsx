import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {
  CameraOptionsType,
  ImageInputBoxProps,
  ImageProps,
  RenderImageProps,
} from '../@types/general';
import {BottomSheetModal, TouchableOpacity} from '@gorhom/bottom-sheet';
import StyledText from './StyledText';
import {FONTS} from '../Utilities/Fonts';
import {
  COLORS,
  FONTSIZES,
  BOX_SHADOW,
  WINDOW_WIDTH,
} from '../Utilities/Constants';
import CustomButton from './CustomButton';
import BottomSheet from './BottomSheet';
import {cameraOptions} from '../Utilities/StaticDropdownOptions';
import SVGIcon from './SVGIcon';
import {
  androidCameraAccessPermission,
  getIsGrantedGalleryPermission,
} from '../Utilities/Permissions';
import ImagePicker from 'react-native-image-crop-picker';
import {
  generateUniqueId,
  getFileNameFromUrl,
  getTrimedText,
} from '../Utilities/GeneralUtilities';
import MenuContainer from '../Modals/MenuContainer';
import ListEmptyComponent from './ListEmptyComponent';
import Toast from './Toast';

const ImageUpload = ({
  onSelect,
  value,
  errorText,
  title = 'Choose your file',
  isRequired = false,
  imgOptions,
  isShowSelectImage = true,
  onPressImgOption,
  isEndRefresh = false,
  isRefreshing = false,
  onEndReached,
  onRefresh,
  isPreventive,
}: ImageInputBoxProps) => {
  const isScrollBeginRef = useRef(true);
  const cameraRef = useRef<BottomSheetModal>(null);
  const [isShowOptions, setisShowOptions] = useState<boolean>(false);
  const [selectedItem, setselectedItem] = useState<ImageProps | null>(null);

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
            file_title: getFileNameFromUrl(image.path),
            file: image.path,
            attachment_id: generateUniqueId(),
          };
          cameraRef.current?.close();
          onSelect(tempData);
        })
        .catch(e => {});
    }
  };

  const handleImage = async () => {
    const galleryPermission = await getIsGrantedGalleryPermission();

    // if (galleryPermission) {
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
          file_title: getFileNameFromUrl(image.path),
          file: image.path,
          attachment_id: generateUniqueId(),
        };
        cameraRef.current?.close();
        onSelect(tempData);
      })
      .catch(error => {});
    // }
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

  const RenderImage = ({item, index = 1}: RenderImageProps) => {
    let ImageUrl: any = item?.file;
    const isLastImage = index + 1 / 3 === 0;
    return (
      <View
        style={[
          {marginVertical: 25},
          isLastImage ? {marginRight: 0} : {marginRight: 8},
        ]}>
        <View
          style={{
            width: WINDOW_WIDTH / 3 - 20,
            height: 110,
            position: 'relative',
          }}>
          {item?.file && (
            <Image
              source={{uri: ImageUrl}}
              style={{width: '100%', height: 100, position: 'relative'}}
              resizeMode="cover"
              // onError={() => {
              //   ImageUrl = 'https://dummyimage.com/100x100/ccc/fff';
              // }}
            />
          )}
          <TouchableOpacity
            onPress={() => {
              setselectedItem(item);
              setisShowOptions(true);
            }}
            style={{
              position: 'absolute',
              right: -3,
              top: -100,
              backgroundColor: COLORS.borderColor,
              borderRadius: 50,
            }}>
            <SVGIcon
              icon="more_option"
              width={16}
              height={16}
              fill={COLORS.white}
            />
          </TouchableOpacity>

          <StyledText>{getTrimedText(item.file_title, 20)}</StyledText>
        </View>
      </View>
    );
  };

  return (
    <View style={isPreventive ? {flex: 1} : {}}>
      {isShowSelectImage && (
        <>
          {title ? (
            <StyledText style={{fontFamily: FONTS.poppins.medium}}>
              {title}{' '}
              {isRequired && (
                <StyledText style={{color: COLORS.red}}>*</StyledText>
              )}
            </StyledText>
          ) : null}
          <CustomButton
            onPress={openCameraPopup}
            style={{borderRadius: 50, width: '50%'}}
            gradientContainerStyle={{borderRadius: 50}}>
            Choose File
          </CustomButton>
          {errorText ? (
            <StyledText style={styles.errorTxt}>
              {errorText.toString()}
            </StyledText>
          ) : null}
        </>
      )}

      <FlatList
        nestedScrollEnabled
        data={[...value]}
        bounces={false}
        alwaysBounceVertical={false}
        initialNumToRender={10}
        numColumns={3}
        columnWrapperStyle={{
          flexDirection: 'row',
          columnGap: 5,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={RenderImage}
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
            // debounceOnEndReached();
          }
        }}
        onMomentumScrollBegin={() => {
          isScrollBeginRef.current = false;
        }}
        keyExtractor={(item: any, index: number) => index.toString()}
      />

      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 10,
          columnGap: 15,
        }}>
        {Array.isArray(value) &&
          value.length > 0 &&
          value.map((ele, index) => (
            <RenderImage key={index.toString()} item={ele} index={index + 1} />
          ))}
      </View> */}
      <BottomSheet
        bottomSheetModalRef={cameraRef}
        onClose={() => {
          cameraRef.current?.close();
        }}>
        <StyledText
          style={{fontFamily: FONTS.poppins.bold, fontSize: FONTSIZES.medium}}>
          {title}
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

      <Modal
        transparent
        visible={isShowOptions}
        onRequestClose={() => {
          setisShowOptions(false);
        }}>
        <MenuContainer
          setModal={setisShowOptions}
          buttonsOptions={[...imgOptions]}
          onPressOption={id => {
            if (onPressImgOption && selectedItem) {
              onPressImgOption(id, selectedItem);
            }
            setisShowOptions(false);
          }}
        />
      </Modal>
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
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
  errorTxt: {
    fontFamily: FONTS.poppins.medium,
    fontSize: FONTSIZES.tiny,
    color: COLORS.red,
  },
});
