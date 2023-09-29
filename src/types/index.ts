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
    nativeName?: string;
    dir?: 'ltr' | 'rtl';
  }
>;

export type TranslationApiResponse = Array<{
  translations: Array<{
    text: string;
    to: string;
    alignment: { proj: string };
  }>;
}>;

export type TranslationResponse = Record<
  string,
  {
    subject?: string;
    content?: string;
  }
>;

export type MailBatch = {
  mailId: string;
  language: string;
  subject: string;
  createdAt: Date;
  batchId: string;
  content: string | undefined;
};
