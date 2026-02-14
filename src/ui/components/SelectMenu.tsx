import { memo } from "react";

interface SelectOption {
	value: string | number;
	label: string;
}

interface SelectMenuProps {
	options: SelectOption[];
	value?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	label?: string;
	disabled?: boolean;
	className?: string;
}

export const SelectMenu = memo(({ 
	options,
	value,
	onChange,
	placeholder = 'Select an option',
	label,
	disabled = false,
	className = '',
}: SelectMenuProps) => {
	const hasValue = value != null && options.some((opt) => opt.value === value);
	const selectedValue = hasValue ? value : '';

	if (options.length === 1 && !hasValue) {
		const singleValue = String(options[0].value);
		if (singleValue !== selectedValue) {
			onChange(singleValue);
		}
	}

	return (
		<div className={`select-menu ${className}`}>
			{label && <label className="select-label">{label}</label>}
			<select
				value={selectedValue}
				onChange={(e) => onChange(e.target.value)}
				disabled={disabled}
				className="select-input"
			>
				<option value="" disabled>
					{placeholder}
				</option>
				{options.map((option) => (
					<option key={String(option.value)} value={String(option.value)}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}, (prevProps, nextProps) => {
	return prevProps.value === nextProps.value &&
		prevProps.placeholder === nextProps.placeholder &&
		prevProps.label === nextProps.label &&
		prevProps.disabled === nextProps.disabled &&
		prevProps.className === nextProps.className &&
		prevProps.options.length === nextProps.options.length &&
		prevProps.options.every((opt, idx) => opt.value === nextProps.options[idx].value && opt.label === nextProps.options[idx].label);
});