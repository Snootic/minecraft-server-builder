import { memo, type ReactElement } from "react";

interface ButtonGroupProps<T> {
	items: T[];
	selectedItem: T | null;
	onSelect: (item: T | null) => void;
	getKey: (item: T) => string;
	getLabel: (item: T) => string;
	getIcon?: (item: T) => string;
	className?: string;
}

function ButtonGroupInner<T>({
	items,
	selectedItem,
	onSelect,
	getKey,
	getLabel,
	getIcon,
	className = '',
}: ButtonGroupProps<T>) {
	return (
		<div className={`flex gap-1 ${className}`}>
			{items.map((item) => {
				const isSelected = selectedItem && getKey(selectedItem) === getKey(item);

				return (
					<button
						key={getKey(item)}
						onClick={() => onSelect(isSelected ? null : item)}
						className={`nav-button ${isSelected ? 'nav-button-active' : 'text-slate-400 hover:bg-white/5'} flex items-center gap-1`}
					>
						{getIcon && (
							<span
								className="w-5 h-5 flex-shrink-0"
								dangerouslySetInnerHTML={{ __html: getIcon(item) }}
							/>
						)}
						{getLabel(item)}
					</button>
				);
			})}
		</div>
	);
}

export const ButtonGroup = memo(ButtonGroupInner) as <T>(
	props: ButtonGroupProps<T>
) => ReactElement;