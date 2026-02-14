import type { MrpackExtractedInfo, MrpackIndex } from "@/types/mrpack/types";
import JSZip from "jszip";

export async function extractMrpackIndex(mrpackBlob: Blob | ArrayBuffer): Promise<MrpackExtractedInfo> {
	const zip = await JSZip.loadAsync(mrpackBlob);
	const indexFile = zip.file("modrinth.index.json");
	if (!indexFile) {
		throw new Error("modrinth.index.json not found in .mrpack");
	}
	const indexText = await indexFile.async("string");
	const indexJson = JSON.parse(indexText) as MrpackIndex;

	const name = indexJson.name || "instance";
	const files = (indexJson.files || []).map(f => ({
		path: f.path,
		downloads: f.downloads,
		size: f.fileSize || 0,
	}));

	return { name, files };
}
