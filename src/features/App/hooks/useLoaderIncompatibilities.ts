import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/useStore";
import type { ProjectVersion } from "@/types";

export const useLoaderIncompatibilities = () => {
    const { t } = useTranslation();
    const { selectedInstance, selectedMods } = useAppStore(
        useShallow((s) => ({
            selectedInstance: s.selectedInstance,
            selectedDatapacks: s.selectedDatapacks,
            selectedMods: s.selectedMods,
            selectedLoader: s.selectedLoader,
        }))
    );

    return useMemo(() => {
        let incompatible = false;
        let errorMsg = ""
        const incompatibleItems: ProjectVersion[] = []
        const commonLoaders: string[] = []

        let commonModLoaders: string[] | undefined = undefined

        if (selectedMods.length > 0) {
            commonModLoaders = selectedMods.reduce<string[]>(
                (acc, mod) => acc.filter(l => mod.loaders.includes(l)),
                selectedMods[0].loaders
            );
        }

        if (selectedInstance) {
            const instanceLoaders = selectedInstance.loaders
            const incompatibleMods = [
                ...selectedMods.filter(
                    (mod: ProjectVersion) => !mod.loaders.some(l => instanceLoaders.includes(l))
                )
            ]

            if (incompatibleMods.length > 0) {
                incompatible = true;
                errorMsg = `${t('Incompatible mod loaders between mods and modpack. All mods must have the loader:', {count: instanceLoaders.length})} ${instanceLoaders.join(', ')}`
                incompatibleItems.push(...incompatibleMods)
            }
            commonLoaders.push(...instanceLoaders)
        }
        
        if (!incompatible && commonModLoaders && commonModLoaders.length === 0) {
            const loaderCounts: Record<string, number> = {};
            selectedMods.forEach(mod => {
                mod.loaders.forEach(loader => {
                    loaderCounts[loader] = (loaderCounts[loader] || 0) + 1;
                });
            });
            const sortedLoaders = Object.entries(loaderCounts).sort((a, b) => b[1] - a[1]);
            if (sortedLoaders.length > 0) {
                const maxCount = sortedLoaders[0][1];
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const topLoaders = sortedLoaders.filter(([_, count]) => count === maxCount).map(([loader]) => loader);
                commonLoaders.push(...topLoaders);
                
                const incompatibleMods = selectedMods.filter(
                    mod => !mod.loaders.some(loader => commonLoaders.includes(loader))
                );
                if (incompatibleMods.length > 0) {
                    incompatibleItems.push(...incompatibleMods);
                }
            }
            
            incompatible = true;
            errorMsg = `${t('Incompatible mod loaders between mods selected. Please choose a compatible mod loader.')}`
        }

        if (commonLoaders.length === 0 && commonModLoaders && commonModLoaders.length > 0) {
            commonLoaders.push(...commonModLoaders);
        }

        return {
            incompatible,
            errorMsg,
            incompatibleItems,
            commonLoaders
        }
    }, [selectedInstance, selectedMods, t]);
};