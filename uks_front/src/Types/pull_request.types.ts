export enum StatusEnum {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}

export enum ReviewStatusEnum {
    APPROVED = 'APPROVED',
    CHANGES_REQUESTED = 'CHANGES_REQUESTED',
}

export type PullRequestDto = {
    id?: number;
    author: number;
    repository: number;
    title: string;
    description: string | '';
    base_branch: number;
    compare_branch: number;
    milestone: number;
    labels: number[];
    assignees: number[];
    issues: number[];
    status: StatusEnum;
    review: ReviewStatusEnum;
    created_at: Date;
};
