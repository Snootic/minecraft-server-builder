import { useMemo, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Scroll, Trash2 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useServerConfigurationStore } from "@stores/useServerConfiguration";
import type { GameRuleMetadata } from "@/types";
import UI from "@/ui";
import { useGameRules } from "../hooks/useGameRules";

const GameruleEditorInner = () => {
    const { t } = useTranslation();

    const { chosenVersion, gamerules, addGamerule, removeGamerule, updateGamerule } =
        useServerConfigurationStore(
            useShallow((s) => ({
                chosenVersion: s.chosenVersion,
                gamerules: s.gamerules,
                addGamerule: s.addGamerule,
                removeGamerule: s.removeGamerule,
                updateGamerule: s.updateGamerule,
            })),
        );

    const { data: availableGamerules } = useGameRules(chosenVersion);

    const dropdownOptions = useMemo(() => {
        const addedNames = new Set(gamerules.map(r => r.name));
        return (availableGamerules ?? [])
            .filter((r: GameRuleMetadata) => !addedNames.has(r.name))
            .map((rule: GameRuleMetadata) => ({
                value: rule.name,
                label: rule.name,
                description: `${rule.description} — ${t("default")}: ${rule.defaultValue}`,
            }));
    }, [availableGamerules, gamerules, t]);

    const handleSelect = (value: string) => {
        const rule = availableGamerules?.find((r: GameRuleMetadata) => r.name === value);
        if (rule) {
            addGamerule({ name: rule.name, value: rule.defaultValue });
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Scroll size={18} className="text-[var(--accent)]" />
                <h3 className="text-lg font-bold text-[var(--text-primary)] uppercase">{t("Gamerules")}</h3>
            </div>

            <p className="text-xs text-white/40">
                {t("Add gamerules to customize your server. These will be applied on server start.")}
            </p>

            <UI.Components.SearchableDropdown
                options={dropdownOptions}
                onSelect={handleSelect}
                placeholder={t("Add a gamerule")}
                searchPlaceholder={t("Search gamerules...")}
                emptyMessage={t("All gamerules added")}
                noMatchMessage={t("No matches")}
            />

            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar">
                {gamerules.length === 0 && (
                    <div className="text-sm text-white/30 p-3 text-center italic">
                        {t("No gamerules configured")}
                    </div>
                )}
                {gamerules.map(rule => {
                    const def = availableGamerules?.find((r: GameRuleMetadata) => r.name === rule.name);
                    const isBool = def?.type === "Bool" || def?.defaultValue === "true" || def?.defaultValue === "false";

                    return (
                        <div
                            key={rule.name}
                            className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/8 transition-colors"
                        >
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-sm font-mono text-[var(--text-primary)] truncate">{rule.name}</span>
                                {def && <span className="text-xs text-white/30 truncate">{def.description}</span>}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                {isBool ? (
                                    <UI.Components.ToggleSwitch
                                        checked={rule.value === "true"}
                                        onChange={(checked) => updateGamerule(rule.name, checked ? "true" : "false")}
                                    />
                                ) : (
                                    <input
                                        type="number"
                                        className="w-20 bg-white/10 border border-white/20 rounded-md px-2 py-1 text-sm font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent)] text-center"
                                        value={rule.value}
                                        onChange={(e) => updateGamerule(rule.name, e.target.value)}
                                    />
                                )}
                                <button
                                    type="button"
                                    className="p-1.5 rounded-md hover:bg-red-500/20 transition-colors cursor-pointer"
                                    onClick={() => removeGamerule(rule.name)}
                                    title={t("Remove")}
                                >
                                    <Trash2 size={14} className="text-red-400" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const GameruleEditor = () => {
    const { t } = useTranslation();

    return (
        <Suspense
            fallback={
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Scroll size={18} className="text-[var(--accent)]" />
                        <h3 className="text-lg font-bold text-[var(--text-primary)] uppercase">{t("Gamerules")}</h3>
                    </div>
                    <div className="flex items-center justify-center text-[var(--text-primary)/40">
                        <UI.Loading size={'md'} />
                        <span className="text-sm">{t("Loading gamerules...")}</span>
                    </div>
                </div>
            }
        >
            <GameruleEditorInner />
        </Suspense>
    );
};

export default GameruleEditor;