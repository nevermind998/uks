export enum VisibilityEnum {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}

export type RepositoryDto = {
    id: number;
    name: string;
    owner: number;
    description: string;
    created_at: Date;
    visibility: VisibilityEnum;
    default_branch: string;
    collaborators: number[];
};
