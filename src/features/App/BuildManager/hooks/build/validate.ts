import { useServerConfigurationStore } from "@/stores/useServerConfiguration";
import type { SnackbarState } from "@/stores/useSnackbar";
import type { Loader } from "@/types";
import type { TFunction } from "i18next";

interface ValidationParams {
    eula: boolean;
    chosenVersion: string;
    selectedLoader: Loader | null;
}

interface SnackbarApi {
    add: SnackbarState["add"];
    dismiss: SnackbarState["dismiss"];
}

export const validateBuild = (
    params: ValidationParams,
    snackbar: SnackbarApi,
    t: TFunction,
): boolean => {
    const { eula, chosenVersion, selectedLoader } = params;

    if (!eula) {
        snackbar.add({
            id: "eula-not-accepted",
            type: "error",
            message: t("You must accept the EULA to build the server."),
            action: {
                label: t("Accept EULA"),
                onClick: () => {
                    useServerConfigurationStore.getState().setEula(true);
                    snackbar.dismiss("eula-not-accepted");
                },
            },
            duration: 5000,
        });
        return false;
    }

    if (!chosenVersion) {
        snackbar.add({ id: "build-error", type: "error", message: t("Please select a game version."), duration: 4000 });
        return false;
    }

    if (!selectedLoader) {
        snackbar.add({ id: "build-error", type: "error", message: t("Please select a loader."), duration: 4000 });
        return false;
    }

    return true;
};