import { ChevronDown } from "lucide-react";
import { memo, useState, type ReactElement } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);
  
	return (
    <div className={`relative flex gap-1 ${className}`}>
      <div
        className={`flex flex-row items-center border border-white/10 rounded-xl ${selectedItem ? 'nav-button-active' : 'text-slate-400 hover:bg-white/5'} md:hidden`}
        onClick={() => setMenuOpen(prev => !prev)}
      >
        {(selectedItem || items[0]) && (
          <button
            className={`nav-button flex items-center gap-1`}
          >
            {getIcon && (
              <span
                className="w-5 h-5 shrink-0"
                dangerouslySetInnerHTML={{ __html: getIcon(selectedItem || items[0]) }}
              />
            )}
            {getLabel(selectedItem || items[0])}
          </button>
        )}
        <ChevronDown className="w-6 h-6"/>
      </div>
      <div className={`flex flex-col absolute bg-bg-surface border border-white/10 rounded-xl p-1 gap-2 z-50 top-full transition-all duration-200 ease-out ${menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'} md:flex-row md:static md:opacity-100 md:pointer-events-auto md:bg-transparent md:z-auto md:border-none md:h-auto md:w-auto md:translate-y-0`}>
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
  								className="w-5 h-5 shrink-0"
  								dangerouslySetInnerHTML={{ __html: getIcon(item) }}
  							/>
  						)}
  						{getLabel(item)}
  					</button>
  				);
  			})}
			</div>
		</div>
	);
}

export const ButtonGroup = memo(ButtonGroupInner) as <T>(
	props: ButtonGroupProps<T>
) => ReactElement;