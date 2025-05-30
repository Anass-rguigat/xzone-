import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    country?: string;
    avatar: string;
    email_verified_at?: string;
    roles: string[];
    permissions: string[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    flash?: {
        success?: string;
        error?: string;
    };
};
