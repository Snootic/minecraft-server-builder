import { create } from 'zustand';
import type { Project, Loader, ProjectVersion } from '../types';
import { persist } from 'zustand/middleware';

interface AppState {
	selectedVersion: string | null;
	setSelectedVersion: (version: string | null) => void;
	selectedLoader: Loader | null;
	setSelectedLoader: (loader: Loader | null) => void;
	selectedProject: Project | null;
	setSelectedProject: (project: Project | null) => void;
	versions: string[];
	setVersions: (versions: string[]) => void;
	loaders: Loader[];
	setLoaders: (loaders: Loader[]) => void;
	selectedInstance: ProjectVersion | null;
	setSelectedInstance: (instance: ProjectVersion | null) => void;
	selectedDatapacks: ProjectVersion[];
	setSelectedDatapacks: (datapacks: ProjectVersion[]) => void;
	selectedMods: ProjectVersion[];
	setSelectedMods: (mods: ProjectVersion[]) => void;
	batchUpdateSelections: (updates: {
		selectedInstance?: ProjectVersion | null;
		selectedDatapacks?: ProjectVersion[];
		selectedMods?: ProjectVersion[];
	}) => void;
}

export const useAppStore = create<AppState>()(persist((set) => 
	({
		selectedVersion: null,
		setSelectedVersion: (version) => set({ selectedVersion: version }),
		selectedLoader: null,
		setSelectedLoader: (loader) => set({ selectedLoader: loader }),
		selectedProject: null,
		setSelectedProject: (project) => set({ selectedProject: project }),
		versions: [],
		setVersions: (versions) => set({ versions }),
		loaders: [],
		setLoaders: (loaders) => set({ loaders }),
		selectedInstance: null,
		setSelectedInstance: (instance) => set({ selectedInstance: instance }),
		selectedDatapacks: [],
		setSelectedDatapacks: (datapacks) => set({ selectedDatapacks: datapacks }),
		selectedMods: [],
		setSelectedMods: (mods) => set({ selectedMods: mods }),
		batchUpdateSelections: (updates) => set(() => ({
			...(updates.selectedInstance !== undefined ? { selectedInstance: updates.selectedInstance } : {}),
			...(updates.selectedDatapacks !== undefined ? { selectedDatapacks: updates.selectedDatapacks } : {}),
			...(updates.selectedMods !== undefined ? { selectedMods: updates.selectedMods } : {}),
		})),
	}),
	{
		name: "mine-server",
	}
));
