import axios from "axios";
import type JSZip from "jszip";
import { QueryClient } from "@tanstack/react-query";
import type { DownloadItem, ProgressCallback } from "../types";

const buildQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 10,
            gcTime: 1000 * 60 * 30,
        },
    },
});

const fetchFileBuffer = async (url: string): Promise<ArrayBuffer> => {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return response.data as ArrayBuffer;
};

const getCachedFile = (url: string): Promise<ArrayBuffer> => {
    return buildQueryClient.fetchQuery({
        queryKey: ["build-file", url],
        queryFn: () => fetchFileBuffer(url),
    });
};

export const downloadFilesToZip = async (
    zip: JSZip,
    downloads: DownloadItem[],
    onProgress: ProgressCallback,
): Promise<void> => {
    let completed = 0;

    for (const item of downloads) {
        onProgress(item.filename, completed, downloads.length);

        const data = await getCachedFile(item.url);

        if (item.folder) {
            zip.folder(item.folder)!.file(item.filename, data);
        } else {
            zip.file(item.filename, data);
        }

        completed++;
    }

    onProgress("", completed, downloads.length);
};

export const invalidateBuildCache = () => {
    void buildQueryClient.invalidateQueries({ queryKey: ["build-file"] });
};