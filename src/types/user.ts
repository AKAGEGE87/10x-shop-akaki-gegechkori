export interface AuthUser {
  username: string;
  isLoggedIn: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export type ProfileFormValues = Required<
  Pick<AuthUser, "firstName" | "lastName" | "email" | "phone">
>;

export interface LoginFormValues {
  username: string;
  password: string;
}
