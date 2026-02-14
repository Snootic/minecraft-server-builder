import { useCallback } from "react";

export const useAikarFlags = () => {
    return useCallback((ramMb: number, javaVersion: number, jarName: string = 'server.jar'): string => {
        const ramStr = `${ramMb}M`;
        
        const isHighMem = ramMb > 12288;
        const survivorRatio = isHighMem ? 32 : 8;
        const regionSize = isHighMem ? "16M" : "8M";
        const reservePercent = isHighMem ? 20 : 15;
        const initiatingOccupancy = isHighMem ? 20 : 15;

        const javaCmd = javaVersion >= 17 ? `java` : `java`;

        const flags = [
            `${javaCmd} -Xms${ramStr} -Xmx${ramStr}`,
            `--add-modules=jdk.incubator.vector`,
            `-XX:+UseG1GC`,
            `-XX:+ParallelRefProcEnabled`,
            `-XX:MaxGCPauseMillis=200`,
            `-XX:+UnlockExperimentalVMOptions`,
            `-XX:+DisableExplicitGC`,
            `-XX:+AlwaysPreTouch`,
            `-XX:G1NewSizePercent=30`,
            `-XX:G1MaxNewSizePercent=40`,
            `-XX:G1HeapRegionSize=${regionSize}`,
            `-XX:G1ReservePercent=${reservePercent}`,
            `-XX:G1HeapWastePercent=5`,
            `-XX:G1MixedGCCountTarget=4`,
            `-XX:InitiatingHeapOccupancyPercent=${initiatingOccupancy}`,
            `-XX:G1MixedGCLiveThresholdPercent=90`,
            `-XX:G1RSetUpdatingPauseTimePercent=5`,
            `-XX:SurvivorRatio=${survivorRatio}`,
            `-XX:+PerfDisableSharedMem`,
            `-XX:MaxTenuringThreshold=1`,
            `-Dusing.aikars.flags=https://mcflags.emc.gs`,
            `-Daikars.new.flags=true`,
            `-jar ${jarName} nogui`,
        ];

        if (javaVersion < 16) {
            return flags.filter(f => !f.startsWith("--add-modules")).join(" \\\n  ");
        }

        return flags.join(" \\\n  ");
    }, []);

};