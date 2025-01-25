import { LinkingOptions } from "@react-navigation/native";
import { IS_IOS } from "./Constants";

const deepLinkScreens = {
  mainStack: {
    screens: {
      DrawerNavigation: {
        screens: {
          ServiceRequestStack: {
            screens: {
              ServiceRequest: "ServiceRequest/:requestId",
            },
          },
          PreventiveSRStack: {
            screens: {
              PreventiveSR: "PreventiveSR/:requestId",
            },
          },
        },
      },
      DemoScreen: "DemoScreen",
    },
  },
};

export const deepLink:
  | LinkingOptions<ReactNavigation.RootParamList>
  | undefined = {
  prefixes: IS_IOS ? ["mservice://"] : ["mconnect_maintenance://"],
  config: {
    //@ts-ignore
    initialRouteName: "mainStack",
    screens: deepLinkScreens,
  },
};
