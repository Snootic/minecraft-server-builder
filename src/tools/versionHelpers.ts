import type { Loader, ProjectVersion } from "@/types";

export const compareVersions = (v1: number[], v2: number[]): number => {
    const maxLength = Math.max(v1.length, v2.length);
    for (let i = 0; i < maxLength; i++) {
        const v1Part = v1[i] ?? 0;
        const v2Part = v2[i] ?? 0;
        if (v1Part !== v2Part) {
            return v1Part - v2Part;
        }
    }
    return 0;
};

export const formatLoaderName = (loader: string) =>
    loader.charAt(0).toUpperCase() + loader.slice(1);

export const getLoaderLabelFromProjectVersion = (
    version: ProjectVersion,
    selectedLoader: Loader | null,
) => {
    const loaderNames = version.loaders.map(formatLoaderName);
    const selectedLoaderName = selectedLoader
        ? formatLoaderName(selectedLoader.name)
        : null;

    if (selectedLoaderName && !loaderNames.includes(selectedLoaderName)) {
        loaderNames.push(selectedLoaderName);
    }

    return loaderNames.join(", ");
};