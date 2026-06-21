import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectVersion } from "../types";

interface AppState {
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

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            selectedInstance: null,
            setSelectedInstance: (instance) => set({ selectedInstance: instance }),
            selectedDatapacks: [],
            setSelectedDatapacks: (datapacks) =>
                set({ selectedDatapacks: datapacks }),
            selectedMods: [],
            setSelectedMods: (mods) => set({ selectedMods: mods }),
            batchUpdateSelections: (updates) =>
                set(() => ({
                    ...(updates.selectedInstance !== undefined
                        ? { selectedInstance: updates.selectedInstance }
                        : {}),
                    ...(updates.selectedDatapacks !== undefined
                        ? { selectedDatapacks: updates.selectedDatapacks }
                        : {}),
                    ...(updates.selectedMods !== undefined
                        ? { selectedMods: updates.selectedMods }
                        : {}),
                })),
        }),
        {
            name: "mine-server",
            partialize: (state) => ({
                selectedInstance: state.selectedInstance,
                selectedDatapacks: state.selectedDatapacks,
                selectedMods: state.selectedMods,
            }),
        },
    ),
);
