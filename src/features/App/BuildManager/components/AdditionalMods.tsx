import { Plug } from "lucide-react";
import { memo, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { useLoaderIncompatibilities } from "../../hooks/useLoaderIncompatibilities";
import { useServerConfigurationStore } from "@stores/useServerConfiguration";
import { useAppStore } from "@stores/useStore";
import { useGeyser } from "@api/modrinth";
import UI from "@/ui";

const Geyser = memo(() => {
    const { t } = useTranslation();

    const { chosenVersion, includeGeyser, setIncludeGeyser } = useServerConfigurationStore(
        useShallow((s) => ({
            chosenVersion: s.chosenVersion,
            includeGeyser: s.includeGeyser,
            setIncludeGeyser: s.setIncludeGeyser,
        }))
    );

    const { selectedMods, setSelectedMods } = useAppStore(
        useShallow((s) => ({
            selectedMods: s.selectedMods,
            setSelectedMods: s.setSelectedMods,
        }))
    );
    const {commonLoaders} = useLoaderIncompatibilities();
    const { data: mods } = useGeyser(chosenVersion, commonLoaders[0]);

    const geyserProjectIds = mods?.map((mod) => mod.project_id) ?? [];
    const filteredMods = selectedMods.filter((mod) => !geyserProjectIds.includes(mod.project_id));
    
    const hasGeyserMods = geyserProjectIds.some(id => 
        selectedMods.some(mod => mod.project_id === id)
    );
    
    if (includeGeyser && !hasGeyserMods && mods && mods.length > 0) {
        setSelectedMods([...filteredMods, ...mods]);
    } else if (!includeGeyser && hasGeyserMods) {
        setSelectedMods(filteredMods);
    }
    return (
        <label className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer max-w-md">
            <div className="flex flex-col">
                <span className="text-sm font-medium text-[var(--text-primary)]">{t("Include Geyser")}</span>
                <span className="text-xs text-white/40">{t("Allow Bedrock players to join your Java server")}</span>
            </div>
            <UI.Components.ToggleSwitch checked={includeGeyser} onChange={setIncludeGeyser} disabled={commonLoaders.length > 1 || (mods?.length ?? 0) === 0} />
        </label>
    );
});

const AdditionalMods = memo(() => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Plug size={18} className="text-[var(--accent)]" />
                <h3 className="text-lg font-bold text-[var(--text-primary)] uppercase">{t("Additional Mods")}</h3>
            </div>
            <Suspense fallback={<UI.Loading size="sm"/>}>
                <Geyser />
            </Suspense>
        </div>
    );
});
export default AdditionalMods;