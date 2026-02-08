import AppLogoIcon from './AppLogoIcon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-lg tracking-tight">
                    Checkvid
                </span>
            </div>
        </>
    );
}
