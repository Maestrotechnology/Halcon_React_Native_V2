export type CustomToastProps = {
  text?: string;
  toastType: 'success' | 'error' | 'normal';
};

export type TomatoToastprops = {
  text1?: string;
  props?: any;
};

interface getCatchMsgDetailMsgType {
  msg: string;
}

interface getCatchMsgDetailType {
  detail: getCatchMsgDetailMsgType;
}
interface getCatchMsgDataType {
  data: getCatchMsgDetailType;
  status: number | string;
}

export type getCatchMsgType = {
  response: getCatchMsgDataType;
  request: string;
};
