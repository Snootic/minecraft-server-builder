import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameruleEntry, ServerProperties } from "../types";
import { ServerPropertiesSchema } from "../constants/server.properties";

interface ServerConfiguration {
  propertiesFile: ServerProperties;
  setPropertiesFile: (file: ServerProperties) => void;
  eula: boolean;
  setEula: (eula: boolean) => void;
  chosenVersion: string;
  setChosenVersion: (version: string) => void;
  includeGeyser: boolean;
  setIncludeGeyser: (val: boolean) => void;
  aikarFlags: boolean;
  setAikarFlags: (val: boolean) => void;
  ramMb: number;
  setRamMb: (val: number) => void;
  startScript: string;
  setStartScript: (val: string) => void;
  gamerules: GameruleEntry[];
  setGamerules: (rules: GameruleEntry[]) => void;
  addGamerule: (rule: GameruleEntry) => void;
  removeGamerule: (name: string) => void;
  updateGamerule: (name: string, value: string) => void;
}

export const useServerConfigurationStore = create<ServerConfiguration>()(
  persist(
    (set) => ({
      propertiesFile: ServerPropertiesSchema.genericBase as ServerProperties,
      eula: false,
      chosenVersion: "",
      includeGeyser: false,
      aikarFlags: true,
      ramMb: 4096,
      startScript: "",
      gamerules: [],
      setPropertiesFile: (file) => set({ propertiesFile: file }),
      setEula: (eula) => set({ eula }),
      setChosenVersion: (version) => set({ chosenVersion: version }),
      setIncludeGeyser: (val) => set({ includeGeyser: val }),
      setAikarFlags: (val) => set({ aikarFlags: val }),
      setRamMb: (val) => set({ ramMb: val }),
      setStartScript: (val) => set({ startScript: val }),
      setGamerules: (rules) => set({ gamerules: rules }),
      addGamerule: (rule) =>
        set((state) => ({
          gamerules: [...state.gamerules.filter((r) => r.name !== rule.name), rule],
        })),
      removeGamerule: (name) =>
        set((state) => ({
          gamerules: state.gamerules.filter((r) => r.name !== name),
        })),
      updateGamerule: (name, value) =>
        set((state) => ({
          gamerules: state.gamerules.map((r) => (r.name === name ? { ...r, value } : r)),
        })),
    }),
    {
      name: "server-config-storage",
    },
  ),
);
