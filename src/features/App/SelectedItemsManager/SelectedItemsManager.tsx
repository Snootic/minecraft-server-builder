import { Suspense, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Puzzle, X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import type { projectData } from "../hooks/useProjectData";
import { useAppStore } from "@/stores/useStore";
import type { Project } from "@/types";
import { useVersionIncompatibilities } from "../hooks/useVersionIncompatibilities";
import { useLoaderIncompatibilities } from "../hooks/useLoaderIncompatibilities";
import UI from "@/ui";

interface SelectedItemsManagerProps {
    onClose: () => void;
    projects: projectData
}

const SelectedItemsManager = ({ onClose, projects }: SelectedItemsManagerProps) => {
    const { mainProject, dependencies, mods, datapacks } = projects;

    const { t } = useTranslation();

    const {
        selectedDatapacks,
        selectedMods,
        setSelectedDatapacks,
        setSelectedMods,
    } = useAppStore(
        useShallow((state) => ({
            selectedDatapacks: state.selectedDatapacks,
            selectedMods: state.selectedMods,
            setSelectedDatapacks: state.setSelectedDatapacks,
            setSelectedMods: state.setSelectedMods,
        }))
    );
    
    const [selectedDatapackProjects, setSelectedDatapacksProjects] = useState<Project[]>(datapacks)
    const [selectedModProjects, setSelectedModProjects] = useState<Project[]>(mods)

    const {commonVersions, errorMsg: incompatibleVersionsMesssage, incompatible: isVersionsIncompatible, incompatibleItems: incompatibleVersions} = useVersionIncompatibilities()
    const {commonLoaders, errorMsg: incompatibleLoaderMessage, incompatible: isLoadersIncompatible, incompatibleItems: incompatibleLoaders} = useLoaderIncompatibilities()

    const allProjects = useMemo(() => [
        ...(mods ?? []),
        ...(datapacks ?? []),
        ...(mainProject ? [mainProject] : [])
    ], [mods, datapacks, mainProject]);

    const incompatibleVersionProjects = useMemo(() => {
        return incompatibleVersions
            ?.map((pv) => allProjects.find(p => p.id === pv.project_id))
            .filter(Boolean) as Project[];
    }, [incompatibleVersions, allProjects]);

    const incompatibleLoaderProjects = useMemo(() => {
        return incompatibleLoaders
            ?.map((pv) => allProjects.find(p => p.id === pv.project_id))
            .filter(Boolean) as Project[];
    }, [incompatibleLoaders, allProjects]);

    const hasChange = useMemo(() => {
        return (selectedDatapackProjects.length != selectedDatapacks.length || selectedModProjects.length != selectedMods.length)
    }, [selectedDatapackProjects, selectedDatapacks, selectedModProjects, selectedMods])

    const saveChanges = useCallback(() => {
        const updatedDatapacks = selectedDatapacks.filter(dp =>
            selectedDatapackProjects.some(p => p.id === dp.project_id)
        );
        setSelectedDatapacks(updatedDatapacks);

        const updatedMods = selectedMods.filter(mod =>
            selectedModProjects.some(p => p.id === mod.project_id)
        );
        setSelectedMods(updatedMods);

    },[
        selectedDatapackProjects,
        selectedDatapacks,
        selectedModProjects,
        selectedMods,
        setSelectedDatapacks,
        setSelectedMods
    ])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30">
            <UI.GlassCard className="w-6xl h-[80vh] overflow-hidden flex flex-col relative">
                <button
                    onClick={onClose}
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
                    <h2 className="text-4xl font-black mb-2">{t('Modpack, Datapacks and Mods selected')}</h2>
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex flex-wrap gap-3">
                                { !isVersionsIncompatible ? (
                                   commonVersions.length > 0 && <span className="px-3 py-1 bg-[var(--accent)]/30 text-[var(--accent)] rounded-full text-xs font-bold">
                                        {t("Possible version", {count: commonVersions.length})}: {commonVersions.join(', ')}
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold border border-red-500/30 flex items-center gap-2">
                                        <X size={14} /> {t("Incompatible Versions")}
                                    </span>
                                )}
                                
                                { !isLoadersIncompatible ? (
                                    commonLoaders.length > 0 && <span className="px-3 py-1 bg-white/5 text-slate-400 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Puzzle size={12} /> {t("Possible loader", {count: commonLoaders.length})}: {commonLoaders.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')}
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold border border-red-500/30 flex items-center gap-2">
                                        <X size={14} /> {t("Incompatible Loaders")}
                                    </span>
                                )}
                        </div>

                        {(isVersionsIncompatible || isLoadersIncompatible) && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                {isVersionsIncompatible && (
                                    <div className="mb-4 last:mb-0">
                                        <h3 className="text-sm font-bold text-red-400 mb-1 flex items-center gap-2">
                                            {t("Version conflict detected")}
                                        </h3>
                                        <p className="text-xs text-slate-300 mb-2">{incompatibleVersionsMesssage}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {incompatibleVersionProjects?.map((project: Project) => (
                                                <span key={project.id} className="px-2 py-0.5 bg-red-500/20 border border-red-500/20 text-red-300 rounded text-[10px]">
                                                    {project.title}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {isLoadersIncompatible && (
                                    <div className="mb-4 last:mb-0">
                                        <h3 className="text-sm font-bold text-red-400 mb-1 flex items-center gap-2">
                                            {t("Loader conflict detected")}
                                        </h3>
                                        <p className="text-xs text-slate-300 mb-2">{incompatibleLoaderMessage}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {incompatibleLoaderProjects?.map((project: Project) => (
                                                <span key={project.id} className="px-2 py-0.5 bg-red-500/20 border border-red-500/20 text-red-300 rounded text-[10px]">
                                                    {project.title}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="grid grid-cols-1 bg-white/5 border border-white/10 p-2 rounded-xl gap-3 h-[60vh]">
                            
                            
                            {mainProject && (
                                <div className="flex gap-1 items-center">
                                    <img 
                                        src={mainProject.icon_url ?? undefined} 
                                        alt={mainProject.title} 
                                        className="w-15 h-15 object-contain select-none"
                                    />
                                    <h3 className="text-1xl font-bold text-[var(--text-primary)] uppercase">
                                        {mainProject.title}
                                    </h3>
                                </div>
                            )}
                            <div className="overflow-y-auto custom-scrollbar flex-1">
                                <Suspense fallback={<UI.Loading size="sm" />}>
                                    <UI.Components.ProjectList
                                        projects={dependencies}
                                        emptyMessage={t("No dependencies listed.")}
                                    />
                                </Suspense>
                            </div>
                        </div>

                        <div className="grid grid-rows-2 bg-white/5 border border-white/10 p-2 rounded-xl gap-3 max-h-[60vh]">
                            <div className="flex flex-col gap-2 h-[30vh]">
                                <h3 className="text-1xl font-bold text-[var(--text-primary)] uppercase">
                                    {`${t("Mod", {count: 2})}: ${selectedMods.length} 
                                        ${selectedMods.length > 1 ? t("Item", {count: 2}) : t("Item")} 
                                        ${(selectedMods.length != selectedModProjects.length) && selectedModProjects[0]?.id !== "dummy" ? 
                                        `(${selectedModProjects.length} ${t("Currently selected")})` : ""}`
                                    }
                                </h3>
                                <div className="overflow-y-auto custom-scrollbar flex-1">
                                    <Suspense fallback={<UI.Loading size="sm" />}>
                                        <UI.Components.ProjectList
                                            projects={mods}
                                            emptyMessage={t("No dependencies listed.")}
                                            manageableList={selectedModProjects}
                                            setManageableList={setSelectedModProjects}
                                        />
                                    </Suspense>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 h-[30vh]">
                                <h3 className="text-1xl font-bold text-[var(--text-primary)] uppercase">
                                    {`${t("Datapack", {count: 2})}: ${selectedDatapacks.length} 
                                        ${selectedDatapacks.length > 1 ? t("Item", {count: 2}) : t("Item")} 
                                        ${(selectedDatapacks.length != selectedDatapackProjects.length) && selectedDatapackProjects[0]?.id !== "dummy"? 
                                        `(${selectedDatapackProjects.length} ${t("Currently selected")})` : ""}`
                                    }
                                </h3>
                                <div className="overflow-y-auto custom-scrollbar flex-1">
                                    <Suspense fallback={<UI.Loading size="sm" />}>
                                        <UI.Components.ProjectList
                                            projects={datapacks}
                                            emptyMessage={t("No datapacks selected.")}
                                            manageableList={selectedDatapackProjects}
                                            setManageableList={setSelectedDatapacksProjects}
                                        />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {hasChange && (
                    <div className="fixed bottom-3 right-4">
                        <button
                            onClick={() => { onClose(); saveChanges()}}
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

export default SelectedItemsManager;