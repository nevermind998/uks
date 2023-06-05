export type SignInDto = {
  email: string;
  password: string;
};

export type SignUpDto = {
  username: string;
  email: string;
  password: string;
  family_name: string;
  given_name: string;
  bio?: string;
  url?: string;
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

export type MilestoneDto = {
  title:string;
  due_date: Date | null ;
  description:string;
  status:string;
  repository: number;
};