import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";
import { useServerConfigurationStore } from "@stores/useServerConfiguration";
import UI from "@ui";
import { GAMEMODE_OPTIONS } from "@/constants/gamemodeOptions";
import { QUICK_SETTINGS_KEYS } from "@/constants/quickSettings";

const QuickSettings = () => {
    const { t } = useTranslation();

    const propertiesFile = useServerConfigurationStore((s) => s.propertiesFile);
    const setPropertiesFile = useServerConfigurationStore((s) => s.setPropertiesFile);

    const onPropertyChange = (key: string, value: string | number | boolean) => {
        const current = useServerConfigurationStore.getState().propertiesFile;
        setPropertiesFile({
            ...current,
            [key]: value,
        });
    };

    const renderField = (key: string) => {
        const value = propertiesFile[key];
        const isDisabled = !(key in propertiesFile);

        if (key === "pvp" || key === "online-mode" || key === "white-list") {
            const boolVal = value === true || value === "true";
            const label =
                key === "pvp" ? t("PvP Enabled") :
                key === "online-mode" ? t("Online Mode") :
                t("Whitelist");
            return (
                <UI.Components.ToggleSwitch
                    key={key}
                    checked={boolVal}
                    onChange={(checked) => onPropertyChange(key, checked)}
                    label={label}
                    disabled={isDisabled || (key === "white-list" && propertiesFile["online-mode"] === false)}
                />
            );
        }

        if (key === "gamemode") {
            return (
                <div key={key} className="flex flex-col gap-1 p-3 rounded-lg bg-white/5">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{t("Gamemode")}</span>
                    <UI.Components.SelectMenu
                        options={GAMEMODE_OPTIONS.map(gm => ({
                            value: gm,
                            label: t(gm.charAt(0).toUpperCase() + gm.slice(1)),
                        }))}
                        onChange={(value) => onPropertyChange(key, value)}
                        placeholder={t("Select a game version")}
                        value={String(value ?? "survival")}
                        disabled={isDisabled}
                    />
                </div>
            );
        }

        if (key === "level-seed") {
            return (
                <div key={key} className="flex flex-col gap-1 p-3 rounded-lg bg-white/5">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{t("Seed")}</span>
                    <input
                        type="text"
                        className="bg-[var(--bg-surface-light)] border border-white/20 rounded-md px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed"
                        value={String(value ?? "")}
                        placeholder={t("Leave empty for random")}
                        onChange={(e) => onPropertyChange(key, e.target.value)}
                        disabled={isDisabled}
                    />
                </div>
            );
        }

        if (key === "view-distance" || key === "simulation-distance" || key === "max-players") {
            const numVal = Number(value) || 0;
            const config = {
                "view-distance": { label: t("View Distance"), min: 2, max: 32 },
                "simulation-distance": { label: t("Simulation Distance"), min: 2, max: 32 },
                "max-players": { label: t("Max Players"), min: 1, max: 1000 },
            }[key];

            return (
                <UI.Components.RangeSlider
                    key={key}
                    value={numVal}
                    onChange={(val) => onPropertyChange(key, val)}
                    min={config.min}
                    max={config.max}
                    label={config.label}
                    disabled={isDisabled}
                />
            );
        }

        return null;
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
                <Settings size={18} className="text-[var(--accent)]" />
                <h3 className="text-lg font-bold text-[var(--text-primary)] uppercase">{t("Quick Settings")}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_SETTINGS_KEYS.map(renderField)}
            </div>
        </div>
    );
};

export default QuickSettings;