import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import CustomHeader from "./CustomHeader";
import { HOCViewProps } from "../@types/general";
import BackgroundImage from "../Assets/Png/background.png";
import { COLORS, FONTSIZES, BOX_SHADOW } from "../Utilities/Constants";
import StyledText from "./StyledText";
import { FONTS } from "../Utilities/Fonts";
import CustomButton from "./CustomButton";
import Loader from "./Loader";
import SVGIcon from "./SVGIcon";
import { useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "../@types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const HOCView = ({
  children,
  isEnableKeyboardAware = false,
  isEnableScrollView = false,
  keyboardAwareContentContainerStyle,
  scrollViewContentContainerStyle,
  paddingHorizontal = 15,
  paddingVertical = 10,
  refreshControl,
  isShowHeader = true,
  isDisabledSecondaryHeaderBtn = false,
  isShowSecondaryHeader = true,
  isShowSecondaryHeaderBtn = false,
  onHeaderBtnPress,
  secondaryHeaderTitle,
  secondaryBtnStyle,
  secondaryBtnTitle = "",
  isLoading = false,
  isListLoading = false,
  loaderText,
  headerProps,
  secondaryBtnTextStyle,
  isBtnLoading = false,
}: HOCViewProps) => {
  const navigation: NativeStackNavigationProp<MainStackParamList> =
    useNavigation();
  function MainComponent() {
    return (
      <>
        {isShowHeader && <CustomHeader {...headerProps} />}
        {isLoading && <Loader isVisible={isLoading} text={loaderText} />}
        {isListLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size={"large"} color={COLORS.primary} />
          </View>
        ) : (
          <>
            {isEnableKeyboardAware ? (
              <KeyboardAwareScrollView
                nestedScrollEnabled
                extraScrollHeight={10}
                style={{ paddingHorizontal, paddingVertical, flex: 1 }}
                enableOnAndroid={true}
                bounces={false}
                contentContainerStyle={keyboardAwareContentContainerStyle}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={"handled"}
                scrollEnabled={true}
              >
                <>
                  {isShowSecondaryHeader && renderSecondaryHeader()}
                  {children}
                </>
              </KeyboardAwareScrollView>
            ) : (
              <View style={{ flex: 1, paddingHorizontal, paddingVertical }}>
                {isEnableScrollView ? (
                  <ScrollView
                    refreshControl={refreshControl}
                    style={{ flex: 1 }}
                    contentContainerStyle={scrollViewContentContainerStyle}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    <>
                      {isShowSecondaryHeader && renderSecondaryHeader()}
                      {children}
                    </>
                  </ScrollView>
                ) : (
                  <>
                    {isShowSecondaryHeader && renderSecondaryHeader()}
                    {children}
                  </>
                )}
              </View>
            )}
          </>
        )}
      </>
    );
  }

  const renderSecondaryHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        {secondaryHeaderTitle && (
          <View style={{ flex: 1, marginRight: 15 }}>
            <StyledText
              style={{
                fontFamily: FONTS.poppins.medium,
                fontSize: FONTSIZES.medium,
              }}
            >
              {secondaryHeaderTitle}
            </StyledText>
          </View>
        )}
        {isShowSecondaryHeaderBtn && (
          <CustomButton
            textStyle={secondaryBtnTextStyle}
            isDisabled={isDisabledSecondaryHeaderBtn}
            onPress={onHeaderBtnPress}
            style={[{ width: "45%" }, secondaryBtnStyle]}
          >
            {isBtnLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              secondaryBtnTitle
            )}
          </CustomButton>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.backgroundColor }}>
      {MainComponent()}
    </SafeAreaView>
  );
};

export default HOCView;

const styles = StyleSheet.create({
  cartIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 15,
    bottom: 25,
    borderWidth: 1,
    borderColor: COLORS.primary,
    ...BOX_SHADOW,
  },
});
