export type UserAddEditDataProps = {
  isupdate: boolean;
  name: string;
  username: string;
  mobile_no: string;
  email_id: string;
  password: string;
  role_id: {role_id: number; role_name: string} | null;
  state: string;
  address: string;
  city: string;
  country: string;
};

export type AccessAddEditDataProps = {
  name: string;
  description: string;
};
