export type MaintenanceWorkOrderFilterItemsDataProps = {
  work_title: string;
  work_order: string;
};

export type MaintenanceWorkOrderFilterDataProps = {
  filterData: MaintenanceWorkOrderFilterItemsDataProps;
  onApplyFilter: (val: MaintenanceWorkOrderFilterItemsDataProps) => void;
  onClose: () => void;
  // initialValue?: ServiceRequestFilterInitialProp;
};

export type AddWorkOrderFormikDataProps = {
  work_title: string;
  work_no: string;
  description: string;
  color: string;
};
