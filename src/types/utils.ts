export interface DownloadItem {
	url: string;
	filename: string;
	folder: string;
	size?: number;
}

export type ProgressCallback = (filename: string, completed: number, total: number) => void;
