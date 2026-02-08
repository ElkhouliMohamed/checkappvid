import { AppContent } from '@/Components/AppContent';
import { AppHeader } from '@/Components/AppHeader';
import { AppShell } from '@/Components/AppShell';
import type { AppLayoutProps } from '@/Types';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
