export type * from './Auth';
export type * from './Navigation';
export type * from './UI';

import type { Auth } from './Auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};
