export type SignInDto = {
  email: string;
  password: string;
};

export type UserProfileDto = {
  id: number;
  username: string;
  email: string;
  family_name: string;
  given_name: string;
  bio: string;
  url: string;
};