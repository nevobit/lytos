import { type Base } from '../../../common';

interface Security {
    twoFactorEnabled: boolean
    twoFactorMethod?: "totp"
    totpSecretEnc?: string
    recoveryCodesHash?: string[]
}

interface AuthProviders {
    google: {
        sub: string;
        email: string;
    },
}
export interface User extends Base {
    name: string;
    email: string;
    password?: string;
    avatar?: string;

    security?: Security;

    isEmailVerified?: boolean;
    locked?: boolean;
    userAgent: string;

    authProviders?: AuthProviders;

    loginAttempts?: number;
    lastLogin?: Date;

}