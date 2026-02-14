import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/useStore";
import type { ProjectVersion } from "@/types";

export const useVersionIncompatibilities = () => {
    const { t } = useTranslation();

    const { selectedInstance, selectedDatapacks, selectedVersion, selectedMods } = useAppStore(
        useShallow((s) => ({
            selectedInstance: s.selectedInstance,
            selectedDatapacks: s.selectedDatapacks,
            selectedVersion: s.selectedVersion,
            selectedMods: s.selectedMods,
        }))
    );

    return useMemo(() => {
        let incompatible = false;
        let errorMsg = ""
        const incompatibleItems: ProjectVersion[] = []
        const commonVersions: string[] = []
        
        const instanceVersions = selectedInstance?.game_versions ?? [];

        if (selectedVersion) {
            commonVersions.push(selectedVersion)

            if (selectedInstance && !instanceVersions.includes(selectedVersion)) {
                incompatible = true;
                errorMsg = t("Incompatible versions: Instance must support") + ` ${selectedVersion}`;
                incompatibleItems.push(selectedInstance)
            }
            
            if (!incompatible) {
                const incompatibleDatapack = selectedDatapacks.filter(
                    (dp: ProjectVersion) => !dp.game_versions.includes(selectedVersion)
                );
                const incompatibleMods = selectedMods.filter(
                    (mod: ProjectVersion) => !mod.game_versions.includes(selectedVersion)
                );
                if (incompatibleDatapack.length > 0 || incompatibleMods.length > 0) {
                    incompatible = true;
                    errorMsg = t("Incompatible versions: All selected datapacks and mods and instance must support") + ` ${selectedVersion}`;
                    incompatibleItems.push(...(incompatibleDatapack ?? []), ...(incompatibleMods ?? []))
                }
            }
        } else {
            if (selectedInstance) {
                commonVersions.push(...selectedInstance.game_versions)
                const incompatibleDatapack = selectedDatapacks.filter(
                    (dp: ProjectVersion) => !dp.game_versions.some(v => instanceVersions.includes(v))
                );
                const incompatibleMods = selectedMods.filter(
                    (mod: ProjectVersion) => !mod.game_versions.some(v => instanceVersions.includes(v))
                );

                if (incompatibleDatapack.length > 0 || incompatibleMods.length > 0) {
                    incompatible = true;
                    errorMsg = t("Incompatible versions: No common game version between selected datapacks, mods and instance.");
                    incompatibleItems.push(...(incompatibleDatapack ?? []), ...(incompatibleMods ?? []))
                }
            } else {
                const commonDatapackVersions = selectedDatapacks.length > 0
                    ? selectedDatapacks.reduce<string[]>(
                        (acc, dp) => acc.filter(v => dp.game_versions.includes(v)),
                        selectedDatapacks[0].game_versions
                    ) : [];
                const commonModVersions = selectedMods.length > 0
                    ? selectedMods.reduce<string[]>(
                        (acc, mod) => acc.filter(v => mod.game_versions.includes(v)),
                        selectedMods[0].game_versions
                    ) : [];

                const commonVersionsBetweenDatapacksAndMods = 
                    commonDatapackVersions.length === 0 || commonModVersions.length === 0
                    ? [...commonDatapackVersions, ...commonModVersions]
                    : commonDatapackVersions.filter(v => commonModVersions.includes(v));
                
                const incompatibleDM = [
                    ...selectedDatapacks.filter(
                        (dp: ProjectVersion) => !dp.game_versions.some(v => commonVersionsBetweenDatapacksAndMods.includes(v))
                    ),
                    ...selectedMods.filter(
                        (mod: ProjectVersion) => !mod.game_versions.some(v => commonVersionsBetweenDatapacksAndMods.includes(v))
                    )
                ]

                if (incompatibleDM.length > 0) {
                    incompatible = true;
                    errorMsg = t("Incompatible versions: No common game version between selected datapacks and mods.");
                    incompatibleItems.push(...incompatibleDM)
                }
                commonVersions.push(...commonVersionsBetweenDatapacksAndMods)
            }
        }
        
        return {incompatible, errorMsg, incompatibleItems, commonVersions}
    }, [selectedInstance, selectedVersion, t, selectedDatapacks, selectedMods]);
};