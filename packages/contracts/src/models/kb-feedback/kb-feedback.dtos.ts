import type { KbFeedback } from './schemas';

export type CreateKbFeedbackDto = Omit<KbFeedback, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateKbFeedbackDto = Partial<CreateKbFeedbackDto>
