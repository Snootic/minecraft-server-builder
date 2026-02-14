interface CheckboxListProps<T> {
	items: T[];
	selectedItems: T[];
	onToggle: (item: T) => void;
	getKey: (item: T) => string;
	getLabel: (item: T) => string;
	getIcon?: (item: T) => string;
	className?: string;
	columns?: number;
	disabled?: boolean
}

export const CheckboxList = <T,>({
	items,
	selectedItems,
	onToggle,
	getKey,
	getLabel,
	getIcon,
	className = '',
	columns = 2,
	disabled = false
}: CheckboxListProps<T>) => {
	return (
		<div className={`grid grid-cols-${columns} gap-2 max-h-[20vh] overflow-y-auto custom-scrollbar ${className}`}>
			{items.map((item) => (
				<label
					key={getKey(item)}
					className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 mb-1 ${selectedItems.includes(item) ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-slate-400'
						}`}
				>
					<input
						type="checkbox"
						checked={selectedItems.includes(item) && !disabled}
						onChange={() => onToggle(item)}
						className="accent-primary"
						disabled={disabled}
					/>
					{getIcon && (() => {
						const icon = getIcon(item);
						if (typeof icon === "string" && icon.startsWith("data:") || icon.startsWith("http")) {
							return <img src={icon} alt="" className="w-5 h-5 flex-shrink-0" />;
						}
						return (
							<span
								className="w-5 h-5 flex-shrink-0"
								dangerouslySetInnerHTML={{ __html: icon }}
							/>
						);
					})()}
					<span className="text-sm font-semibold">{getLabel(item)}</span>
				</label>
			))}
		</div>
	)
};