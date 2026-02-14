import { useCallback } from "react";

const JAVA_VERSION_MAP: Record<string, number> = {
    "1.17": 16,
    "1.18": 17,
    "1.19": 17,
    "1.20": 17,
    "1.20.5": 21,
    "1.21": 21,
};

export const useJavaVersion = () => {
    return useCallback((version: string): number => {
        const parts = version.split(".");
        const major = `${parts[0]}.${parts[1]}`;
        const full = `${parts[0]}.${parts[1]}.${parts[2] ?? "0"}`;

        return JAVA_VERSION_MAP[full] ?? JAVA_VERSION_MAP[major] ?? 21;
    }, []);
};