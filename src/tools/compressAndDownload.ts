import type JSZip from "jszip";

export type CompressionProgressCallback = (percent: number) => void;

export const compressZip = async (
    zip: JSZip,
    onProgress?: CompressionProgressCallback,
): Promise<Blob> => {
    return zip.generateAsync(
        {
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 },
        },
        (metadata) => {
            onProgress?.(Math.round(metadata.percent));
        },
    );
};

export const triggerBrowserDownload = (blob: Blob, fileName: string): void => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, 1000);
};

export const buildFileName = (
    projectTitle: string,
    version: string,
    loaderName: string,
): string => {
    const safeName = projectTitle
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase();
    return `${safeName}-${version}-${loaderName}.zip`;
};