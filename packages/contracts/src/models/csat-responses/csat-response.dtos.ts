import type { CsatResponse } from './schemas';

export type CreateCsatResponseDto = Omit<CsatResponse, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCsatResponseDto = Partial<CreateCsatResponseDto> 
