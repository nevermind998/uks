export type CommitDto = {
  id?: number;
  author: any;
  message: string;
  hash?: string;
  created_at: Date;
  branch: number;
};
export type BranchDto = {
  id: number;
  name: string;
  repository: number;
};
export type CommitActivityDto = {
  username: string;
  commits: number;
};
