import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { ProjectVersion, Loader } from "../../types";
import { useAppStore } from "../../stores/useStore";
import { useShallow } from "zustand/react/shallow";
import UI from "..";
import { getLoaderLabelFromProjectVersion } from "@/tools/versionHelpers";

interface VersionListProps {
    versions: ProjectVersion[];
    selectedLoader: Loader | null;
    selectedSomething?: ProjectVersion;
    onVersionClick: (version: ProjectVersion) => void;
    maxVersions?: number;
}

interface VersionListContentProps {
    versions: ProjectVersion[];
    selectedLoader: Loader | null;
    selectedSomething?: ProjectVersion;
    onVersionClick: (version: ProjectVersion) => void;
    maxVersions: number;
    selectedInstance: ProjectVersion | null;
    selectedDatapacks: ProjectVersion[];
    selectedMods: ProjectVersion[];
}

const VersionListContent = ({
    selectedLoader,
    versions,
    selectedSomething,
    onVersionClick,
    maxVersions,
    selectedInstance,
    selectedDatapacks,
    selectedMods,
}: VersionListContentProps) => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(versions.length / maxVersions);
    const paginatedVersions = versions.slice(
        page * maxVersions,
        (page + 1) * maxVersions,
    );

    return (
        <div className="flex flex-col max-h-[30vh] min-h-0">
            <div className="grid grid-cols-1 gap-3 overflow-y-auto custom-scrollbar min-h-0 pr-1">
                {paginatedVersions.map((version: ProjectVersion) => {
                    const isSelected =
                        selectedSomething?.id === version.id ||
                        selectedInstance?.id === version.id ||
                        selectedDatapacks.includes(version) ||
                        selectedMods.includes(version);

                    return (
                        <div
                            key={version.id}
                            className={`grid ${isSelected ? "bg-(--primary-dark)/30" : "bg-white/5"} border border-white/10 p-2 rounded-xl grid-rows-2 justify-between items-center gap-2 cursor-pointer hover:${isSelected ? "bg-[var(--primary-light)]/30" : "bg-white/10"} transition-colors`}
                            onClick={() => onVersionClick(version)}
                            tabIndex={0}
                            role="button"
                            aria-pressed={isSelected}
                        >
                            <span className="text-sm font-medium text-slate-300">
                                {t("Version")}: {version.name}
                            </span>
                            <span className="text-sm font-medium text-slate-300">
                                {t("Loader", {
                                    count: version.loaders.length > 1 ? 2 : 1,
                                })}
                                : {getLoaderLabelFromProjectVersion(version, selectedLoader)}
                            </span>
                            <span className="text-sm font-medium text-slate-300">
                                {t("Game Version", {
                                    count:
                                        version.game_versions.length > 1
                                            ? 2
                                            : 1,
                                })}
                                :{" "}
                                {version.game_versions
                                    .slice()
                                    .reverse()
                                    .join(", ")}
                            </span>
                            <Download size={14} className="text-slate-500" />
                        </div>
                    );
                })}
            </div>
            <UI.Components.Pagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                compact
            />
        </div>
    );
};

export const VersionList = ({
    versions,
    selectedLoader,
    selectedSomething,
    onVersionClick,
    maxVersions = 10,
}: VersionListProps) => {
    const { selectedInstance, selectedDatapacks, selectedMods } = useAppStore(
        useShallow((state) => ({
            selectedInstance: state.selectedInstance,
            selectedDatapacks: state.selectedDatapacks,
            selectedMods: state.selectedMods,
        })),
    );

    const paginationKey = `${selectedLoader?.name ?? "all"}:${maxVersions}:${versions.map((version) => version.id).join(":")}`;

    return (
        <VersionListContent
            key={paginationKey}
            versions={versions}
            selectedLoader={selectedLoader}
            selectedSomething={selectedSomething}
            onVersionClick={onVersionClick}
            maxVersions={maxVersions}
            selectedInstance={selectedInstance}
            selectedDatapacks={selectedDatapacks}
            selectedMods={selectedMods}
        />
    );
};
