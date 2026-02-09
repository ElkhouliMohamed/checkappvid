import { Link } from '@inertiajs/react';
import { BookOpen, FileText, Folder, LayoutGrid } from 'lucide-react';
import { NavFooter } from '@/Components/NavFooter';
import { NavMain } from '@/Components/NavMain';
import { NavUser } from '@/Components/NavUser';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/Components/UI/Sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/Types';
import AppLogo from './AppLogo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="floating" className="border-r-0 bg-transparent shadow-none">
            <SidebarHeader className="border-b border-white/10 pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-accent hover:text-accent-foreground transition-colors">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-background">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="bg-background border-t border-border/50 pt-2">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
