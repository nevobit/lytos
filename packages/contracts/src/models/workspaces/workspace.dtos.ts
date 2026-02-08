import type { Workspace } from './schemas';

export type CreateWorkspaceDto = Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateWorkspaceDto = Partial<CreateWorkspaceDto>
