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

const JAVA_VERSION_MAP: Record<string, number> = {
    "1.0": 5,
    "1.6": 6,
    "1.7": 7,
    "1.8": 8,
    "1.17": 16,
    "1.18": 17,
    "1.21": 21,
    "26.1": 25,
};

const JAVA_VERSION_THRESHOLDS = Object.entries(JAVA_VERSION_MAP)
    .map(([version, javaVersion]) => ({
        minecraftVersion: version.split(".").map(Number),
        javaVersion,
    }))
    .sort((a, b) => compareVersions(a.minecraftVersion, b.minecraftVersion));

export const getJavaVersion = (version: string): number => {
    const minecraftVersion = version.split(".").map(Number);
    let resolvedJavaVersion: number = 25;

    for (const threshold of JAVA_VERSION_THRESHOLDS) {
        if (compareVersions(minecraftVersion, threshold.minecraftVersion) < 0) {
            break;
        }

        resolvedJavaVersion = threshold.javaVersion;
    }

    return resolvedJavaVersion;
};
