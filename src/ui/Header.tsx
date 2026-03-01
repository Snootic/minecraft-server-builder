import { Settings } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { memo } from "react";

export const Header = memo(() => (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-1 md:py flex items-center justify-between">
            <div className="flex items-center gap-1">
                <div className="bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/20 overflow-hidden scale-50 px-2">
                    <img src={"mine-server-small.png"} />
                </div>
                <h1 className="md:text-xl font-black md:tracking-tighter uppercase select-none">minecraft server builder</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-6">
                <LanguageSwitcher />
                <ThemeSwitcher />
                <div className="h-6 w-px bg-white/10" />
                <button className="text-slate-400 hover:text-white transition-colors">
                    {/* still thinking on what would the user ever want to configure
                        on a settings menu
                        Altough it will be used when I integrate the server management features
                        It will remain here for a long time without any purpose
                    */}
                    <Settings size={20} />
                </button>
            </div>
        </div>
    </header>
));