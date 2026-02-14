export interface MrpackFile {
    path: string;
    hashes: MrpackFileHashes;
    env: MrpackFileEnv;
    downloads: string[];
    fileSize: number;
}

export interface MrpackDependencies {
    "fabric-loader"?: string;
    minecraft?: string;
    forge?: string;
    neoforge?: string;
    quilt?: string;
    [key: string]: string | undefined;
}

export interface MrpackIndex {
    game: string;
    formatVersion: number;
    versionId: string;
    name: string;
    summary?: string;
    files: MrpackFile[];
    dependencies: MrpackDependencies;
}

export interface MrpackFileHashes {
    sha1: string;
    sha512: string;
}

export type EnvSupport = "required" | "optional" | "unsupported";

export interface MrpackFileEnv {
    client: EnvSupport;
    server: EnvSupport;
}

export interface MrpackExtractedFile {
    path: string;
    downloads: string[];
    primaryDownload: string;
    size: number;
    hashes: MrpackFileHashes;
    env: MrpackFileEnv;
}

export interface MrpackExtractedInfo {
    name: string;
    files: Partial<MrpackExtractedFile>[];
}
