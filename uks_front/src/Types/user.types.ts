import List from "@mui/material/List";

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
  title: string;
  due_date: Date | null ;
  description: string;
  status: string;
  repository: number;
};

export type LabelDto = {
  name: string;
  description: string;
  color: string;
  repository: number;
};

export type IssuesDto = {
  title: string,
  created_at: Date | null,
  status: string,
  milestone: number,
  labels: number,
  repository: number,
  author: number,
  assignees: number[]
}

export type AssigneesDto = {
  id: number;
  username: string;
  email: string;
  family_name: string;
  given_name: string;
  bio: string;
  url: string;
  password: string;
};

export type MilestoneIdDto = {
  title: string;
  id: number;
  due_date: Date | null ;
  description: string;
  status: string;
  repository: number;
};

export type IssuesIdDto = {
  id: number;
  title: string,
  created_at: Date | null,
  status: string,
  milestone: number,
  labels: number,
  repository: number,
  author: number,
  assignees: number[]
}

export type LabelIdDto = {
  id: number;
  name: string;
  description: string;
  color: string;
  repository: number;
};
