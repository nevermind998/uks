export enum StatusEnum {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}

export type MilestoneDto = {
    id: number | null;
    title: string;
    due_date: Date | null ;
    description: string;
    status: string;
    repository: number;
  };