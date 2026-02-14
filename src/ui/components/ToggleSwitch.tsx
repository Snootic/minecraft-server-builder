import { memo } from "react";

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
}

export const ToggleSwitch = memo(({ checked, onChange, label, description, disabled = false }: ToggleSwitchProps) => {
    return (
        <label
            className={`flex items-center justify-between gap-3 p-3 rounded-lg ${(label || description) ? "bg-white/5 hover:bg-white/10 transition-colors" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
            {(label || description) && (
                <div className="flex flex-col">
                    {label && <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>}
                    {description && <span className="text-xs text-white/40">{description}</span>}
                </div>
            )}
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${checked ? "bg-[var(--accent)]" : "bg-white/20"}`}
                onClick={(e) => {
                    e.preventDefault();
                    if (!disabled) onChange(!checked);
                }}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
                />
            </button>
        </label>
    );
}, (prevProps, nextProps) => {
    return prevProps.checked === nextProps.checked &&
        prevProps.label === nextProps.label &&
        prevProps.description === nextProps.description &&
        prevProps.disabled === nextProps.disabled;
});