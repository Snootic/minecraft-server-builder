import { memo, useCallback, useMemo } from 'react';
import { Gamepad2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useConstantData } from './hooks/useConstantData';
import type { Category } from '@/types';
import { useCatalogParams } from './hooks/useCatalogParams';
import UI from '@/ui';

interface FilterSidebarProps {
    selectedCategories: string[];
    onCategoriesChange: (categories: string[]) => void;
    selectedTypes: string[];
    onTypesChange: (types: string[]) => void;
}

const FilterSidebar = memo(({ 
    selectedCategories, 
    onCategoriesChange, 
    selectedTypes, 
    onTypesChange 
}: FilterSidebarProps) => {
    const { t } = useTranslation();
    const { selectedVersion, setSelectedVersion, selectedLoader } = useCatalogParams();
    const { versions, categories: allCategories } = useConstantData(selectedLoader);
    
    const types = useMemo(() => ["modpack", "mod"], []);

    const handleVersionToggle = useCallback((v: string) => {
        setSelectedVersion(selectedVersion === v ? null : v);
    }, [selectedVersion, setSelectedVersion]);

    const handleCategoryToggle = useCallback((c: Category) => {
        onCategoriesChange(
            selectedCategories.includes(c.name)
                ? selectedCategories.filter((category) => category !== c.name)
                : [...selectedCategories, c.name],
        );
    }, [onCategoriesChange, selectedCategories]);

    const handleTypeToggle = useCallback((t: string) => {
        onTypesChange(
            selectedTypes.includes(t)
                ? selectedTypes.filter((type) => type !== t)
                : [...selectedTypes, t],
        );
    }, [onTypesChange, selectedTypes]);

    const selectedCategoryItems = useMemo(
        () => allCategories.filter((category) => selectedCategories.includes(category.name)),
        [allCategories, selectedCategories],
    );

    return (
        <section>
            <h3 className="text-[15px] font-bold text-[var(--text-secondary)]/90 uppercase tracking-widest mb-4 mt-3 ml-4 flex items-center gap-5 select-none">
                <Gamepad2 size={20} /> {t('Filters')}
            </h3>
            <div className="glass-panel max-h-[90vh] p-2">
                <div className='p-2 max-h-[30vh]'>
                    <h4 className='text-[15px] font-bold text-[var(--text-primary)]/80 select-none'>
                        {t("Game Version", { count: 2 })}
                    </h4>
                    <UI.Components.FilterList
                        items={versions}
                        selectedItems={selectedVersion ? [selectedVersion] : []}
                        onToggle={handleVersionToggle}
                        getKey={(v) => v}
                        getLabel={(v) => v}
                    />
                </div>
                <div className='p-2 max-h-[30vh]'>
                    <h4 className='text-[15px] font-bold text-[var(--text-primary)]/80 select-none'>
                        {t("Category", { count: 2 })}
                    </h4>
                    <UI.Components.CheckboxList
                        items={allCategories}
                        selectedItems={selectedCategoryItems}
                        onToggle={handleCategoryToggle}
                        getKey={(c: Category) => c.name}
                        getLabel={(c: Category) => c.name}
                        getIcon={(c: Category) => c.icon}
                    />
                </div>
                <div className='p-2 max-h-[7vh]'>
                    <h4 className='text-[15px] font-bold text-[var(--text-primary)]/80 select-none'>
                        {t("Type")}
                    </h4>
                    <UI.Components.CheckboxList
                        items={types}
                        selectedItems={selectedTypes}
                        onToggle={handleTypeToggle}
                        getKey={(t: string) => t}
                        getLabel={(t: string) => t}
                        disabled={selectedLoader?.name === "datapack"}
                    />
                </div>
            </div>
        </section>
    );
}, (prev, next) => {
    return (
        prev.selectedCategories === next.selectedCategories &&
        prev.onCategoriesChange === next.onCategoriesChange &&
        prev.selectedTypes === next.selectedTypes &&
        prev.onTypesChange === next.onTypesChange
    );
});

export default FilterSidebar;
