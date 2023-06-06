
export type CommitDto = {
    author: number;
    message: string;
    hash: string;
    created_at: Date;
    branch: number;
};
export type BranchDto = {
    id: number;
    name: string;
};