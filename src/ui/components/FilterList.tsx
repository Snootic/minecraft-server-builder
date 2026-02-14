import { memo, type ReactElement } from 'react';

interface FilterListProps<T> {
	items: T[];
	selectedItems: T[];
	onToggle: (item: T) => void;
	getKey: (item: T) => string;
	getLabel: (item: T) => string;
	className?: string;
	columns?: number;
}

function FilterListInner<T>({
	items,
	selectedItems,
	onToggle,
	getKey,
	getLabel,
	className = '',
	columns = 2,
}: FilterListProps<T>) {
	return (
		<div className={`grid grid-cols-${columns} max-h-[20vh] overflow-y-auto custom-scrollbar ${className}`}>
			{items.map((item) => (
				<button
					key={getKey(item)}
					onClick={() => onToggle(item)}
					className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 mb-1 flex justify-between items-center group ${selectedItems.includes(item) ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-slate-400'
						}`}
				>
					<span className="text-sm font-semibold">{getLabel(item)}</span>
					<div className={`w-1.5 h-1.5 rounded-full transition-all ${selectedItems.includes(item) ? 'bg-primary scale-125' : 'bg-white/10'}`} />
				</button>
			))}
		</div>
	);
}

export const FilterList = memo(FilterListInner) as <T>(
	props: FilterListProps<T>
) => ReactElement;