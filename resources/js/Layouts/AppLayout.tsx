import AppLayoutTemplate from '@/Layouts/App/AppSidebarLayout';
import type { AppLayoutProps } from '@/Types';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
);
