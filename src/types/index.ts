export interface ILayoutProps {
  children: React.ReactNode;
}

export interface ILogin {
  password: string;
  email: string;
}

export interface IRegister extends ILogin {
  userName: string;
  confirmPassword: string;
}

export interface IUserName {
  userName: string;
}

export type Languages = Record<
  string,
  {
    name: string;
    nativeName: string;
    dir: 'ltr' | 'rtl';
  }
>;
