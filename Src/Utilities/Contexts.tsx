import {createContext, useContext} from 'react';
import {
  PreventiveRequestUpdateContextProps,
  ServiceRequestCreationContextProps,
} from '../@types/context';

export const ServiceRequestCreationContext =
  createContext<ServiceRequestCreationContextProps>(
    {} as ServiceRequestCreationContextProps,
  );
export const useServiceRequestDetails = () =>
  useContext(ServiceRequestCreationContext);

export const PreventiveRequestUpdateContext =
  createContext<PreventiveRequestUpdateContextProps>(
    {} as PreventiveRequestUpdateContextProps,
  );

export const usePreventiveRequestContext = () =>
  useContext(PreventiveRequestUpdateContext);
