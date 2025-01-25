import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  CustomDrawerNavigationOptionsProps,
  RenderDrawerOptionsProps,
} from "../../@types/general";
import {
  COLORS,
  FONTSIZES,
  activeOpacityValue,
  BOX_SHADOW,
} from "../../Utilities/Constants";
import StyledText from "../../Components/StyledText";
import { FONTS } from "../../Utilities/Fonts";
import SVGIcon from "../../Components/SVGIcon";
import { clearStorage } from "../../Utilities/SecureStorage";
import { useDispatch } from "react-redux";
import {
  StoreToken,
  StoreUserDetails,
  setSelectedDrawerOption,
} from "../../Store/Slices/LoginSlice";
import { AlertBox, getTrimedText } from "../../Utilities/GeneralUtilities";
import { DrawerActions } from "@react-navigation/native";
import { baseUrl } from "../../Services/ServiceConstatnts";
import instance from "../../Services/Axios";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import {
  GetPermissions,
  GetUserData,
  GetUserProfileData,
  useSelectedDrawerOption,
} from "../../Utilities/StoreData";
import { AccessPermissionProps } from "../../Utilities/Reducertype";
import GlobaModal from "../../Components/GlobalModal";
import ConfirmationModal from "../../Modals/ConfirmationModal";

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
  const drawerNavigationOptions: CustomDrawerNavigationOptionsProps[] = [
    {
      id: 1,
      displayName: "Dashboard",
      navigate: "Dashboard",
      leftIcon: "dashboard_icon",
      activeIcon: "dashboardActiveIcon",
      isVisible: true,

      // isVisible: UserPermissions?.service_dashboard?.service_dashboard_menu
      //   ? true
      //   : false,
    },
    {
      id: 2,
      displayName: "Downtime SR",
      navigate: "ServiceRequestStack",
      leftIcon: "service_req_icon",
      activeIcon: "serviceReqActiveIcon",
      isVisible: true,

      // isVisible: UserPermissions?.service_request?.service_request_menu
      //   ? true
      //   : false,
    },
    {
      id: 3,
      displayName: "Preventive SR",
      navigate: "PreventiveSRStack",
      leftIcon: "preventive_icon",
      activeIcon: "preventiveActiveIcon",
      isVisible: true,
      // isVisible: UserPermissions?.preventive_sr?.preventive_sr_menu
      //   ? true
      //   : false,
    },
    // {
    //   id: 4,
    //   displayName: 'Maintenance Workorder',
    //   navigate: 'MaintenaceWorkOrderStack',
    //   leftIcon: 'work_order_icon',
    //   activeIcon: 'work_order_active_icon',
    //   isVisible: true,

    //   // isVisible: UserPermissions?.maintenance_workorder?.work_order_menu
    //   //   ? true
    //   //   : false,
    // },
    // {
    //   id: 5,
    //   displayName: 'My Profile',
    //   navigate: 'ProfileStack',
    //   leftIcon: 'profileIcon',
    //   activeIcon: 'profileActiveIcon',
    //   isVisible: true,
    // },

    {
      id: 6,
      displayName: "Logout",
      navigate: "",
      leftIcon: "logout",
      activeIcon: "logout",
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
        }}
      >
        <View style={{ alignItems: "flex-end", marginBottom: 15 }}>
          <SVGIcon
            icon="white_cross"
            isButton
            onPress={() => {
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
            width={20}
            height={20}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate('ProfileStack');
          }}
          activeOpacity={1}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: COLORS.white,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 10,
            borderColor: "rgba(255,255,255,0.25)",
            // ...BOX_SHADOW,
          }}
        >
          {userData?.pic ? (
            <Image
              source={{
                uri: userData?.pic,
              }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 100,
              }}
            />
          ) : (
            <SVGIcon icon="profile_vector" width={100} height={100} />
          )}
        </TouchableOpacity>
        <View style={{ marginLeft: 15, marginTop: 10 }}>
          <StyledText
            style={{ fontFamily: FONTS.poppins.medium, color: COLORS.black }}
          >
            {getTrimedText(userData?.name || "User", 15)}
          </StyledText>
          <StyledText
            style={{
              fontFamily: FONTS.poppins.medium,
              fontSize: FONTSIZES.tiny,
              color: "rgba(0,0,0,0.5)",
            }}
          >
            {getTrimedText(userData?.designation || "User", 15)}
          </StyledText>
        </View>
      </View>
    );
  };

  const renderDrawerOptions = ({ item, index }: RenderDrawerOptionsProps) => {
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          {
            display: item.isVisible ? "flex" : "none",
            backgroundColor:
              state?.index === item.id - 1 ? COLORS.orange : "transparent",
            marginBottom: 10,
          },
        ]}
        onPress={() => {
          if (item.id === 6) {
            setIsShowLogout(true);
          } else {
            dispatch(setSelectedDrawerOption(item.id));
            //@ts-ignore
            navigation.navigate(item.navigate);
          }
        }}
        activeOpacity={activeOpacityValue}
      >
        <View style={[styles.rowStyle]}>
          <SVGIcon
            icon={
              state?.index === item.id - 1 ? item?.activeIcon : item.leftIcon
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
                state?.index === item.id - 1
                  ? COLORS.white
                  : COLORS.textSecondary,
            }}
          >
            {item.displayName}
          </StyledText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screen, { paddingHorizontal: 0 }]}>
      {renderDrawerHeader()}
      <View style={styles.screen}>
        <FlatList
          style={{ flexGrow: 0 }}
          data={[...drawerNavigationOptions]}
          renderItem={renderDrawerOptions}
          showsVerticalScrollIndicator={false}
          keyExtractor={(
            item: CustomDrawerNavigationOptionsProps,
            index: number
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
    flexDirection: "row",
    alignItems: "center",
  },
  itemContainer: {
    padding: 5,
  },
});
