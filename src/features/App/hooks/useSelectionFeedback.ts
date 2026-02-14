import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { useVersionIncompatibilities } from "./useVersionIncompatibilities";
import { useLoaderIncompatibilities } from "./useLoaderIncompatibilities";
import type { Project } from "@/types";
import { useAppStore } from "@/stores/useStore";
import { useSnackbar } from "@/stores/useSnackbar";

export const useSelectionFeedback = (
  onManage: () => void,
  isManagerOpen: boolean,
  project: Project | undefined,
) => {
  const { t } = useTranslation();
  const { selectedDatapacks, selectedInstance, selectedMods } = useAppStore(
    useShallow((state) => ({
      selectedDatapacks: state.selectedDatapacks,
      selectedInstance: state.selectedInstance,
      selectedMods: state.selectedMods,
    })),
  );
  const { incompatible: incompatibleVersions, errorMsg: versionError } =
    useVersionIncompatibilities();
  const { incompatible: incompatibleLoaders, errorMsg: loaderError } =
    useLoaderIncompatibilities();
  const add = useSnackbar((state) => state.add);
  const dismiss = useSnackbar((state) => state.dismiss);

  useEffect(() => {
    const filter =
      selectedDatapacks.length === 0 &&
      !selectedInstance &&
      selectedMods.length === 0;

    if (filter || isManagerOpen) {
      dismiss("selection-status");
      return;
    }

    let message = "";
    if (incompatibleVersions || incompatibleLoaders) {
      message = incompatibleVersions ? versionError : loaderError;
    } else {
      const instanceText = project ? project.title : "";
      const modsText =
        selectedMods.length > 0
          ? `${selectedMods.length} ${t("Mod", { count: selectedMods.length > 1 ? 2 : 1 })}`
          : "";
      const datapacksText =
        selectedDatapacks.length > 0
          ? `${selectedDatapacks.length} ${t("Datapack", { count: selectedDatapacks.length > 1 ? 2 : 1 })}`
          : "";

      const parts = [instanceText, modsText, datapacksText].filter(Boolean);

      if (parts.length === 1) {
        message = `${t("Selected")}: ${parts[0]}`;
      } else if (parts.length === 2) {
        message = `${t("Selected")}: ${parts[0]} ${t("and")} ${parts[1]}`;
      } else if (parts.length === 3) {
        message = `${t("Selected")}: ${parts[0]}, ${parts[1]} ${t("and")} ${parts[2]}`;
      }
    }

    add({
      id: "selection-status",
      message,
      draggable: true,
      type: incompatibleVersions || incompatibleLoaders ? "error" : "info",
      duration: 0,
      action: {
        label: t("Manage"),
        onClick: onManage,
      },
    });
  }, [
    t,
    add,
    dismiss,
    project,
    onManage,
    selectedMods,
    isManagerOpen,
    selectedInstance,
    selectedDatapacks,
    incompatibleVersions,
    incompatibleLoaders,
    versionError,
    loaderError,
  ]);
};
