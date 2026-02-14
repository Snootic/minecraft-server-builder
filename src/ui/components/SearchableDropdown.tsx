import { useState, useRef, useEffect } from "react";
import { Plus, ChevronDown } from "lucide-react";

export interface SearchableDropdownOption {
    value: string;
    label: string;
    description?: string;
}

interface SearchableDropdownProps {
    options: SearchableDropdownOption[];
    onSelect: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    noMatchMessage?: string;
    icon?: React.ReactNode;
}

export const SearchableDropdown = ({
    options,
    onSelect,
    placeholder = "Select an option",
    searchPlaceholder = "Search...",
    emptyMessage = "No options available",
    noMatchMessage = "No matches",
    icon,
}: SearchableDropdownProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        (opt.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch("");
            }
        };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                className="flex items-center justify-between w-full gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-[var(--text-primary)] cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center gap-2">
                    {icon ?? <Plus size={16} className="text-[var(--accent)]" />}
                    <span>{placeholder}</span>
                </div>
                <ChevronDown
                    size={16}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute z-20 w-full mt-1 bg-[var(--bg-surface-light)] border border-white/15 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-white/10">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="overflow-y-auto custom-scrollbar">
                        {filtered.length === 0 ? (
                            <div className="p-3 text-sm text-white/40 text-center">
                                {options.length === 0 ? emptyMessage : noMatchMessage}
                            </div>
                        ) : (
                            filtered.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className="w-full flex flex-col gap-0.5 px-3 py-2 hover:bg-white/10 transition-colors text-left cursor-pointer"
                                    onClick={() => {
                                        onSelect(opt.value);
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                >
                                    <span className="text-sm font-mono text-[var(--text-primary)]">{opt.label}</span>
                                    {opt.description && (
                                        <span className="text-xs text-white/40">{opt.description}</span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};