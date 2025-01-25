import { useSelector } from "react-redux";
import { ReducerProps, UserPermissionKeyProps } from "./Reducertype";

export const UseToken = () => {
  return useSelector((state: ReducerProps) => state.login.token);
};

export const LoaderStatus = () => {
  return useSelector((state: ReducerProps) => state.loader.loader);
};

export const GetUserData = () => {
  return useSelector((state: ReducerProps) => state.login.userDetails);
};
export const GetRememberData = () => {
  return useSelector((state: ReducerProps) => state.login.rememberData);
};
export const GetUserProfileData = () => {
  return useSelector((state: ReducerProps) => state.login.userProfileData);
};

export const GetConfirmationModal = () => {
  return useSelector((state: ReducerProps) => state.login.confirmationModal);
};

export const GetUserLocation = () => {
  return useSelector((state: ReducerProps) => state.login.location);
};

export const GetActiveRoute = () => {
  return useSelector((state: ReducerProps) => state?.route.activeRoute);
};

export const GetInsets = () => {
  return useSelector((state: ReducerProps) => state?.utility.insets);
};

export const GetBaseUrl = () => {
  return useSelector((state: ReducerProps) => state.login.baseurl);
};

export const GetPermissions = () => {
  const UserPermissions = useSelector(
    (state: ReducerProps) => state.permission.permissions
  );

  return UserPermissions;
};

export const GetUserPermissions = (key: UserPermissionKeyProps) => {
  const UserPermissions = useSelector(
    (state: ReducerProps) => state.permission.permissions
  );
  return UserPermissions[key];
};

export const useSelectedDrawerOption = () => {
  return useSelector((state: ReducerProps) => state.login.selectedDrawerOption);
};

export const GetDeepLinkData = () => {
  return useSelector((state: ReducerProps) => state?.utility?.deepLinkData);
};
