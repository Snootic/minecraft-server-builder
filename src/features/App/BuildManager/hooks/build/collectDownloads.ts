import type { ServerJarInfo } from "@/api/mcjars";
import type { DownloadItem, ProjectVersion } from "@/types";
import { collectFiles } from "@/tools/buildHelpers";
import { extractMrpackIndex } from "@/tools/extractMrpackIndex";
import axios from "axios";

interface CollectDownloadsParams {
    serverJar: ServerJarInfo;
    selectedInstance: ProjectVersion | null;
    selectedMods: ProjectVersion[];
    selectedDatapacks: ProjectVersion[];
}

interface CollectDownloadsResult {
    downloads: DownloadItem[];
    instanceName?: string;
}

export const collectDownloads = async ({
    serverJar,
    selectedInstance,
    selectedMods,
    selectedDatapacks,
}: CollectDownloadsParams): Promise<CollectDownloadsResult> => {
    const downloads: DownloadItem[] = [];
    let instanceName: string | undefined;

    downloads.push({
        url: serverJar.jarUrl,
        filename: "server.jar",
        folder: "",
        size: serverJar.jarSize ?? undefined
    });

    if (selectedInstance) {
        const primaryFile = selectedInstance.files.find(f => f.primary);

        if (primaryFile && primaryFile.filename.endsWith(".mrpack")) {
            const response = await axios.get(primaryFile.url, { responseType: "arraybuffer" });
            const mrpackData = response.data as ArrayBuffer;

            const { name, files } = await extractMrpackIndex(mrpackData);
            instanceName = name;

            for (const file of files) {
                if (file.downloads) {
                    const pathParts = file.path!.split("/");
                    const filename = pathParts[pathParts.length - 1];
                    const folder = pathParts.slice(0, -1).join("/");
                    downloads.push({
                        url: file.downloads[0],
                        filename,
                        folder,
                        size: file.size
                    });
                }
            }
        } else {
            downloads.push(...collectFiles([selectedInstance], ""));
        }
    }

    downloads.push(...collectFiles(selectedMods, "mods"));
    downloads.push(...collectFiles(selectedDatapacks, "world/datapacks"));

    return { downloads, instanceName };
};