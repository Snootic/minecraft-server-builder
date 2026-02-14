import { memo } from "react";

interface RangeSliderProps {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    label?: string;
    formatValue?: (value: number) => string;
    formatBound?: (value: number) => string;
    disabled?: boolean;
}

export const RangeSlider = memo<RangeSliderProps>(({
    value,
    onChange,
    min,
    max,
    step = 1,
    label,
    formatValue,
    formatBound,
    disabled = false,
}: RangeSliderProps) => {
    const displayValue = formatValue ? formatValue(value) : String(value);
    const minLabel = formatBound ? formatBound(min) : String(min);
    const maxLabel = formatBound ? formatBound(max) : String(max);

    return (
        <div className={`flex flex-col gap-1 p-3 rounded-lg bg-white/5 ${disabled ? "opacity-50" : ""}`}>
            <div className="flex justify-between">
                {label && <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>}
                <span className="text-sm font-mono font-bold text-[var(--accent)]">{displayValue}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(Number(e.target.value))}
                className={`w-full accent-[var(--accent)] ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
            />
            <div className="flex justify-between text-xs text-white/40">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.value === nextProps.value &&
           prevProps.min === nextProps.min &&
           prevProps.max === nextProps.max &&
           prevProps.step === nextProps.step &&
           prevProps.label === nextProps.label &&
           prevProps.disabled === nextProps.disabled;
});