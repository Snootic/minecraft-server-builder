import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import JSZip from "jszip";
import {
    validateBuild,
    collectDownloads,
    addConfigFiles,
} from "./build";
import { buildFileName, compressZip, triggerBrowserDownload } from "@/tools/compressAndDownload";
import { fetchServerJar } from "@/api/mcjars";
import { downloadFilesToZip } from "@/tools/fileDownloader";
import { useServerConfigurationStore } from "@/stores/useServerConfiguration";
import { useAppStore } from "@/stores/useStore";
import { useSnackbar } from "@/stores/useSnackbar";

const SNACKBAR_ID = "build-progress";

export const useBuild = () => {
    const { t } = useTranslation();

    const {
        eula,
        propertiesFile,
        startScript,
        chosenVersion,
        gamerules,
    } = useServerConfigurationStore(
        useShallow(s => ({
            eula: s.eula,
            propertiesFile: s.propertiesFile,
            startScript: s.startScript,
            chosenVersion: s.chosenVersion,
            gamerules: s.gamerules,
        }))
    );

    const {
        selectedLoader,
        selectedMods,
        selectedDatapacks,
        selectedInstance,
        selectedProject,
    } = useAppStore(
        useShallow(s => ({
            selectedLoader: s.selectedLoader,
            selectedMods: s.selectedMods,
            selectedDatapacks: s.selectedDatapacks,
            selectedInstance: s.selectedInstance,
            selectedProject: s.selectedProject,
        }))
    );

    const addSnackbar = useSnackbar(s => s.add);
    const dismissSnackbar = useSnackbar(s => s.dismiss);

    const updateProgress = useCallback((message: string, progress: number) => {
        addSnackbar({
            id: SNACKBAR_ID,
            type: "info",
            message,
            progress,
            duration: 0,
            closeable: false,
        });
    }, [addSnackbar]);

    return useCallback(async () => {
        const snackbarApi = { add: addSnackbar, dismiss: dismissSnackbar };
        if (!validateBuild({ eula, chosenVersion, selectedLoader }, snackbarApi, t)) {
            return;
        }

        updateProgress(t("Preparing build..."), 0);

        try {
            updateProgress(t("Fetching server jar info..."), 2);
            const serverJar = await fetchServerJar(selectedLoader!.name, chosenVersion);

            updateProgress(t("Collecting files..."), 5);
            const { downloads, instanceName } = await collectDownloads({
                serverJar,
                selectedInstance,
                selectedMods,
                selectedDatapacks,
            });

            const zip = new JSZip();
            await downloadFilesToZip(zip, downloads, (filename, completed, total) => {
                const pct = 5 + Math.round((completed / total) * 80);
                const msg = filename
                    ? t("Downloading: {{name}} ({{completed}}/{{total}})", { name: filename, completed: completed + 1, total })
                    : t("Downloads complete.");
                updateProgress(msg, pct);
            });

            updateProgress(t("Adding configuration files..."), 88);
            addConfigFiles(zip, { propertiesFile, startScript, gamerules });

            updateProgress(t("Compressing files..."), 92);
            const blob = await compressZip(zip, (pct) => {
                updateProgress(t("Compressing files... {{pct}}%", { pct }), 92 + Math.round(pct * 0.07));
            });

            updateProgress(t("Starting download..."), 99);
            const serverName = instanceName ?? selectedProject?.title ?? "minecraft-server";
            const fileName = buildFileName(serverName, chosenVersion, selectedLoader!.name);
            triggerBrowserDownload(blob, fileName);

            dismissSnackbar(SNACKBAR_ID);
            addSnackbar({
                id: "build-complete",
                type: "success",
                message: t("Server build complete! Downloading {{name}}", { name: fileName }),
                duration: 6000,
            });

        } catch (error) {
            console.error("Build error:", error);
            dismissSnackbar(SNACKBAR_ID);
            addSnackbar({
                id: "build-error",
                type: "error",
                message: error instanceof Error
                    ? t("Build failed: {{msg}}", { msg: error.message })
                    : t("Build failed. Please try again."),
                duration: 8000,
            });
        }
    }, [
        t,
        eula,
        gamerules,
        addSnackbar,
        startScript,
        selectedMods,
        chosenVersion,
        propertiesFile,
        selectedLoader,
        updateProgress,
        dismissSnackbar,
        selectedProject,
        selectedInstance,
        selectedDatapacks,
    ]);
};