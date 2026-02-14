import { useProjects, useProjectVersions } from '@/api/modrinth';
import { useAppStore } from '@/stores/useStore';
import type { ProjectVersion, VersionDependency } from '@/types';
import UI from '@/ui';
import { X, ExternalLink, ShieldCheck, Check } from 'lucide-react';
import { useState, useMemo, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

interface DetailProps {
    onClose: () => void;
}

const ModpackDetail = ({ onClose }: DetailProps) => {
    const { t } = useTranslation();

    const {
        selectedProject,
        selectedLoader,
        batchUpdateSelections,
        selectedDatapacks,
        selectedInstance,
        selectedMods,
    } = useAppStore(
        useShallow((state) => ({
            selectedProject: state.selectedProject,
            selectedLoader: state.selectedLoader,
            batchUpdateSelections: state.batchUpdateSelections,
            selectedDatapacks: state.selectedDatapacks,
            selectedInstance: state.selectedInstance,
            selectedMods: state.selectedMods,
        }))
    );

    const [selectedSomething, setSelectedSomething] = useState<ProjectVersion | undefined>(() => {
        if ((selectedInstance && selectedProject) && selectedInstance.project_id === selectedProject.id) {
            return selectedInstance
        } else if (
            selectedDatapacks.some(d => d.project_id === selectedProject?.project_id)
        ) {
            return selectedDatapacks.find(d => d.project_id === selectedProject?.project_id);
        } else if (
            selectedMods.some(m => m.project_id === selectedProject?.project_id)
        ) {
            return selectedMods.find(m => m.project_id === selectedProject?.project_id);
        }
        return undefined;
    });

    const { data: versions } = useProjectVersions(selectedProject?.project_id || '');

    const filteredVersions = useMemo(() =>
        versions.filter(
            (v) => v.loaders && (!selectedLoader?.name || v.loaders.includes(selectedLoader.name))
        ),
        [versions, selectedLoader]
    );

    const versionToShow = selectedSomething || filteredVersions[0];

    const dependenciesIds = useMemo(() => {
        if (!versionToShow) return [];

        return versionToShow.dependencies
            .map((d: VersionDependency) => d.project_id)
            .filter((id): id is string => id != null);
    }, [versionToShow]);

    const { data: projects } = useProjects(dependenciesIds);

    const handleVersionClick = (version: ProjectVersion) => {
        const isSelected =
            selectedDatapacks.some((dp: ProjectVersion) => dp.id === version.id) ||
            selectedMods.some((m: ProjectVersion) => m.id === version.id) ||
            selectedInstance?.id === version.id;

        if (isSelected) {
            batchUpdateSelections({
                selectedDatapacks: selectedDatapacks.filter((dp: ProjectVersion) => dp.id !== version.id),
                selectedMods: selectedMods.filter((m: ProjectVersion) => m.id !== version.id),
                selectedInstance: selectedInstance?.id === version.id ? null : selectedInstance,
            });
            setSelectedSomething(undefined);
            return;
        }

        if (version.loaders.includes("datapack")) {
            batchUpdateSelections({
                selectedDatapacks: [...selectedDatapacks, version],
            });
            setSelectedSomething(version);
        } else {
            if (selectedProject?.project_type === "modpack") {
                batchUpdateSelections({ selectedInstance: version });
            } else {
                batchUpdateSelections({ selectedMods: [...selectedMods, version] });
            }
            setSelectedSomething(version);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30">
            <UI.GlassCard className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
                <button
                    onClick={() => {
                        onClose();
                        if (selectedSomething) {
                            if (selectedMods.includes(selectedSomething)) {
                                batchUpdateSelections({
                                    selectedMods: selectedMods.filter((m: ProjectVersion) => m.id !== selectedSomething.id)
                                });
                            } else if (selectedDatapacks.includes(selectedSomething)) {
                                batchUpdateSelections({
                                    selectedDatapacks: selectedDatapacks.filter((dp: ProjectVersion) => dp.id !== selectedSomething.id)
                                });
                            } else {
                                batchUpdateSelections({ selectedInstance: null });
                            }
                        }
                    }}
                    className="absolute top-4 right-4 py-2 px-3 hover:bg-[var(--contrast-dark)] rounded-full transition-colors z-10 group flex items-center overflow-hidden transition-all duration-500 cursor-pointer"
                    style={{ transitionProperty: 'width, background-color, padding' }}
                >
                    <X size={24} className='cursor-pointer' />
                    <span
                        className="ml-1 max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-500 text-[var(--text-contrast)] text-m whitespace-nowrap"
                        style={{ transitionProperty: 'max-width, opacity' }}
                    >
                        {t("Cancel")} / {t("Close")}
                    </span>
                </button>

                <div className="overflow-y-auto custom-scrollbar p-8">
                    <div className="flex gap-8 mb-8">
                        {selectedProject?.icon_url && (
                            <img src={selectedProject.icon_url} alt={selectedProject.title} className="w-32 h-32 rounded-3xl shadow-2xl" />
                        )}
                        <div className="flex-1">
                            <h2 className="text-4xl font-black mb-2">{selectedProject?.title}</h2>
                            <div className="flex gap-3 mb-4">
                                <span className="px-3 py-1 bg-[var(--accent)]/30 text-[var(--accent)] rounded-full text-xs font-bold">
                                    {selectedProject?.author}
                                </span>

                                <span className="px-3 py-1 bg-white/5 text-slate-400 rounded-full text-xs font-bold flex items-center gap-1">
                                    <ShieldCheck size={12} /> {selectedProject?.license}
                                </span>
                                {selectedLoader && (
                                    <span className="px-3 py-1 bg-[var(--accent-dark)]/30 text-[var(--accent-light)] rounded-full text-xs font-bold">
                                        {selectedLoader.name}
                                    </span>
                                )}
                                {selectedLoader?.name !== "datapack" && (
                                    <span className="px-3 py-1 bg-[var(--accent-dark)]/30 text-[var(--accent-light)] rounded-full text-xs font-bold">
                                        {selectedLoader?.name === "datapack"
                                            ? `${selectedProject?.project_type}, ${selectedLoader?.name}`
                                            : selectedProject?.project_type}
                                    </span>
                                )
                                }
                            </div>
                            <p className="text-slate-300 leading-relaxed">{selectedProject?.description}</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <ExternalLink size={20} className="text-[var(--accent)]" />
                        {t("Included Mods")} ({t("Version")}: {selectedSomething?.name})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="grid grid-cols-1 bg-white/5 border border-white/10 p-2 rounded-xl gap-3 max-h-[30vh] overflow-y-auto custom-scrollbar">
                            {dependenciesIds.length > 0 ? (
                                <Suspense fallback={<UI.Loading size="sm" />}>
                                    <UI.Components.ProjectList
                                        projects={projects}
                                        emptyMessage={t("No dependencies listed.")}
                                    />
                                </Suspense>
                            ) : (
                                <span className="text-slate-400">{t("No dependencies listed.")}</span>
                            )}
                        </div>

                        <Suspense fallback={<UI.Loading size="sm" />}>
                            <UI.Components.VersionList
                                versions={versions}
                                selectedLoader={selectedLoader}
                                selectedSomething={selectedSomething}
                                onVersionClick={handleVersionClick}
                                maxVersions={10}
                            />
                        </Suspense>
                    </div>
                </div>

                {selectedSomething && (
                    <div className="fixed bottom-3 right-4">
                        <button
                            onClick={() => { onClose(); }}
                            className="bottom-4 right-4 p-2 bg-[var(--primary-dark)] hover:bg-[var(--accent-dark)]/40 rounded-full transition-colors z-10 cursor-pointer"
                        >
                            <span className='flex gap-2 px-2 text-[var(--text-primary)]'>
                                <Check size={24} />
                                {t("Done")}
                            </span>
                        </button>
                    </div>
                )}
            </UI.GlassCard>
        </div>
    );
};

export default ModpackDetail;