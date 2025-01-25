import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { LoaderStatus } from "../Utilities/StoreData";
import Loader from "./Loader";
import { COLORS, FONTSIZES } from "../Utilities/Constants";
import { ICONS } from "../Utilities/Icons";
import StyledText from "./StyledText";
import { FONTS } from "../Utilities/Fonts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppLogo from "../Assets/Images/applogo.svg";

const AuthHocView = ({
  children,
  isBack,
  backPress,
}: {
  children: JSX.Element;
  isBack?: boolean;
  backPress?: () => void;
}) => {
  const loading = LoaderStatus();
  return (
    <View style={styles.authContainer}>
      {loading ? (
        <Loader
          isVisible
          backgroundColor="rgba(0,0,0,0.3)"
          color={COLORS.primary}
        />
      ) : null}
      {isBack && (
        <TouchableOpacity style={styles.backBtnContainer} onPress={backPress}>
          <ICONS.backArrowIcon />
          <StyledText
            onPress={backPress}
            style={{ fontSize: FONTSIZES.medium, paddingHorizontal: 6 }}
          >
            Back
          </StyledText>
        </TouchableOpacity>
      )}

      <KeyboardAwareScrollView
        extraScrollHeight={10}
        style={{ flex: 1 }}
        enableOnAndroid={true}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
        scrollEnabled={true}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <View style={styles.logoContainer}>
            {/* <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="center"
              source={require("../Assets/Images/applogo.png")}
            /> */}
            <AppLogo
              width={250}
              style={{
                alignSelf: "center",
              }}
            />
          </View>

          <View
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            {children}
          </View>
        </View>
      </KeyboardAwareScrollView>
      {/* <KeyboardAwareScrollView
        scrollEnabled
        keyboardShouldPersistTaps={'handled'}
        bounces={false}
        // contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="center"
            source={require('../Assets/Images/applogo.png')}
          />
        </View>
        <View style={{backgroundColor: 'green', flex: 1}}>{children}</View>
        </View>
      </KeyboardAwareScrollView> */}
    </View>
  );
};

export default AuthHocView;

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  backBtnContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 100,
  },

  logoContainer: {
    width: 270,
    alignSelf: "center",
    maxWidth: "100%",
    paddingHorizontal: 20,
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    // backgroundColor: "green",
  },
  contentContainer: {
    paddingVertical: 10,
    justifyContent: "center",
    backgroundColor: "red",
  },
});
