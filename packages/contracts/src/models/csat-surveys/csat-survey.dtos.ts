import type { CsatSurvey } from './schemas';

export type CreateCsatSurveyDto = Omit<CsatSurvey, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCsatSurveyDto = Partial<CreateCsatSurveyDto>
