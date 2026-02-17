import type { Workspace } from './schemas';

export type CreateWorkspaceDto = Omit<Workspace, 'id' | 'createdAt' | 'updatedAt' | 'slug' | 'timezone' | 'ownerId'>;
export type UpdateWorkspaceDto = Partial<Workspace>
