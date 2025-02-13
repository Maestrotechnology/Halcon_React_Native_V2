import {
  Animated,
  Easing,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  CustomDrawerNavigationOptionsProps,
  RenderDrawerOptionsProps,
  RenderSubMenuItemProps,
} from '../../@types/general';
import {
  COLORS,
  FONTSIZES,
  activeOpacityValue,
  BOX_SHADOW,
} from '../../Utilities/Constants';
import StyledText from '../../Components/StyledText';
import {FONTS} from '../../Utilities/Fonts';
import SVGIcon from '../../Components/SVGIcon';
import {clearStorage} from '../../Utilities/SecureStorage';
import {useDispatch} from 'react-redux';
import {
  StoreToken,
  StoreUserDetails,
  setSelectedDrawerOption,
} from '../../Store/Slices/LoginSlice';
import {AlertBox, getTrimedText} from '../../Utilities/GeneralUtilities';
import {DrawerActions} from '@react-navigation/native';
import {baseUrl} from '../../Services/ServiceConstatnts';
import instance from '../../Services/Axios';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {
  GetPermissions,
  GetUserData,
  GetUserProfileData,
  useSelectedDrawerOption,
} from '../../Utilities/StoreData';
import {AccessPermissionProps} from '../../Utilities/Reducertype';
import GlobaModal from '../../Components/GlobalModal';
import ConfirmationModal from '../../Modals/ConfirmationModal';
import {number} from 'yup';

const CustomDrawerNavigation = ({
  navigation,
  descriptors,
  state,
}: DrawerContentComponentProps) => {
  const dispatch = useDispatch();
  const userData = GetUserProfileData();
  const UserPermissions = GetPermissions();
  const selectedDrawerOption = useSelectedDrawerOption();
  const [isShowLogout, setIsShowLogout] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState({
    menu: 0,
    submenu: 0,
  });

  const [isExpanded, setIsExpanded] = useState(false); // Track submenu expansion state
  const animationValue = useRef(new Animated.Value(0)).current; // Animation value

  const drawerNavigationOptions: CustomDrawerNavigationOptionsProps[] = [
    {
      id: 1,
      displayName: 'Dashboard',
      navigate: 'Dashboard',
      leftIcon: 'dashboard_icon',
      activeIcon: 'dashboardActiveIcon',
      isVisible: true,
      // isVisible: UserPermissions?.service_dashboard?.service_dashboard_menu
      //   ? true
      //   : false,
    },
    {
      id: 2,
      isMenu: true,
      displayName: 'User Management',
      navigate: 'UserManagementStack',
      leftIcon: 'userIcon',
      activeIcon: 'userIcon',
      isVisible: true,
      children: [
        {
          id: 21,
          displayName: 'User',
          navigate: 'UserList',
          leftIcon: 'RoleIcon',
          activeIcon: 'RoleIcon',
          isVisible: true,
        },
        {
          id: 22,
          displayName: 'Role Access',
          navigate: 'AccessRoleList',
          leftIcon: 'RoleIcon',
          activeIcon: 'RoleIcon',
          isVisible: true,
        },
      ],
    },
    {
      id: 3,
      isMenu: true,
      displayName: 'Masters',
      navigate: 'MastersStack',
      leftIcon: 'userIcon',
      activeIcon: 'userIcon',
      isVisible: true,
      children: [
        {
          id: 31,
          displayName: 'Machines',
          navigate: 'Dashboard',
          leftIcon: 'RoleIcon',
          activeIcon: 'RoleIcon',
          isVisible: true,
        },
        {
          id: 32,
          displayName: 'Periodic Tasks',
          navigate: 'TasksList',
          leftIcon: 'RoleIcon',
          activeIcon: 'RoleIcon',
          isVisible: true,
        },
        {
          id: 33,
          displayName: 'Policy',
          navigate: 'Dashboard',
          leftIcon: 'RoleIcon',
          activeIcon: 'RoleIcon',
          isVisible: true,
        },
        {
          id: 34,
          displayName: 'Division',
          navigate: 'Dashboard',
          leftIcon: 'RoleIcon',
          activeIcon: 'RoleIcon',
          isVisible: true,
        },
        {
          id: 35,
          displayName: 'Holiday',
          navigate: 'Dashboard',
          leftIcon: 'RoleIcon',
          activeIcon: 'RoleIcon',
          isVisible: true,
        },
      ],
    },

    {
      id: 4,
      displayName: 'Downtime SR',
      navigate: 'ServiceRequestStack',
      leftIcon: 'service_req_icon',
      activeIcon: 'serviceReqActiveIcon',
      isVisible: true,
    },
    {
      id: 5,
      displayName: 'Preventive SR',
      navigate: 'PreventiveSRStack',
      leftIcon: 'preventive_icon',
      activeIcon: 'preventiveActiveIcon',
      isVisible: true,
    },

    {
      id: 6,
      displayName: 'Logout',
      navigate: '',
      leftIcon: 'logout',
      activeIcon: 'logout',
      isVisible: true,
    },
  ];

  const handleLogout = async () => {
    setIsShowLogout(false);
    await clearStorage();
    dispatch(StoreToken(null));
    dispatch(StoreUserDetails(null));
    instance.defaults.baseURL = baseUrl;
  };

  const handleCloseLogout = () => {
    setIsShowLogout(false);
  };

  const renderDrawerHeader = () => {
    return (
      <View
        style={{
          marginVertical: 10,
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          borderColor: COLORS.borderColor,
          paddingBottom: 15,
        }}>
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('ProfileStack');
            }}
            activeOpacity={1}
            style={{
              width: 60,
              height: 60,
              borderRadius: 50,
              backgroundColor: COLORS.white,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 10,
              borderColor: 'rgba(255,255,255,0.25)',
              // ...BOX_SHADOW,
            }}>
            {userData?.pic ? (
              <Image
                source={{
                  uri: userData?.pic,
                }}
                style={{
                  width: '50%',
                  height: '50%',
                  borderRadius: 100,
                }}
              />
            ) : (
              <SVGIcon icon="profile_vector" width={50} height={50} />
            )}
          </TouchableOpacity>
          <SVGIcon
            icon="white_cross"
            isButton
            onPress={() => {
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
            width={15}
            height={15}
          />
        </View>
        <View style={{marginLeft: 15}}>
          <StyledText
            style={{fontFamily: FONTS.poppins.medium, color: COLORS.black}}>
            {getTrimedText(userData?.name || 'User', 15)}
          </StyledText>
          <StyledText
            style={{
              fontFamily: FONTS.poppins.medium,
              fontSize: FONTSIZES.tiny,
              color: 'rgba(0,0,0,0.5)',
            }}>
            {getTrimedText(userData?.designation || 'User', 15)}
          </StyledText>
        </View>
      </View>
    );
  };

  const RenderSubMenu = ({
    item,
    index,
    mainItem,
  }: {
    item: CustomDrawerNavigationOptionsProps;
    index: number;
    mainItem: any;
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          {
            paddingHorizontal: 28,
            display: item?.isVisible ? 'flex' : 'none',
            // backgroundColor:
            //   state?.index === mainItem?.id - 1 ? COLORS.orange : 'transparent',
          },
        ]}
        onPress={() => {
          if (item?.id === 6) {
            setIsShowLogout(true);
          } else {
            dispatch(setSelectedDrawerOption(item?.id));
            navigation.navigate(mainItem?.navigate, {
              screen: item.navigate,
            });
          }
        }}
        activeOpacity={activeOpacityValue}>
        <>
          <View style={[styles.rowStyle, {paddingLeft: 0}]}>
            <SVGIcon
              icon={
                state?.index === item?.id - 1
                  ? item?.activeIcon
                  : item?.leftIcon
              }
              width={18}
              fill={COLORS.gray}
              height={18}
            />
            <StyledText
              style={{
                fontFamily: FONTS.poppins.medium,
                marginLeft: 10,
                fontSize: FONTSIZES.medium,
                color:
                  state?.index === item?.id - 1
                    ? COLORS.white
                    : COLORS.textSecondary,
              }}>
              {item?.displayName}
            </StyledText>
          </View>

          {item?.isMenu && selectedMenu?.menu === item?.id && item?.children ? (
            <RenderSubMenuItem
              children={item?.children || []}
              mainItem={item}
            />
          ) : null}
        </>
      </TouchableOpacity>
    );
  };
  const RenderSubMenuItem = ({children, mainItem}: RenderSubMenuItemProps) => {
    return children?.map((item, index: number) => (
      <RenderSubMenu item={item} index={index} mainItem={mainItem} />
    ));
  };
  const handlePressMenu = (item: any) => {
    if (item?.isMenu) {
      setIsExpanded(selectedMenu?.menu === item?.id ? false : true);
      setSelectedMenu({
        menu: selectedMenu?.menu === item?.id ? 0 : item?.id,
        submenu: 0,
      });
      dispatch(setSelectedDrawerOption(item?.id));
      Animated.timing(animationValue, {
        toValue: isExpanded ? 0 : 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    } else {
      if (item?.id === 6) {
        setIsShowLogout(true);
      } else {
        dispatch(setSelectedDrawerOption(item?.id));
        //@ts-ignore
        navigation.navigate(item.navigate);
      }
    }
  };

  const renderDrawerOptions = ({
    item,
    index,
  }: {
    item: CustomDrawerNavigationOptionsProps;
    index: number;
  }) => {
    // Interpolated height value for animation
    const animatedHeight = animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        0,
        (item?.isMenu ? item?.children?.length || 0 : 0) * 36 || 0,
      ],
    });
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          {
            display: item?.isVisible ? 'flex' : 'none',
            backgroundColor:
              state?.index === item?.id - 1 && !item?.isMenu
                ? COLORS.orange
                : 'transparent',
            marginBottom: 10,
          },
        ]}
        onPress={() => {
          handlePressMenu(item);
        }}
        activeOpacity={activeOpacityValue}>
        <>
          <View
            style={[
              styles.LineContainer,
              {
                backgroundColor:
                  state?.index === item?.id - 1 ? COLORS.orange : 'transparent',
              },
            ]}>
            <View style={[styles.rowStyle]}>
              <SVGIcon
                icon={
                  state?.index === item?.id - 1
                    ? item?.activeIcon
                    : item?.leftIcon
                }
                width={18}
                height={18}
              />
              <StyledText
                style={{
                  fontFamily: FONTS.poppins.medium,
                  marginLeft: 10,
                  fontSize: FONTSIZES.medium,
                  color:
                    state?.index === item?.id - 1 && !item?.isMenu
                      ? COLORS.white
                      : COLORS.textSecondary,
                }}>
                {item?.displayName}
              </StyledText>
            </View>
            {item?.isMenu && (
              <SVGIcon icon="down_arrow" width={15} height={15} />
            )}
          </View>
          {item?.isMenu && selectedMenu?.menu == item?.id ? (
            // <Animated.View style={{overflow: 'hidden', height: animatedHeight}}>
            <RenderSubMenuItem
              children={item?.children || []}
              mainItem={item}
            />
          ) : // </Animated.View>
          null}
        </>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screen, {paddingHorizontal: 0}]}>
      {renderDrawerHeader()}
      <View style={styles.screen}>
        <FlatList
          style={{flexGrow: 0}}
          data={[...drawerNavigationOptions]}
          renderItem={renderDrawerOptions}
          showsVerticalScrollIndicator={false}
          keyExtractor={(
            item: CustomDrawerNavigationOptionsProps,
            index: number,
          ) => index.toString()}
        />
      </View>

      {isShowLogout ? (
        <GlobaModal visible={isShowLogout} onClose={handleCloseLogout}>
          <ConfirmationModal
            onClose={handleCloseLogout}
            visible={isShowLogout}
            onConfirmPress={handleLogout}
            msg="Are you sure that want to logout?"
          />
        </GlobaModal>
      ) : null}
    </View>
  );
};

export default CustomDrawerNavigation;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: COLORS.backgroundColor,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContainer: {
    padding: 5,
  },
  LineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
