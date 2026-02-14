import { memo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

export const Page = memo(({ children, locked = false }: { children: ReactNode; locked?: boolean }) => {
    const {t} = useTranslation();
    
    return (
        <div className={`min-h-screen bg-bg-surface text-slate-200 selection:bg-primary/30 ${locked ? 'overflow-hidden' : ''}`}>
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-accent/5 blur-[100px] rounded-full" />
            </div>
            {children}

            <a
                href="https://modrinth.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group fixed bottom-6 right-25 bg-green-500 hover:bg-green-600 text-white px-4 py-4 rounded-full shadow-lg transition-all hover:scale-105 pointer-events-auto z-50 flex items-center hover:gap-2 overflow-hidden"
                aria-label="Powered by Modrinth"
            >
                <img src="modrinth_mark-dark__32x32.png" className="w-6 h-6 flex-shrink-0 brightness-0 invert" />
                <span className="max-w-0 group-hover:max-w-xs transition-all duration-300 whitespace-nowrap overflow-hidden font-medium">
                    {t("Powered by Modrinth")}
                </span>
            </a>
            <a
                href="https://github.com/snootic/minecraft-server-builder"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-primary hover:bg-primary/80 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 pointer-events-auto z-50"
                aria-label="My GitHub"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                    />
                </svg>
            </a>
        </div> //importing the github svg icon here did not work for some reason, so I asked gpt to generate one
    );
});