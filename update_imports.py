import os
import re

# Mapping of old paths to new paths
replacements = {
    # Parent Folders
    r"@/components/": r"@/Components/",
    r"@/layouts/": r"@/Layouts/",
    r"@/pages/": r"@/Pages/",
    r"@/hooks/": r"@/Hooks/",
    r"@/types/": r"@/Types/",
    r"@/lib/": r"@/Lib/",
    r"@/routes/": r"@/Routes/",
    r"@/actions/": r"@/Actions/",
    
    # Specific Layouts
    r"@/Layouts/app-layout": r"@/Layouts/AppLayout",
    r"@/Layouts/auth-layout": r"@/Layouts/AuthLayout",
    r"@/Layouts/app/app-header-layout": r"@/Layouts/App/AppHeaderLayout",
    r"@/Layouts/app/app-sidebar-layout": r"@/Layouts/App/AppSidebarLayout",
    r"@/Layouts/settings/layout": r"@/Layouts/Settings/Layout",
    r"@/Layouts/auth/auth-simple-layout": r"@/Layouts/Auth/AuthSimpleLayout",
    r"@/Layouts/auth/auth-split-layout": r"@/Layouts/Auth/AuthSplitLayout",
    r"@/Layouts/auth/auth-card-layout": r"@/Layouts/Auth/AuthCardLayout",

    # Specific Components
    r"@/Components/app-shell": r"@/Components/AppShell",
    r"@/Components/nav-user": r"@/Components/NavUser",
    r"@/Components/alert-error": r"@/Components/AlertError",
    r"@/Components/user-menu-content": r"@/Components/UserMenuContent",
    r"@/Components/app-logo": r"@/Components/AppLogo",
    r"@/Components/app-sidebar": r"@/Components/AppSidebar",
    r"@/Components/app-logo-icon": r"@/Components/AppLogoIcon",
    r"@/Components/heading": r"@/Components/Heading",
    r"@/Components/two-factor-setup-modal": r"@/Components/TwoFactorSetupModal",
    r"@/Components/app-sidebar-header": r"@/Components/AppSidebarHeader",
    r"@/Components/app-header": r"@/Components/AppHeader",
    r"@/Components/nav-footer": r"@/Components/NavFooter",
    r"@/Components/delete-user": r"@/Components/DeleteUser",
    r"@/Components/nav-main": r"@/Components/NavMain",
    r"@/Components/breadcrumbs": r"@/Components/Breadcrumbs",
    r"@/Components/appearance-tabs": r"@/Components/AppearanceTabs",
    r"@/Components/two-factor-recovery-codes": r"@/Components/TwoFactorRecoveryCodes",
    r"@/Components/text-link": r"@/Components/TextLink",
    r"@/Components/app-content": r"@/Components/AppContent",
    r"@/Components/user-info": r"@/Components/UserInfo",
    r"@/Components/input-error": r"@/Components/InputError",

    # UI Components
    r"@/Components/ui/": r"@/Components/UI/",
    r"@/Components/UI/checkbox": r"@/Components/UI/Checkbox",
    r"@/Components/UI/input": r"@/Components/UI/Input",
    r"@/Components/UI/button": r"@/Components/UI/Button",
    r"@/Components/UI/toggle": r"@/Components/UI/Toggle",
    r"@/Components/UI/alert": r"@/Components/UI/Alert",
    r"@/Components/UI/tooltip": r"@/Components/UI/Tooltip",
    r"@/Components/UI/card": r"@/Components/UI/Card",
    r"@/Components/UI/breadcrumb": r"@/Components/UI/Breadcrumb",
    r"@/Components/UI/dropdown-menu": r"@/Components/UI/DropdownMenu",
    r"@/Components/UI/select": r"@/Components/UI/Select",
    r"@/Components/UI/collapsible": r"@/Components/UI/Collapsible",
    r"@/Components/UI/label": r"@/Components/UI/Label",
    r"@/Components/UI/sidebar": r"@/Components/UI/Sidebar",
    r"@/Components/UI/toggle-group": r"@/Components/UI/ToggleGroup",
    r"@/Components/UI/skeleton": r"@/Components/UI/Skeleton",
    r"@/Components/UI/input-otp": r"@/Components/UI/InputOTP",
    r"@/Components/UI/scroll-area": r"@/Components/UI/ScrollArea",
    r"@/Components/UI/placeholder-pattern": r"@/Components/UI/PlaceholderPattern",
    r"@/Components/UI/sheet": r"@/Components/UI/Sheet",
    r"@/Components/UI/spinner": r"@/Components/UI/Spinner",
    r"@/Components/UI/tabs": r"@/Components/UI/Tabs",
    r"@/Components/UI/dialog": r"@/Components/UI/Dialog",
    r"@/Components/UI/icon": r"@/Components/UI/Icon",
    r"@/Components/UI/badge": r"@/Components/UI/Badge",
    r"@/Components/UI/navigation-menu": r"@/Components/UI/NavigationMenu",
    r"@/Components/UI/avatar": r"@/Components/UI/Avatar",
    r"@/Components/UI/separator": r"@/Components/UI/Separator",

    # Pages
    r"@/Pages/Settings/appearance": r"@/Pages/Settings/Appearance",
    r"@/Pages/Settings/password": r"@/Pages/Settings/Password",
    r"@/Pages/Settings/two-factor": r"@/Pages/Settings/TwoFactor",
    r"@/Pages/Settings/profile": r"@/Pages/Settings/Profile",
    r"@/Pages/Auth/verify-email": r"@/Pages/Auth/VerifyEmail",
    r"@/Pages/Auth/confirm-password": r"@/Pages/Auth/ConfirmPassword",
    r"@/Pages/Auth/reset-password": r"@/Pages/Auth/ResetPassword",
    r"@/Pages/Auth/login": r"@/Pages/Auth/Login",
    r"@/Pages/Auth/two-factor-challenge": r"@/Pages/Auth/TwoFactorChallenge",
    r"@/Pages/Auth/register": r"@/Pages/Auth/Register",
    r"@/Pages/Auth/forgot-password": r"@/Pages/Auth/ForgotPassword",
    
    # Glob paths
    r"./pages/": r"./Pages/",
    
    # Hooks
    r"@/Hooks/use-appearance": r"@/Hooks/UseAppearance",
    r"@/Hooks/use-mobile": r"@/Hooks/UseMobile",
    r"@/Hooks/use-initials": r"@/Hooks/UseInitials",
    r"@/Hooks/use-clipboard": r"@/Hooks/UseClipboard",
    r"@/Hooks/use-current-url": r"@/Hooks/UseCurrentUrl",
    r"@/Hooks/use-two-factor-auth": r"@/Hooks/UseTwoFactorAuth",
    r"@/Hooks/use-mobile-navigation": r"@/Hooks/UseMobileNavigation",
    
    # Types
    r"@/Types/navigation": r"@/Types/Navigation",
    r"@/Types/auth": r"@/Types/Auth",
    r"@/Types/ui": r"@/Types/UI",
    r"@/Types/index": r"@/Types/Index",
    
    # Lib
    r"@/Lib/utils": r"@/Lib/Utils",
}

def update_imports(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()
                
                new_content = content
                # Sort replacements by length descending to avoid partial matches
                for old in sorted(replacements.keys(), key=len, reverse=True):
                    new_content = new_content.replace(old, replacements[old])
                
                if new_content != content:
                    with open(path, 'w') as f:
                        f.write(new_content)
                    print(f"Updated: {path}")

# Run for resources/js
update_imports('/home/badr/Desktop/checkappvid/resources/js')
