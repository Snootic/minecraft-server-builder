import type { GameruleEntry, ServerProperties } from "@/types";
import { generateProperties } from "@/tools/buildHelpers";
import type JSZip from "jszip";
import { createGameruleDatapack } from "@/tools/gameRuleDatapack";

interface ConfigFilesParams {
    propertiesFile: ServerProperties;
    startScript: string;
    gamerules: GameruleEntry[];
}

export const addConfigFiles = (zip: JSZip, params: ConfigFilesParams): void => {
    const { propertiesFile, startScript, gamerules } = params;

    zip.file("eula.txt", "# Accepted via Minecraft-Server-Builder\neula=true\n");

    const propsContent = generateProperties(propertiesFile);
    zip.file("server.properties", propsContent);

    if (startScript) {
        zip.file("start.sh", startScript);
    }

    if (gamerules.length > 0) {
        const gameruleZip = createGameruleDatapack(gamerules);
        zip.folder("world/datapacks")!.file("gamerules.zip", gameruleZip.generateAsync({ type: "blob" }));
    }
};