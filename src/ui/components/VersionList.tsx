import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ProjectVersion, Loader } from '../../types';
import { useAppStore } from '../../stores/useStore';
import { useShallow } from 'zustand/react/shallow';

interface VersionListProps {
    versions: ProjectVersion[];
    selectedLoader: Loader | null;
    selectedSomething?: ProjectVersion;
    onVersionClick: (version: ProjectVersion) => void;
    maxVersions?: number;
}

export const VersionList = ({
    versions,
    selectedLoader,
    selectedSomething,
    onVersionClick,
    maxVersions = 10
}: VersionListProps) => {
    const { t } = useTranslation();

    const {
        selectedInstance,
        selectedDatapacks,
        selectedMods
    } = useAppStore(
        useShallow((state) => ({
            selectedInstance: state.selectedInstance,
            selectedDatapacks: state.selectedDatapacks,
            selectedMods: state.selectedMods,
        }))
    );

    const filteredVersions = versions
        .slice(0, maxVersions)
        .filter((v) => {
            if (!selectedLoader) return true;
            const similarLoaders: Record<string, string[]> = {
                forge: ['forge', 'neoforge'],
                fabric: ['fabric', 'quilt'],
                neoforge: ['neoforge'],
                quilt: ['quilt', 'fabric'],
            };
            const includeLoaders = similarLoaders[selectedLoader.name] || [selectedLoader.name];
            return v.loaders?.some(l => includeLoaders.includes(l));
        });

    return (
        <div className="grid grid-cols-1 gap-3 max-h-[30vh] overflow-y-auto custom-scrollbar">
            {filteredVersions.map((version: ProjectVersion) => {
                const isSelected = selectedSomething?.id === version.id ||
                    selectedInstance?.id === version.id ||
                    selectedDatapacks.includes(version) ||
                    selectedMods.includes(version);

                return (
                    <div
                        key={version.id}
                        className={`grid ${isSelected ? "bg-[var(--primary-dark)]/30" : "bg-white/5"} border border-white/10 p-2 rounded-xl grid-rows-2 justify-between items-center gap-2 cursor-pointer hover:${isSelected ? "bg-[var(--primary-light)]/30" : "bg-white/10"} transition-colors`}
                        onClick={() => onVersionClick(version)}
                        tabIndex={0}
                        role="button"
                        aria-pressed={isSelected}
                    >
                        <span className="text-sm font-medium text-slate-300">
                            {t("Version")}: {version.name}
                        </span>
                        <span className="text-sm font-medium text-slate-300">
                            {t("Loader", { count: version.loaders.length > 1 ? 2 : 1 })}: {(() => {
                                const loaderNames = version.loaders.map(l => l.charAt(0).toUpperCase() + l.slice(1));
                                if (
                                    selectedLoader &&
                                    !version.loaders.includes(selectedLoader.name) &&
                                    !loaderNames.includes(selectedLoader.name.charAt(0).toUpperCase() + selectedLoader.name.slice(1))
                                ) {
                                    loaderNames.push(selectedLoader.name.charAt(0).toUpperCase() + selectedLoader.name.slice(1));
                                }
                                return loaderNames.join(", ");
                            })()}
                        </span>
                        <span className="text-sm font-medium text-slate-300">
                            {t("Game Version", { count: version.game_versions.length > 1 ? 2 : 1 })}: {version.game_versions.slice().reverse().join(', ')}
                        </span>
                        <Download size={14} className="text-slate-500" />
                    </div>
                );
            })}
        </div>
    );
};