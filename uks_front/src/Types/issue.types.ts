export enum StatusEnum {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}

export type IssuesDto = {
    title: string,
    created_at: Date | null,
    status: string,
    milestone: number,
    labels: number[],
    repository: number,
    author: number,
    assignees: number[]
  }
