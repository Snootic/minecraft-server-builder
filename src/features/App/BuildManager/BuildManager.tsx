import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import type { projectData } from "../hooks/useProjectData";
import { useAppStore } from "@/stores/useStore";
import { useVersionIncompatibilities } from "../hooks/useVersionIncompatibilities";
import { useLoaders } from "@/api/modrinth";
import { useBuild } from "./hooks/useBuild";
import { useServerConfigurationStore } from "@/stores/useServerConfiguration";
import { useLoaderIncompatibilities } from "../hooks/useLoaderIncompatibilities";
import UI from "@/ui";
import { AdditionalMods, GameruleEditor, PropertiesManager, QuickSettings, StartupScript } from "./components";

interface BuildManagerProps {
    onClose: () => void;
    manageButton: () => void;
    projects: projectData
}

const BuildManager = ({ onClose, projects, manageButton }: BuildManagerProps) => {
    const { mainProject } = projects;

    const { t } = useTranslation();

    const selectedDatapacks = useAppStore(s => s.selectedDatapacks);
    const selectedMods = useAppStore(s => s.selectedMods);
    const selectedLoader = useAppStore(s => s.selectedLoader);
    const setSelectedLoader = useAppStore(s => s.setSelectedLoader);

    const { commonVersions } = useVersionIncompatibilities()
    const { commonLoaders } = useLoaderIncompatibilities();

    const {data: loaders} = useLoaders();

    const build = useBuild();

    const {
        chosenVersion,
        setChosenVersion,
    } = useServerConfigurationStore(
        useShallow(s => ({
            chosenVersion: s.chosenVersion,
            setChosenVersion: s.setChosenVersion,
        }))
    );

    const versions = useMemo(() => {
        if (!commonVersions) return [];
        return commonVersions.reverse().map((version: string) => ({
            value: version,
            label: version
        }));
    }, [commonVersions]);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30">
            <UI.GlassCard className="w-7xl h-[90vh] overflow-hidden flex flex-col relative">
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

                <div className="p-8 flex gap-4 items-center">
                    <h2 className="text-4xl font-black mb-2">{t('Build Server')}</h2>

                    <div className="grid grid-cols-2 gap-2 max-w-[26vw]">
                        <h3 className="font-bold text-2xl text-[var(--accent)]/70">{t("Chosen version")}</h3>
                        <UI.Components.SelectMenu options={versions} onChange={setChosenVersion} value={chosenVersion} placeholder={t("Select a game version")}/>
                    </div>
                </div>

                <div className="px-8 pb-8 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 items-center gap-2">
                        <div className="grid grid-cols-2 col-span-1 gap-2">
                            <div className="flex flex-col gap-2">
                                <div>
                                    <span className="font-semibold">{t("Project")}:</span>{" "}
                                    <span>{mainProject?.title ?? t("None selected")}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">{t("Mods selected")}:</span>{" "}
                                    <span>{selectedMods.length}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">{t("Datapacks selected")}:</span>{" "}
                                    <span>{selectedDatapacks.length}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <UI.Components.SelectMenu 
                                        options={commonLoaders.map(l => ({ label: l, value: l }))} 
                                        onChange={(value) => setSelectedLoader(loaders?.find(loader => loader.name === value) ?? null)}
                                        value={selectedLoader?.name ?? ""}
                                        placeholder={t("Select a game loader")}
                                    />

                                    <button
                                        className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white font-bold py-2 px-4 rounded transition-colors w-fit cursor-pointer"
                                        type="button"
                                        onClick={manageButton}
                                    >
                                        {t("Manage")}
                                    </button>

                                </div>
                            </div>
                            <AdditionalMods/>

                            <div className="col-span-2 bg-white/5 border border-white/10 p-4 rounded-xl">
                                <GameruleEditor />
                            </div>
                        </div>

                        <div className="col-span-1 grid">
                            <QuickSettings />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <PropertiesManager/>
                        <div className="flex flex-col gap-3">
                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                <StartupScript />
                            </div>
                            <button
                                className={`
                                    w-full px-6 py-4 rounded-xl font-bold text-lg
                                    transition-all duration-300
                                    bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-[var(--bg-surface-light)] cursor-pointer
                                    shadow-lg hover:shadow-xl
                                `}
                                onClick={() => {
                                    void build();
                                }}
                            >
                                {t("Finalize & Build")}
                            </button>
                        </div>
                    </div>
                </div>
            </UI.GlassCard>
        </div>
    );
};

export default BuildManager;