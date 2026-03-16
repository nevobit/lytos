import { type Base } from '../../../common';

export const KbFeedbackValue = {
    HELPFUL: 'helpful',
    NOT_HELPFUL: 'not_helpful',
} as const;

export type KbFeedbackValue = (typeof KbFeedbackValue)[keyof typeof KbFeedbackValue];

export interface KbFeedback extends Base {
    workspaceId: string;
    articleId: string;
    value: KbFeedbackValue;
    comment?: string;
    customerId?: string;
    visitorId?: string;
}
