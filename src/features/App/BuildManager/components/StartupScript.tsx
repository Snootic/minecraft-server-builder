import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Terminal } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useServerConfigurationStore } from "@stores/useServerConfiguration";
import { useJavaVersion } from "../hooks/useJavaVersions";
import { useAikarFlags } from "../hooks/useAikarFlags";
import UI from "@ui";

const StartupScript = () => {
    const { t } = useTranslation();
    const { chosenVersion, aikarFlags, setAikarFlags, ramMb, setRamMb, startScript, setStartScript } = useServerConfigurationStore(
        useShallow((s) => ({
            chosenVersion: s.chosenVersion,
            aikarFlags: s.aikarFlags,
            setAikarFlags: s.setAikarFlags,
            ramMb: s.ramMb,
            setRamMb: s.setRamMb,
            startScript: s.startScript,
            setStartScript: s.setStartScript,
        }))
    );

    const getJavaVersion = useJavaVersion();
    const generateAikarFlags = useAikarFlags();
    const resolvedJavaVersion = useMemo(() => {
        if (!chosenVersion || !getJavaVersion(chosenVersion)) return 21;
        return getJavaVersion(chosenVersion);
    }, [chosenVersion, getJavaVersion]);


    const generatedScript = useMemo(() => {
        if (!chosenVersion) return "#!/bin/bash\njava -jar server.jar nogui";

        const ramStr = `${ramMb}M`;

        if (aikarFlags) {
            const flags = generateAikarFlags(ramMb, resolvedJavaVersion);
            return `#!/bin/bash\n${flags}`;
        }

        return `#!/bin/bash\njava -Xms${ramStr} -Xmx${ramStr} -jar server.jar nogui`;
    }, [chosenVersion, ramMb, aikarFlags, generateAikarFlags, resolvedJavaVersion]);

    useEffect(() => {
        setStartScript(generatedScript);
    }, [generatedScript, setStartScript]);

    const formatRam = (mb: number) => {
        const gb = mb / 1024;
        return gb >= 1 ? `${gb.toFixed(gb % 1 === 0 ? 0 : 1)} GB` : `${mb} MB`;
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Terminal size={18} className="text-[var(--accent)]" />
                <h3 className="text-lg font-bold text-[var(--text-primary)] uppercase">{t("Startup Script")}</h3>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/50">
                <span>Java {resolvedJavaVersion}</span>
                <span>•</span>
                <span>{chosenVersion || t("No version selected")}</span>
            </div>

            <UI.Components.ToggleSwitch
                checked={aikarFlags}
                onChange={setAikarFlags}
                label={t("Use Aikar's Flags")}
                description={t("Recommended GC flags for Minecraft servers")}
            />

            <UI.Components.RangeSlider
                value={ramMb}
                onChange={setRamMb}
                min={512}
                max={32768}
                step={512}
                label={t("RAM Allocation")}
                formatValue={formatRam}
                formatBound={formatRam}
            />

            <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-white/50 uppercase">{t("start.sh")}</span>
                <textarea
                    className="w-full h-40 bg-black/40 border border-white/10 rounded-lg p-3 font-mono text-xs text-green-400 outline-none focus:border-[var(--accent)] resize-none custom-scrollbar"
                    value={startScript}
                    onChange={(e) => setStartScript(e.target.value)}
                    spellCheck={false}
                />
            </div>
        </div>
    );
};

export default StartupScript;