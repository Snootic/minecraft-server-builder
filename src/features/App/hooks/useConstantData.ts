import { useCategories, useGameVersions, useLoaders } from "@/api/modrinth";
import { useAppStore } from "@/stores/useStore";
import type { Category } from "@/types";
import { useMemo } from "react";

export const useConstantData = () => {
    const selectedLoader = useAppStore((state) => state.selectedLoader);

    const { data: versions } = useGameVersions();
    const { data: loaders } = useLoaders();
    const { data: allCategories } = useCategories();

    const categories = useMemo(() => {
        if (!allCategories) return [];

        let filtered: Category[] = [];

        if (selectedLoader) {
            filtered = allCategories.filter(
                (c) =>
                    c.project_type &&
                    selectedLoader.supported_project_types &&
                    Object.values(selectedLoader.supported_project_types).includes(c.project_type)
            );
        } else {
            filtered = allCategories.filter(
                (c) =>
                    c.project_type &&
                    (c.project_type.includes("modpack") || c.project_type.includes("datapack"))
            );
        }

        const uniqueCategories = filtered.filter(
            (cat, idx, arr) => arr.findIndex((c) => c.name === cat.name) === idx
        );

        return uniqueCategories;
    }, [allCategories, selectedLoader]);

    return {
        versions,
        loaders,
        categories
    }
}