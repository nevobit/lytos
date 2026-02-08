import type { Macro } from './schemas';

export type CreateMacroDto = Omit<Macro, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMacroDto = Partial<CreateMacroDto>
