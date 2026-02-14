import { FileCog } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useServerConfigurationStore } from "../../../../stores/useServerConfiguration";
import { ServerPropertiesSchema } from "../../../../constants/server.properties";
import { compareVersions } from "@/tools/versionHelpers";
import type { ServerProperties, serverPropertiesProps } from "@/types";
import UI from "@/ui";

const PropertiesManager = () => {
    const { t } = useTranslation();

    const { propertiesFile, setPropertiesFile, chosenVersion } = useServerConfigurationStore(
        useShallow(s => ({
            propertiesFile: s.propertiesFile,
            setPropertiesFile: s.setPropertiesFile,
            chosenVersion: s.chosenVersion,
        }))
    );

    useEffect(() => {
        let props = { ...ServerPropertiesSchema.genericBase };
        const splitted = chosenVersion.split(".").map(Number);

        let versionIndex = -1;
        let bestVersion: number[] | null = null;

        for (let i = 0; i < ServerPropertiesSchema.versionHistory.length; i++) {
            const entryVersion = ServerPropertiesSchema.versionHistory[i].version.split(".").map(Number);
            
            if (compareVersions(entryVersion, splitted) <= 0) {
                if (bestVersion === null || compareVersions(entryVersion, bestVersion) > 0) {
                    versionIndex = i;
                    bestVersion = entryVersion;
                }
            }
        }

        if (versionIndex === -1) return setPropertiesFile(props as ServerProperties);

        for (let i = 0; i <= versionIndex; i++) {
            const diff = ServerPropertiesSchema.versionHistory[i];
            
            props = { ...props, ...diff.additions };

            if (diff.removals) {
                diff.removals.forEach(key => delete (props as serverPropertiesProps)[key]);
            }
        }

        const currentProperties = useServerConfigurationStore.getState().propertiesFile;
        if (currentProperties && Object.keys(currentProperties).length > 0) {
            Object.entries(currentProperties).forEach(([key, value]) => {
                if (key in props) {
                    const currentType = typeof (props as serverPropertiesProps)[key];
                    const incomingType = typeof value;
                    if (currentType === incomingType) {
                        (props as serverPropertiesProps)[key] = value;
                    }
                }
            });
        }
        setPropertiesFile(props as ServerProperties);
    }, [chosenVersion, setPropertiesFile])

    return (
        <div className="grid grid-cols-1 bg-white/5 border border-white/10 p-2 rounded-xl gap-3 h-[55vh]">
            <div className="grid grid-cols-1 gap-2">
                <div className="flex gap-2">
                    <FileCog />
                    <h3 className="text-1xl font-bold text-[var(--text-primary)] uppercase">
                        {t("Configure your 'server.properties' file")}
                    </h3>
                </div>
                <div className="grid grid-cols-1 max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
                    {Object.entries(propertiesFile).map(([key, value]) => (
                        <UI.Components.Entry key={key} entryKey={key} value={value} onChange={(k, v) => {
                            setPropertiesFile({
                                ...propertiesFile,
                                [k]: v,
                            });
                        }}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default PropertiesManager;