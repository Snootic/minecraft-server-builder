import { memo, useState, type KeyboardEvent } from 'react';

interface EntryProps {
	entryKey: string;
	value: string | number | boolean;
	onChange: (key: string, newValue: string | number | boolean) => void;
}

export const Entry = memo(({ entryKey, value, onChange }: EntryProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [localValue, setLocalValue] = useState(String(value));

	const handleBlur = () => {
		setIsEditing(false);
		let parsedValue: string | number | boolean = localValue;

		if (typeof value === 'number') {
			parsedValue = Number(localValue);
		} else if (typeof value === 'boolean') {
			parsedValue = localValue.toLowerCase() === 'true';
		}
		onChange(entryKey, parsedValue);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleBlur();
		} else if (e.key === 'Escape') {
			setLocalValue(String(value));
			setIsEditing(false);
		}
	};

	return (
		<div className="flex items-center gap-2 py-1 px-2 hover:bg-white/5 rounded transition-colors group">
			<span className="font-semibold text-[var(--text-secondary)] ">
				{entryKey}:
			</span>
			{isEditing ? (
				typeof value === 'boolean' ? (
					<select
						value={localValue}
						onChange={(e) => setLocalValue(e.target.value)}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						autoFocus
						className="flex-1 bg-[var(--bg-surface-light)] border border-[var(--glass-border)] rounded px-2 py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
					>
						<option value="true">true</option>
						<option value="false">false</option>
					</select>
				) : (
					<input
						value={localValue}
						onChange={(e) => setLocalValue(e.target.value)}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						autoFocus
						className="flex-1 bg-[var(--bg-surface-light)] border border-[var(--glass-border)] rounded px-2 py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
					/>
				)
			) : (
				<button
					onClick={() => setIsEditing(true)}
					className="flex-1 bg-[var(--bg-surface-light)]/50 text-left text-[var(--text-primary)] opacity-80 group-hover:opacity-100 transition-opacity border border-[var(--glass-border)] rounded px-2 py-1 text-sm"
				>
					{String(value) || '\u00A0'}
				</button>/* just to ensure max possible height and make it not look weird */
			)}
		</div>
	);
}, (prevProps, nextProps) => {
	return (prevProps.value === nextProps.value 
		&& prevProps.entryKey === nextProps.entryKey 
		&& prevProps.onChange === nextProps.onChange
	);
});