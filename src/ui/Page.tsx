import { memo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

const GitHubIcon = () => (
    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
        />
    </svg>
);

export const Page = memo(({ children, locked = false }: { children: ReactNode; locked?: boolean }) => {
    const {t} = useTranslation();
    const [linksMenuOpen, setLinksMenuOpen] = useState(false);
    const menuItemClosedClass = "max-w-0 opacity-0 scale-95 pointer-events-none px-0 py-0";
    const links = [
        {
            href: "https://modrinth.com",
            label: t("Powered by Modrinth"),
            ariaLabel: "Powered by Modrinth",
            className: "bg-green-500 text-white px-4 py-3",
            icon: <img src="modrinth_mark-dark__32x32.png" className="w-5 h-5 shrink-0 brightness-0 invert" />,
        },
        {
            href: "https://github.com/snootic/minecraft-server-builder",
            label: "GitHub",
            ariaLabel: "Project's GitHub",
            className: "bg-primary text-white px-4 py-3",
            icon: <GitHubIcon />,
        },
    ];

    return (
        <div className={`min-h-screen text-slate-200 selection:bg-primary/30 ${locked ? 'overflow-hidden' : ''}`}>
            <div className="fixed inset-0 bg-bg-surface overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-radial from-primary/8 via-transparent to-transparent" />
                <div className="absolute -top-10% -left-10% h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute top-[20%] -right-5% h-[30%] w-[30%] rounded-full bg-accent/5 blur-[100px]" />
            </div>
            {children}
            <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
                <div className="flex flex-col items-end gap-3">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${link.className} rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 overflow-hidden ${
                                linksMenuOpen ? "max-w-xs opacity-100 scale-100" : menuItemClosedClass
                            }`}
                            aria-label={link.ariaLabel}
                            onClick={() => setLinksMenuOpen(false)}
                        >
                            {link.icon}
                            <span className="whitespace-nowrap overflow-hidden font-medium">
                                {link.label}
                            </span>
                        </a>
                    ))}
                    <button
                        type="button"
                        onClick={() => setLinksMenuOpen((open) => !open)}
                        className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-200 hover:scale-150 hover:shadow-primary/40 focus-visible:scale-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                        aria-label={linksMenuOpen ? t("Hide links") : t("Show links")}
                        aria-expanded={linksMenuOpen}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </button>
                </div>
            </div>
        </div>
    );
});
