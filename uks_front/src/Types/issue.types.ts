export enum StatusEnum {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export type IssuesDto = {
  id?: number | null;
  title: string;
  created_at: Date | null;
  status: string;
  milestone: number | any;
  labels: number[];
  repository: number;
  author: number;
  assignees: number[];
};
