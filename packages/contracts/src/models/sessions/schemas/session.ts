import { Base } from '../../../common';

interface Device {
    userAgent?: string;
    ipAddress?: string;
    type?: "desktop" | "mobile" | "tablet" | "other";
}

export interface Session extends Base {
    userId: string;
    refreshTokenHash: string;
    sessionId: string;
    status: "active" | "revoked";
    device: Device;
    expiresAt: Date;
}
